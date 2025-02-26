import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads an image to Cloudinary
 * @param file Base64 encoded image data
 * @param folderName Optional folder name to organize uploads
 * @returns Promise with upload result containing secure URL and public ID
 */
export async function uploadImage(
  file: string, 
  folderName: string = 'blog_images'
): Promise<{secure_url: string; public_id: string}> {
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: folderName,
      resource_type: 'image',
      // Add additional options as needed
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('Image upload failed');
  }
}

/**
 * Deletes an image from Cloudinary
 * @param publicId The public ID of the image to delete
 * @returns Promise with deletion result
 */
export async function deleteImage(publicId: string): Promise<{result: string}> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { result: result.result };
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
    throw new Error('Image deletion failed');
  }
}