// src/pages/api/learning-path/delete.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/db';
//import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Learning path ID is required' });
  }

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('learning_paths').deleteOne({ id: id, userId: session.user.id }); // Ensure user owns the path

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Learning path not found or you do not have permission to delete it.' });
    }

    return res.status(200).json({ message: 'Learning path deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting learning path:', error);
    return res.status(500).json({ message: (error as Error).message || 'Internal Server Error' });
  }
}