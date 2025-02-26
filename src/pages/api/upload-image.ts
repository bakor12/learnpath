import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '../../lib/db';
import { ObjectId } from 'mongodb';
import { authOptions } from './auth/[...nextauth]';
import { uploadImage } from '../../lib/cloudinary';
import { ImageUploadResponse } from '../../types';

// Configure API to accept file uploads with appropriate size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageUploadResponse>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      url: '',
      publicId: '',
      error: `Method ${req.method} not allowed`,
    });
  }

  // Check user authentication and authorization
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({
      url: '',
      publicId: '',
      error: 'Unauthorized',
    });
  }

  // Check admin role
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });

  if (!user || !user.isAdmin) {
    return res.status(403).json({
      url: '',
      publicId: '',
      error: 'Forbidden',
    });
  }

  try {
    const { image, folder } = req.body;

    // Validate image data
    if (!image) {
      return res.status(400).json({
        url: '',
        publicId: '',
        error: 'No image data provided',
      });
    }

    // Validate base64 format
    if (!isValidBase64Image(image)) {
      return res.status(400).json({
        url: '',
        publicId: '',
        error: 'Invalid image format. Must be base64 encoded',
      });
    }

    // Upload to Cloudinary
    const folderName = folder || 'blog_images';
    const uploadResult = await uploadImage(image, folderName);

    // Return success response
    return res.status(200).json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    return res.status(500).json({
      url: '',
      publicId: '',
      error: `Image upload failed: ${(error as Error).message}`,
    });
  }
}

/**
 * Validates if the string is a valid base64 encoded image
 * @param str The string to validate
 * @returns boolean indicating if valid
 */
function isValidBase64Image(str: string): boolean {
  // Check if it's a base64 data URL format
  if (!str.startsWith('data:image/')) {
    return false;
  }

  // Check for base64 indicator and the actual content
  const parts = str.split(',');
  if (parts.length !== 2) {
    return false;
  }

  const data = parts[1];
  
  // Simple base64 validation
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  return base64Regex.test(data);
}