import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';
import { ClientBlogPost, BlogPost } from '../../../types';
import { ObjectId } from 'mongodb';

interface ErrorResponse {
  message: string;
  error?: string;
}

type BlogDetailApiResponse = ClientBlogPost | ErrorResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<BlogDetailApiResponse>) {
  // Get the blog post ID from the URL
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Blog post ID is required' });
  }

  // Connect to the database
  try {
    const { db } = await connectToDatabase();
    const blogCollection = db.collection<BlogPost>('blogPosts');

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        try {
          // Validate the ID format to prevent server errors
          let objectId: ObjectId;
          try {
            objectId = new ObjectId(id);
          } catch (error: unknown) {
            return res.status(400).json({ 
              message: 'Invalid blog post ID format',
              error: error instanceof Error ? error.message : 'The provided ID is not a valid MongoDB ObjectId'
            });
          }

          // Fetch the blog post from the database
          const blogPost = await blogCollection.findOne({ _id: objectId });
          
          // Check if the blog post exists
          if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
          }
          
          // Convert to a client-friendly format
          const clientBlogPost: ClientBlogPost = {
            ...blogPost,
            _id: blogPost._id.toString(),
            authorId: blogPost.authorId.toString(),
            createdAt: blogPost.createdAt.toISOString(),
            updatedAt: blogPost.updatedAt.toISOString(),
          };

          return res.status(200).json(clientBlogPost);
        } catch (error) {
          console.error('Failed to fetch blog post:', error);
          return res.status(500).json({ message: 'Failed to fetch blog post', error: (error as Error).message });
        }

      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ message: 'Failed to connect to the database', error: (error as Error).message });
  }
}