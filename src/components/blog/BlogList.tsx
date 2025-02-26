// src/components/blog/BlogList.tsx
import React from 'react';
import { ClientBlogPost } from '../../types';
import Link from 'next/link';

interface BlogListProps {
    blogPosts: ClientBlogPost[];
    onDelete: (id: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogPosts, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Excerpt</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {blogPosts.map((post) => {
                        // Parse createdAt string to Date object
                        const createdAtDate = new Date(post.createdAt);
                        return (
                            <tr key={post._id.toString()}>
                                <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                                <td className="px-6 py-4">{post.excerpt}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {createdAtDate.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                    <Link href={`/blogedit/${post._id.toString()}`} passHref legacyBehavior>
                                        <a className="btn-secondary">Edit</a>
                                    </Link>

                                    <button
                                        onClick={() => onDelete(post._id.toString())}
                                        className="btn-secondary bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BlogList;