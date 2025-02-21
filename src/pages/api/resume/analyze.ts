// src/pages/api/resume/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/db';
import { analyzeResume } from '../../../services/geminiApi';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = session.user.id;
  console.log("UserID from session:", userId); // Log the userId

  try {
    const { db } = await connectToDatabase();
    console.log("Querying for user ID:", userId); // Log before the query
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) }); // Use _id and ObjectId

    console.log("User found:", user); // Log the entire user object

    // Check for missing user, missing resumeText, or empty resumeText
    if (!user || !user.resumeText || user.resumeText.trim() === '') {
      console.log("Resume text not found or is empty. User:", user); // Log before returning 400
      return res.status(400).json({ message: 'Resume text not found or is empty.' }); // More specific message
    }
    const learningGoals = user.learningGoals || [];
    const userSkills = user.skills || [];

    const analysisResult = await analyzeResume(user.resumeText, learningGoals, userSkills);

    return res.status(200).json(analysisResult);
  } catch (error: unknown) {
    console.error('Error resume analyze:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}