// src/pages/api/learning-path/resources.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib/db';
import { Recommendation, LearningModule } from '@/types';
import { ObjectId, Document } from 'mongodb'; // Import Document

interface ResourceFilters {
  type: 'all' | 'article' | 'video' | 'course' | 'other';
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  searchQuery: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = session.user.id;

  // Get filter parameters from the query string
  const {
    type = 'all',
    difficulty = 'all',
    search = '',
  } = req.query;

  // Validate filter parameters
  const validTypes = ['all', 'article', 'video', 'course', 'other'];
  const validDifficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  if (
    typeof type !== 'string' ||
    !validTypes.includes(type) ||
    typeof difficulty !== 'string' ||
    !validDifficulties.includes(difficulty) ||
    typeof search !== 'string'
  ) {
    return res.status(400).json({ message: 'Invalid filter parameters' });
  }

  const filters: ResourceFilters = {
    type: type as ResourceFilters['type'],
    difficulty: difficulty as ResourceFilters['difficulty'],
    searchQuery: search,
  };

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const learningPath = await db.collection('learning_paths').findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!learningPath) {
      return res.status(404).json({ message: 'Learning Path not found' });
    }
      // Build the aggregation pipeline
    const aggregationPipeline: Document[] = [ // Use Document[] instead of any[]
      {
        $match: { userId: userId },
      },
      {
        $unwind: '$modules',
      },
      {
        $lookup: {
          from: 'recommendations', // Assuming you have a 'recommendations' collection
          localField: 'modules.id',
          foreignField: 'moduleId',
          as: 'recommendations',
        },
      },
      {
        $project: {
          _id: 0,
          'modules.id':1,
          'modules.title': 1,
          'modules.description': 1,
          'modules.estimatedTime': 1,
          'modules.difficulty': 1,
          'modules.resourceLinks': 1,
          'modules.prerequisites': 1,
          recommendations: 1
        }
      },
    ];

    // Apply type filter
    if (filters.type !== 'all') {
      aggregationPipeline.push({
        $match: { 'recommendations.type': filters.type },
      });
    }

    // Apply difficulty filter
    if (filters.difficulty !== 'all') {
      aggregationPipeline.push({
        $match: { 'modules.difficulty': filters.difficulty },
      });
    }

    // Apply search filter (using a regex for case-insensitive partial matching)
    if (filters.searchQuery) {
      const searchRegex = new RegExp(filters.searchQuery, 'i');
      aggregationPipeline.push({
        $match: {
          $or: [
            { 'modules.title': { $regex: searchRegex } },
            { 'modules.description': { $regex: searchRegex } },
            { 'recommendations.title': { $regex: searchRegex } },
            { 'recommendations.description': { $regex: searchRegex } },
          ],
        },
      });
    }

    const result = await db.collection('learning_paths').aggregate(aggregationPipeline).toArray();

    // Flatten the results and separate modules and recommendations
    const flattenedResults: { modules: LearningModule[]; recommendations: Recommendation[] } = {
        modules: [],
        recommendations: [],
      };

      result.forEach(item => {
        if (item.modules) {
          flattenedResults.modules.push(item.modules);
        }
        if (item.recommendations && Array.isArray(item.recommendations)) {
          item.recommendations.forEach((rec: Recommendation) => {
            flattenedResults.recommendations.push(rec);
          });
        }
      });

    return res.status(200).json(flattenedResults);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}