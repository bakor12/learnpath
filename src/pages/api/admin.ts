// src/pages/api/admin.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/db';
import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the user is authenticated and has admin privileges
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });

    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden' });
    }


  if (req.method === 'GET') {
    // Example: Get all users (admin-only)
    try {
      const { db } = await connectToDatabase();
      const users = await db.collection('users').find({}).toArray();
      return res.status(200).json(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return res.status(500).json({ message: 'Failed to fetch users', error: (error as Error).message });
    }
  } else if (req.method === 'POST') {
        // Example:  Add a new learning module (admin only)
        if (req.body.action === 'addModule') {
            try {
                const { title, description, estimatedTime, difficulty, resourceLinks, prerequisites } = req.body;

                // Input validation (using a separate function for reusability)
                const validationErrors = validateModuleInput(req.body);
                if (validationErrors) {
                    return res.status(400).json({ message: 'Validation Error', errors: validationErrors });
                }


                const { db } = await connectToDatabase();
                const result = await db.collection('learningModules').insertOne({
                    title,
                    description,
                    estimatedTime,
                    difficulty,
                    resourceLinks,
                    prerequisites,
                });

                return res.status(201).json({ message: 'Module added successfully', moduleId: result.insertedId });

            } catch (error) {
                console.error("Error adding module:", error);
                return res.status(500).json({ message: 'Failed to add module', error: (error as Error).message });
            }
        }
         // Example:  Delete a user (admin only)
         else if (req.body.action === 'deleteUser') {
            try {
                const { userId } = req.body;

                if (!userId) {
                    return res.status(400).json({ message: 'User ID is required' });
                }

                const { db } = await connectToDatabase();
                const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }

                return res.status(200).json({ message: 'User deleted successfully' });

            } catch (error) {
                console.error("Error deleting user:", error);
                return res.status(500).json({ message: 'Failed to delete user', error: (error as Error).message });
            }
        }
        else {
            return res.status(400).json({ message: 'Invalid action' });
        }
    }

  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Interface for module input data
interface ModuleInput {
    title: string;
    description: string;
    estimatedTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    resourceLinks: string[];
    prerequisites: string[];
}

// Helper function for module input validation
function validateModuleInput(data: ModuleInput) {
    const errors: { [key: string]: string } = {};

    if (!data.title || data.title.trim().length === 0) {
        errors.title = 'Title is required';
    }
    if (data.title && data.title.trim().length > 100) { // Example length constraint
        errors.title = 'Title is too long (max 100 characters)';
    }
    if (!data.description) {
        errors.description = 'Description is required';
    }
    if (!data.estimatedTime) {
        errors.estimatedTime = 'Estimated time is required';
    }
    if (!data.difficulty || !['beginner', 'intermediate', 'advanced'].includes(data.difficulty)) {
        errors.difficulty = 'Difficulty must be one of: beginner, intermediate, advanced';
    }
    if (!Array.isArray(data.resourceLinks)) {
        errors.resourceLinks = 'Resource links must be an array';
    }
    if (!Array.isArray(data.prerequisites)) {
        errors.prerequisites = 'Prerequisites must be an array';
    }
    // Add more validation rules as needed

    return Object.keys(errors).length > 0 ? errors : null;
}