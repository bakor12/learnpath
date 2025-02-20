// src/pages/api/progress/update.ts (Corrected)
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import {  updateUserProgress, awardBadges } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { moduleId } = req.body;

  if (!moduleId) {
    return res.status(400).json({ message: 'Missing module ID' });
  }

  try {
    // Add null check and type assertion for session.user
    if (!session.user || !session.user.id) {
      return res.status(401).json({ message: 'User ID not found in session' });
    }
    const userId = session.user.id as string; // Ensure userId is a string

    await updateUserProgress(userId, moduleId);
    const newBadges = await awardBadges(userId); // Check for and award badges

    return res.status(200).json({ message: 'Progress updated successfully', newBadges });
  } catch (error: any) {
    console.error('Error updating progress:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}