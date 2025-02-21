// src/pages/api/learning-path/list.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { LearningPath } from '../../../types';

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
    const learningPaths: LearningPath[] = await db
      .collection<LearningPath>('learning_paths')
      .find({ userId: userId }) // Efficiently query by userId
      .toArray();

      // Fetch user data to get completedModules
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        const completedModules = user?.completedModules || [];

        // Mark completed modules in each learning path
        const updatedLearningPaths = learningPaths.map(path => ({
            ...path,
            modules: path.modules.map(module => ({
                ...module,
                completed: completedModules.includes(module.id),
            })),
        }));

    return res.status(200).json(updatedLearningPaths);
  } catch (error: unknown) {
    console.error('Error fetching learning paths:', error);
    return res.status(500).json({ message: (error as Error).message || 'Internal Server Error' });
  }
}