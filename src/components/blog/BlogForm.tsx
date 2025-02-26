import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { ClientBlogPost, BlogImage } from '../../types';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface BlogFormProps {
    initialData?: ClientBlogPost | null;
    onSuccess: (blogPost: ClientBlogPost) => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [featuredImage, setFeaturedImage] = useState<BlogImage | undefined>(undefined);
    const [imageAlt, setImageAlt] = useState('');
    const [imageCaption, setImageCaption] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Initialize form with existing data
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setExcerpt(initialData.excerpt || '');
            setMetaTitle(initialData.metaTitle || '');
            setMetaDescription(initialData.metaDescription || '');
            
            if (initialData.featuredImage) {
                setFeaturedImage(initialData.featuredImage);
                setImagePreview(initialData.featuredImage.url);
                setImageAlt(initialData.featuredImage.alt || '');
                setImageCaption(initialData.featuredImage.caption || '');
            }
        }
    }, [initialData]);

    // Handle image file selection
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUploadError(null);
        
        // Reset if no files selected
        if (!e.target.files || e.target.files.length === 0) {
            setImageFile(null);
            setImagePreview(featuredImage?.url || null);
            return;
        }
        
        const file = e.target.files[0];
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size should be less than 5MB');
            return;
        }
        
        setImageFile(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Handle image upload to Cloudinary
    const handleImageUpload = async () => {
        if (!imageFile || !imagePreview) {
            setUploadError('Please select an image to upload');
            return;
        }
        
        setIsUploading(true);
        setUploadError(null);
        
        try {
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imagePreview,
                    folder: 'blog_images',
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload image');
            }
            
            // Set the featured image with Cloudinary data
            setFeaturedImage({
                url: data.url,
                publicId: data.publicId,
                alt: imageAlt,
                caption: imageCaption,
            });
            
            // Reset file input
            setImageFile(null);
        } catch (error) {
            setUploadError((error as Error).message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    // Remove featured image
    const handleRemoveImage = useCallback(() => {
        setFeaturedImage(undefined);
        setImagePreview(null);
        setImageFile(null);
        setImageAlt('');
        setImageCaption('');
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        // Check if we need to upload an image first
        if (imageFile && imagePreview && (!featuredImage || featuredImage.url !== imagePreview)) {
            await handleImageUpload();
        }

        // Construct blog data with or without image
        const blogPostData = {
            title,
            content,
            excerpt,
            metaTitle,
            metaDescription,
            ...(initialData && { id: initialData._id }),
            ...(featuredImage && { 
                featuredImage: {
                    ...featuredImage,
                    alt: imageAlt || featuredImage.alt,
                    caption: imageCaption || featuredImage.caption,
                } 
            }),
            // Add flag to remove featured image if it was removed by user
            ...(initialData?.featuredImage && !featuredImage && { removeFeaturedImage: true }),
        };

        const method = initialData ? 'PUT' : 'POST';
        const url = '/api/blog';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogPostData),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setErrors({ general: data.message || 'An unexpected error occurred.' });
                }
                setIsSubmitting(false);
                return;
            }

            onSuccess(data);
            if (!initialData) {
                router.push('/bloglist');
            }
        } catch (error) {
            console.error('Error submitting blog post:', error);
            setErrors({ general: 'An unexpected error occurred.' });
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                    required
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Title (Optional)</label>
                <input
                    type="text"
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className={`form-input ${errors.metaTitle ? 'border-red-500' : ''}`}
                />
                {errors.metaTitle && <p className="mt-1 text-sm text-red-600">{errors.metaTitle}</p>}
            </div>

            <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Description (Optional)</label>
                <textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className={`form-input ${errors.metaDescription ? 'border-red-500' : ''}`}
                    rows={3}
                />
                {errors.metaDescription && <p className="mt-1 text-sm text-red-600">{errors.metaDescription}</p>}
            </div>

            {/* Featured Image Section */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Featured Image</label>
                
                {/* Image Preview */}
                {imagePreview && (
                    <div className="relative border rounded-md overflow-hidden">
                        <div className="relative w-full h-64">
                            <Image 
                                src={imagePreview} 
                                alt={imageAlt || "Featured image preview"} 
                                fill
                                className="object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            title="Remove image"
                        >
                            <X size={16} />
                        </button>
                        
                        {/* Image metadata fields */}
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 space-y-2">
                            <div>
                                <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Alt Text
                                </label>
                                <input
                                    type="text"
                                    id="imageAlt"
                                    value={imageAlt}
                                    onChange={(e) => setImageAlt(e.target.value)}
                                    className="form-input mt-1"
                                    placeholder="Describe the image for accessibility"
                                />
                            </div>
                            <div>
                                <label htmlFor="imageCaption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Caption (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="imageCaption"
                                    value={imageCaption}
                                    onChange={(e) => setImageCaption(e.target.value)}
                                    className="form-input mt-1"
                                    placeholder="Add a caption for this image"
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Image upload interface */}
                {!imagePreview && (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center">
                        <div className="flex flex-col items-center">
                            <ImageIcon size={48} className="text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Drag and drop an image, or click to select a file
                            </p>
                            <div className="mt-4">
                                <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md inline-flex items-center">
                                    <Upload size={16} className="mr-2" />
                                    <span>Select Image</span>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Image file selected but not yet uploaded */}
                {imageFile && imagePreview && !featuredImage && (
                    <div className="flex items-center justify-center mt-2">
                        <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={isUploading}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md inline-flex items-center disabled:bg-gray-400"
                        >
                            <Upload size={16} className="mr-2" />
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                        </button>
                    </div>
                )}
                
                {/* Display upload error if any */}
                {uploadError && (
                    <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                )}
            </div>

            <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt (Optional)</label>
                <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className={`form-input ${errors.excerpt ? 'border-red-500' : ''}`}
                    rows={3}
                    placeholder="A brief summary of the blog post"
                />
                {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`form-input ${errors.content ? 'border-red-500' : ''}`}
                    rows={15}
                    required
                />
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
            </div>

            {/* General error message */}
            {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{errors.general}</span>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mr-4 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800"
                >
                    {isSubmitting ? 'Saving...' : initialData ? 'Update Blog Post' : 'Create Blog Post'}
                </button>
            </div>
        </form>
    );
};

export default BlogForm;