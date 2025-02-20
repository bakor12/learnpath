// src/pages/api/recommendations.ts (Corrected)
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { connectToDatabase } from '../../lib/db';
import { recommendResources } from '../../services/geminiApi';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { moduleId } = req.query;
  console.log("Received moduleId:", moduleId); // Log the received moduleId

  if (!moduleId || typeof moduleId !== 'string') {
    return res.status(400).json({ message: 'Invalid module ID' });
  }

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId (session.user.id) });
    const learningPath = await db.collection('learning_paths').findOne({ userId: session.user.id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!learningPath) {
      return res.status(404).json({ message: 'Learning Path not found' });
    }

    const module = learningPath.modules.find((m: { id: string }) => m.id === moduleId);

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const recommendations = await recommendResources(
      module.title,
      module.description,
      user.learningStyle,
      user.skills || []
    );

    return res.status(200).json(recommendations);
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}