// src/pages/api/profile/update.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/db';
import { User } from '../../../types';
import formidable, { File } from 'formidable'; // Import File type
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { ObjectId } from 'mongodb';

export const config = {
    api: {
        bodyParser: false, // Disable default body parsing to use formidable
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

    // Corrected instantiation of formidable:
    const form = formidable(); // Use formidable() directly, NOT new formidable.IncomingForm()

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Formidable error:", err);
            return res.status(500).json({ message: 'Failed to process form data' });
        }

        try {
            const { db } = await connectToDatabase();
            const updateData: Partial<User> = {};

            // Handle skills, learningGoals, and learningStyle
            if (fields.skills) {
                updateData.skills = Array.isArray(fields.skills) ? fields.skills : [fields.skills];
            }
            if (fields.learningGoals) {
                updateData.learningGoals = Array.isArray(fields.learningGoals) ? fields.learningGoals : [fields.learningGoals];
            }
            if (fields.learningStyle) {
                const learningStyle = Array.isArray(fields.learningStyle) ? fields.learningStyle[0] : fields.learningStyle;
                if (!['visual', 'auditory', 'kinesthetic'].includes(learningStyle)) {
                    throw new Error('Invalid learning style');
                }
                updateData.learningStyle = learningStyle as 'visual' | 'auditory' | 'kinesthetic';
            }

            // Handle resume file (if provided)
            if (files.resume) {
                const resumeFile: File | File[] = files.resume; // Correct type annotation

                let singleResumeFile: File;

                if (Array.isArray(resumeFile)) {
                  singleResumeFile = resumeFile[0];
                } else {
                  singleResumeFile = resumeFile;
                }


                // Check file type (only allow PDF)
                if (singleResumeFile.mimetype !== 'application/pdf') {
                    return res.status(400).json({ message: 'Only PDF files are allowed' });
                }

                const fileContent = fs.readFileSync(singleResumeFile.filepath);
                const pdfData = await pdfParse(fileContent);
                const resumeText = pdfData.text;

                // Store the resume text (or a link to it) in your database
                updateData.resumeText = resumeText;
            }


            // Update the user's profile in the database
            const result = await db.collection('users').updateOne(
                { _id: new ObjectId(userId) },
                { $set: updateData }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: 'User not found or no changes made' });
            }
            const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });

            return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });

        } catch (error: unknown) {
            console.error('Error updating profile:', error);
            if (error instanceof Error) {
              return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
          }
    });
}