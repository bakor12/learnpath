// src/pages/api/learning-path/resources/[resourceId]/[action].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]'; // Corrected spelling: nextauth
import { connectToDatabase } from '../../../../../lib/db';
import { ObjectId, UpdateFilter } from 'mongodb'; // Import UpdateFilter
import { awardBadges } from '../../../../../lib/db';
import { User } from '@/types'; // Import the User type

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { resourceId, action } = req.query;

  // Validate inputs
  if (
    typeof resourceId !== 'string' ||
    !resourceId ||
    typeof action !== 'string' ||
    !['save', 'complete', 'start'].includes(action)
  ) {
    return res.status(400).json({ message: 'Invalid request parameters' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = session.user.id;

  try {
    const { db } = await connectToDatabase();

    // --- Input Validation ---
    if (!ObjectId.isValid(resourceId)) {
      return res.status(400).json({ message: 'Invalid resource ID' });
    }

    // Define the update operation with a specific type
    let updateOperation: UpdateFilter<User>; // Use UpdateFilter with the User type

    switch (action) {
      case 'save':
        updateOperation = {
          $addToSet: { savedResources: resourceId },
        };
        break;

      case 'complete':
        updateOperation = {
          $addToSet: { completedResources: resourceId },
          $pull: { inProgressResources: { $in: [resourceId] } }, // Correct
        };
        break;

      case 'start':
        updateOperation = {
          $addToSet: { inProgressResources: resourceId },
          $pull: { savedResources: { $in: [resourceId] } }, // Correct
        };
        break;

      default:
        return res.status(400).json({ message: 'Invalid action' });
    }


    // Perform the update operation with the correctly typed update
    await db.collection<User>('users').updateOne( // Specify User type here
      { _id: new ObjectId(userId) },
      updateOperation
    );


    if (action === 'complete') {
        // --- Badge Awarding Logic ---
        const updatedUser = await db.collection<User>('users').findOne({ _id: new ObjectId(userId) }); // Specify User type
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found after update.' });
        }

        const newBadges = await awardBadges(userId);
        if (newBadges.length > 0) {
          return res.status(200).json({ message: 'Resource status updated, new badges awarded', newBadges });
        }
    }


    res.status(200).json({ message: 'Resource status updated' });

  } catch (error) {
    console.error('Error updating resource status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}