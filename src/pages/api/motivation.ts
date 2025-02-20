// src/pages/api/motivation.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { connectToDatabase } from '../../lib/db';
import { generateMotivationalMessage } from '../../services/geminiApi';
import { ObjectId } from 'mongodb'
//import { User } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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

    const completedModulesCount = user.completedModules ? user.completedModules.length : 0;
    const learningGoals = user.learningGoals || [];
    const badges = user.badges || [];

    const message = await generateMotivationalMessage(completedModulesCount, learningGoals, badges);

    return res.status(200).json({ message });
  } catch (error: unknown) {
    console.error('Error fetching motivational message:', error);
    return res.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' });
  }
}