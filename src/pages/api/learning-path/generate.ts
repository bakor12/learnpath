// src/pages/api/learning-path/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/db';
import { analyzeResume, generateLearningPath } from '../../../services/geminiApi';
import { LearningPath } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

// Set a timeout for the API route
export const config = {
  api: {
    responseLimit: false,
    // Increase body parser size limit if needed
    bodyParser: {
      sizeLimit: '1mb',
    },
    // Set a longer timeout for this API route (30 seconds)
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = session.user.id;

    try {
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // First get the resume analysis
        let identifiedSkills: string[] = [];
        let skillGaps: string[] = [];
        let suggestedSkills: string[] = [];

        if (user.resumeText) {
            try {
                const analysis = await analyzeResume(user.resumeText, user.learningGoals || [], user.skills || []);
                identifiedSkills = analysis.identifiedSkills;
                skillGaps = analysis.skillGaps;
                suggestedSkills = analysis.suggestedSkills;
            } catch (analysisError) {
                console.error('Resume analysis failed:', analysisError);
                // Continue with empty arrays if resume analysis fails
            }
        }
        
        const learningStyle = user.learningStyle;

        try {
            const learningPathData = await generateLearningPath(identifiedSkills, skillGaps, suggestedSkills, learningStyle);

            // --- FIX: Handle BOTH possible response structures ---
            let modulesArray;
            if (learningPathData && Array.isArray(learningPathData.learningPath)) {
                // Case 1: learningPath is directly the array
                modulesArray = learningPathData.learningPath;
            } else if (learningPathData && learningPathData.learningPath && Array.isArray(learningPathData.learningPath.modules)) {
                // Case 2: learningPath is an object with a modules property
                modulesArray = learningPathData.learningPath.modules;
            } else if (Array.isArray(learningPathData)) {
                // Case 3: response is directly an array
                modulesArray = learningPathData;
            } else {
                // None of the expected structures found: use fallback
                console.error("generateLearningPath did not return a recognized format:", learningPathData);
                modulesArray = [
                    {
                        id: "default1",
                        title: "Getting Started",
                        description: "Introduction to your learning journey",
                        estimatedTime: "1 hour",
                        difficulty: "beginner",
                        resourceLinks: ["https://example.com/resources"],
                        prerequisites: []
                    }
                ];
            }
            // --- END FIX ---

            const newLearningPath: LearningPath = {
                id: uuidv4(),
                userId: userId,
                modules: modulesArray, // Use the extracted array
            };

            await db.collection('learning_paths').insertOne(newLearningPath);

            return res.status(200).json(newLearningPath); // Return the generated path
        } catch (error: unknown) {
            // Create a fallback learning path if generation fails
            console.error('Error generating learning path:', error);
            
            // Fallback path with basic content
            const fallbackPath: LearningPath = {
                id: uuidv4(),
                userId: userId,
                modules: [
                    {
                        id: "fallback1",
                        title: "Getting Started",
                        description: "Introduction to your learning journey",
                        estimatedTime: "1 hour",
                        difficulty: "beginner",
                        resourceLinks: ["https://example.com/resources"],
                        prerequisites: []
                    }
                ]
            };
            
            try {
                await db.collection('learning_paths').insertOne(fallbackPath);
                return res.status(200).json(fallbackPath);
            } catch (dbError) {
                // If database insertion fails too, log and return error
                console.error('Database insertion failed:', dbError);
                return res.status(500).json({ message: 'Failed to create learning path' });
            }
        }
    } catch (error: unknown) {
        console.error('Error in learning path API route:', error);
        return res.status(500).json({ message: (error as Error).message || 'Internal Server Error' });
    }
}