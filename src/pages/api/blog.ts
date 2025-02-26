import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/db';
import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb';
import { BlogPost, ClientBlogPost, BlogImage, ImageUploadResponse } from '../../types';
import { authOptions } from './auth/[...nextauth]';
import { deleteImage } from '../../lib/cloudinary';

interface ErrorResponse {
    message: string;
    error?: string;
    errors?: { [key: string]: string }; // For validation errors
}

type BlogApiResponse = ClientBlogPost | ClientBlogPost[] | ErrorResponse | ImageUploadResponse;

export default async function handler(req: NextApiRequest, res: NextApiResponse<BlogApiResponse>) {
    // Only require authentication for non-GET requests
    if (req.method !== 'GET') {
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });

        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Forbidden' });
        }
    }

    const { db } = await connectToDatabase();
    const blogCollection = db.collection<BlogPost>('blogPosts');

    switch (req.method) {
        case 'GET':
            try {
                const blogPosts = await blogCollection.find({}).sort({ createdAt: -1 }).toArray();
                const clientBlogPosts: ClientBlogPost[] = blogPosts.map(post => ({
                    ...post,
                    _id: post._id.toString(),
                    authorId: post.authorId.toString(),
                    createdAt: post.createdAt.toISOString(),
                    updatedAt: post.updatedAt.toISOString(),
                }));
                return res.status(200).json(clientBlogPosts);
            } catch (error) {
                console.error('Failed to fetch blog posts:', error);
                return res.status(500).json({ message: 'Failed to fetch blog posts', error: (error as Error).message });
            }

        case 'POST':
            try {
                const session = await getServerSession(req, res, authOptions);
                const { title, content, excerpt, metaTitle, metaDescription, featuredImage } = req.body;

                const validationErrors = validateBlogInput(req.body);
                if (validationErrors) {
                    return res.status(400).json({ message: 'Validation Error', errors: validationErrors });
                }

                // Create blog post object (image will be added if provided)
                if (!session) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                const newBlogPost: BlogPost = {
                    _id: new ObjectId(),
                    title,
                    content,
                    excerpt,
                    authorId: new ObjectId(session.user.id),
                    authorName: session.user.name || 'Admin',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    metaTitle,
                    metaDescription,
                };

                // Add featured image if provided
                if (featuredImage) {
                    newBlogPost.featuredImage = featuredImage;
                }

                const result = await blogCollection.insertOne(newBlogPost);
                const clientBlogPost: ClientBlogPost = {
                    ...newBlogPost,
                    _id: result.insertedId.toString(),
                    authorId: newBlogPost.authorId.toString(),
                    createdAt: newBlogPost.createdAt.toISOString(),
                    updatedAt: newBlogPost.updatedAt.toISOString()
                };
                
                return res.status(201).json(clientBlogPost);
            } catch (error) {
                console.error('Failed to add blog post:', error);
                return res.status(500).json({ message: 'Failed to add blog post', error: (error as Error).message });
            }

        case 'PUT':
            try {
                const { id, title, content, excerpt, metaTitle, metaDescription, featuredImage } = req.body;

                if (!id) {
                    return res.status(400).json({ message: 'Blog post ID is required' });
                }
                
                const validationErrors = validateBlogInput(req.body);
                if (validationErrors) {
                    return res.status(400).json({ message: 'Validation Error', errors: validationErrors });
                }

                // Fetch existing blog post to check if we need to delete old image
                const existingPost = await blogCollection.findOne({ _id: new ObjectId(id) });
                
                if (!existingPost) {
                    return res.status(404).json({ message: 'Blog post not found' });
                }

                // Prepare update object
                const updateData: Partial<BlogPost> = {
                    title,
                    content,
                    excerpt,
                    metaTitle,
                    metaDescription,
                    updatedAt: new Date()
                };

                // Handle image update logic
                if (featuredImage) {
                    // Update with new image
                    updateData.featuredImage = featuredImage;
                    
                    // Delete old image if it exists and is different
                    if (existingPost.featuredImage && 
                        existingPost.featuredImage.publicId !== featuredImage.publicId) {
                        try {
                            await deleteImage(existingPost.featuredImage.publicId);
                        } catch (deleteError) {
                            console.error('Failed to delete old image:', deleteError);
                            // Continue with update even if delete fails
                        }
                    }
                } else if (req.body.removeFeaturedImage && existingPost.featuredImage) {
                    // Remove the featured image and delete from Cloudinary
                    try {
                        await deleteImage(existingPost.featuredImage.publicId);
                    } catch (deleteError) {
                        console.error('Failed to delete image:', deleteError);
                    }
                    
                    // Set featuredImage to undefined to remove it
                    updateData.featuredImage = undefined;
                }

                const result = await blogCollection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $set: updateData },
                    { returnDocument: 'after' }
                );

                if (!result) {
                    return res.status(404).json({ message: 'Blog post not found' });
                }
                
                const updatedClientBlogPost: ClientBlogPost = {
                    ...result,
                    _id: result._id.toString(),
                    authorId: result.authorId.toString(),
                    createdAt: result.createdAt.toISOString(),
                    updatedAt: result.updatedAt.toISOString(),
                };

                return res.status(200).json(updatedClientBlogPost);
            } catch (error) {
                console.error('Failed to update blog post:', error);
                return res.status(500).json({ message: 'Failed to update blog post', error: (error as Error).message });
            }

        case 'DELETE':
            try {
                const { id } = req.query;

                if (!id) {
                    return res.status(400).json({ message: 'Blog post ID is required' });
                }
                const idString = Array.isArray(id) ? id[0] : id;

                // Fetch the blog post to get image info before deletion
                const blogPost = await blogCollection.findOne({ _id: new ObjectId(idString) });
                
                if (!blogPost) {
                    return res.status(404).json({ message: 'Blog post not found' });
                }

                // Delete associated image if it exists
                if (blogPost.featuredImage && blogPost.featuredImage.publicId) {
                    try {
                        await deleteImage(blogPost.featuredImage.publicId);
                    } catch (deleteError) {
                        console.error('Failed to delete image:', deleteError);
                        // Continue with post deletion even if image delete fails
                    }
                }

                const result = await blogCollection.deleteOne({ _id: new ObjectId(idString) });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: 'Blog post not found' });
                }

                return res.status(200).json({ message: 'Blog post deleted successfully' } satisfies ErrorResponse);
            } catch (error) {
                console.error('Failed to delete blog post:', error);
                return res.status(500).json({ message: 'Failed to delete blog post', error: (error as Error).message });
            }

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Helper function for blog input validation
function validateBlogInput(data: { 
    title: string; 
    content: string; 
    excerpt?: string; 
    metaTitle?: string; 
    metaDescription?: string;
    featuredImage?: BlogImage;
}) {
    const errors: { [key: string]: string } = {};

    if (!data.title || data.title.trim().length === 0) {
        errors.title = 'Title is required';
    }
    if (data.title && data.title.trim().length > 200) {
        errors.title = 'Title is too long (max 200 characters)';
    }
    if (!data.content || data.content.trim().length === 0) {
        errors.content = 'Content is required';
    }
    if (data.excerpt && data.excerpt.trim().length > 500) {
        errors.excerpt = 'Excerpt is too long (max 500 characters)';
    }
    if (data.metaTitle && data.metaTitle.trim().length > 150) {
        errors.metaTitle = 'Meta Title is too long (max 150 characters)';
    }
    if (data.metaDescription && data.metaDescription.trim().length > 250) {
        errors.metaDescription = 'Meta Description is too long (max 250 characters)';
    }
    
    // Validate image data if provided
    if (data.featuredImage) {
        if (!data.featuredImage.url) {
            errors.featuredImage = 'Image URL is required';
        }
        if (!data.featuredImage.publicId) {
            errors.featuredImage = 'Image public ID is required';
        }
        if (data.featuredImage.alt && data.featuredImage.alt.length > 250) {
            errors.featuredImageAlt = 'Image alt text is too long (max 250 characters)';
        }
        if (data.featuredImage.caption && data.featuredImage.caption.length > 500) {
            errors.featuredImageCaption = 'Image caption is too long (max 500 characters)';
        }
    }

    return Object.keys(errors).length > 0 ? errors : null;
}