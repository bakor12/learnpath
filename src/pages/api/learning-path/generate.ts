// src/pages/api/learning-path/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/db';
import { analyzeResume, generateLearningPath } from '../../../services/geminiApi';
import { LearningPath } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

// Increase the timeout for this API route (to 60 seconds)
export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '1mb', // Keep this if you might have large resumes
    },
    externalResolver: true, // This is fine; it just disables a warning
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
        // Continue with empty arrays if resume analysis fails, BUT log the error
      }
    }

    const learningStyle = user.learningStyle;

    try {
      const learningPathData = await generateLearningPath(identifiedSkills, skillGaps, suggestedSkills, learningStyle);

      let modulesArray;
      if (learningPathData && Array.isArray(learningPathData.learningPath)) {
        modulesArray = learningPathData.learningPath;
      } else if (learningPathData && learningPathData.learningPath && Array.isArray(learningPathData.learningPath.modules)) {
        modulesArray = learningPathData.learningPath.modules;
      } else if (Array.isArray(learningPathData)) {
        modulesArray = learningPathData;
      } else {
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

      const newLearningPath: LearningPath = {
        id: uuidv4(),
        userId: userId,
        modules: modulesArray,
      };

      await db.collection('learning_paths').insertOne(newLearningPath);
      return res.status(200).json(newLearningPath);

    } catch (error: unknown) {
      // Handle Gemini API errors and other potential errors
      console.error('Error generating learning path:', error);

      // Return a JSON error response
      return res.status(500).json({ message: 'Failed to generate learning path. Please try again later.' });
    }
  } catch (error: unknown) {
    console.error('Error in learning path API route:', error);
     // Handle database connection errors
    return res.status(500).json({ message: 'Database connection error. Please try again later.' });
  }
}