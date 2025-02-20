// src/pages/api/profile/[userId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]';
import { ObjectId } from 'mongodb'; // Import ObjectId

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const { db } = await connectToDatabase();
        // Use _id and ObjectId to query correctly
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //Remove password before sending
        const {password, ...userWithoutPassword} = user;

        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}