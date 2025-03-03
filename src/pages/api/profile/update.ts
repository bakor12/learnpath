// src/pages/api/profile/update.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/db';
import { User } from '../../../types';
import formidable, { File } from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { ObjectId } from 'mongodb';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = session.user.id;

    const form = formidable();

    return new Promise<void>((resolve) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Formidable error:", err);
                res.status(500).json({ message: 'Failed to process form data' });
                resolve();
                return;
            }

            try {
                const { db } = await connectToDatabase();
                const updateData: Partial<User> = {};

                if (fields.skills) {
                    try {
                        updateData.skills = JSON.parse(fields.skills[0] as string);
                    } catch (parseError) {
                        console.error("Error parsing skills:", parseError);
                        res.status(400).json({ message: 'Invalid skills data' });
                        resolve();
                        return;
                    }
                }

                if (fields.learningGoals) {
                    try {
                        updateData.learningGoals = JSON.parse(fields.learningGoals[0] as string);
                    } catch (parseError) {
                        console.error("Error parsing learningGoals:", parseError);
                        res.status(400).json({ message: 'Invalid learningGoals data' });
                        resolve();
                        return;
                    }
                }

                if (fields.learningStyle) {
                    const learningStyle = Array.isArray(fields.learningStyle)
                        ? fields.learningStyle[0]
                        : fields.learningStyle;
                    if (!['visual', 'auditory', 'kinesthetic'].includes(String(learningStyle))) {
                        res.status(400).json({ message: 'Invalid learning style' });
                        resolve();
                        return;
                    }
                    updateData.learningStyle = learningStyle as 'visual' | 'auditory' | 'kinesthetic';
                }

                if (files.resume) {
                    const resumeFile: File | File[] = files.resume;
                    let singleResumeFile: File;

                    if (Array.isArray(resumeFile)) {
                        singleResumeFile = resumeFile[0];
                    } else {
                        singleResumeFile = resumeFile;
                    }

                    if (singleResumeFile.mimetype !== 'application/pdf') {
                        res.status(400).json({ message: 'Only PDF files are allowed' });
                        resolve();
                        return;
                    }

                    const fileContent = fs.readFileSync(singleResumeFile.filepath);
                    const pdfData = await pdfParse(fileContent);
                    updateData.resumeText = pdfData.text;
                }
                const result = await db.collection('users').updateOne(
                    { _id: new ObjectId(userId) },
                    { $set: updateData }
                );

                // ALWAYS return the user, even if no modifications were made
                const  user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    resolve();
                    return;
                }

                if (result.modifiedCount === 0) {
                    // Return the EXISTING user data
                    res.status(200).json({ message: 'User found, but no changes were made', user: user });
                    resolve();
                    return;
                }

                res.status(200).json({ message: 'Profile updated successfully', user: user });
                resolve();

            } catch (error: unknown) {
                console.error('Error updating profile:', error);
                if (error instanceof Error) {
                    res.status(500).json({ message: error.message });
                } else {
                    res.status(500).json({ message: 'Internal Server Error' });
                }
                resolve();
            }
        });
    });
}