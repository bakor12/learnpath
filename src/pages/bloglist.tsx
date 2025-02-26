// src/pages/bloglist.tsx
import React, { useState, useEffect } from 'react';
import { ClientBlogPost } from '../types'; // Import ClientBlogPost
import BlogList from '../components/blog/BlogList';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// No need for ApiBlogPost, use ClientBlogPost directly

const BlogListPage = () => {
    const [blogPosts, setBlogPosts] = useState<ClientBlogPost[]>([]); // Use ClientBlogPost
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchBlogPosts = async () => {
            setLoading(true);
            setError('');
            try {
                const session = await getSession();
                if (!session) {
                    router.push('/adminlogin');
                    return; // Important: Return after redirect
                }

                 // Fetch user data and check isAdmin
                const resUser = await fetch('/api/admin');
                if (!resUser.ok) {
                    router.replace('/adminlogin'); // Redirect if API call fails
                    return;
                }
                const dataUser = await resUser.json();

                // Check if the user is an admin
                let isAdmin = false;
                if(dataUser && dataUser.length > 0){
                    const sessionUser = dataUser.find((u: { email: string | null | undefined; }) => u.email === session.user.email);
                    isAdmin = sessionUser?.isAdmin
                }

                if (!isAdmin) {
                    router.replace('/adminlogin');  // Or a "Not Authorized" page
                    return;
                }

                const res = await fetch('/api/blog');
                if (!res.ok) {
                    const errorData = await res.json();
                    setError(errorData.message || 'Failed to fetch blog posts');
                    return;
                }
                const data: ClientBlogPost[] = await res.json(); // Expect an array of ClientBlogPost

                // No conversion needed here, the API returns ClientBlogPost format
                if (Array.isArray(data)) {
                    setBlogPosts(data);
                } else {
                    setError('Received data is not in the expected format.');
                }

            } catch (err) {
                setError(`An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogPosts();
    }, [router]);

    const handleDelete = async (id: string) => { // id is a string
        if (!confirm('Are you sure you want to delete this blog post?')) {
            return;
        }

        try {
            const res = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.message || 'Failed to delete blog post');
                return;
            }

            // Remove the deleted post from the state (using string IDs)
            setBlogPosts(blogPosts.filter((post) => post._id !== id)); // Simpler string comparison
        } catch (err) {
            console.error('Delete error:', err);
            setError('An unexpected error occurred during deletion.');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
    }

    return (
        <>
            <Head>
                <title>Blog List</title>
            </Head>
            <div className="container-padded page-section">
                <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
                <Link href="/blogadd" passHref legacyBehavior>
                    <a className="btn-primary mb-4 inline-block">Add New Post</a>
                </Link>
                {blogPosts.length === 0 ? (
                    <p>No blog posts found.</p>
                ) : (
                    // Ensure BlogList component expects ClientBlogPost
                    <BlogList blogPosts={blogPosts} onDelete={handleDelete} />
                )}
            </div>
        </>
    );
};

export default BlogListPage;