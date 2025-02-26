// src/pages/blogadd.tsx (Modified)
import React, { useState, useEffect } from 'react';
import BlogForm from '../components/blog/BlogForm';
import { ClientBlogPost } from '../types';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const AddBlogPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const handleSuccess = (blogPost: ClientBlogPost) => {
        console.log('Blog post created:', blogPost);
    };

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            const session = await getSession();

            // *** CRITICAL: Log the session to the browser console ***
            console.log("Session in blogadd.tsx:", session);

            if (!session) {
                router.replace('/adminlogin');
                return;
            }

            const res = await fetch('/api/admin');
            if (!res.ok) {
                router.replace('/adminlogin');
                return;
            }
            const data = await res.json();

            let isAdmin = false;
            if (data && data.length > 0) {
                const sessionUser = data.find((u: { email: string | null | undefined; }) => u.email === session.user.email);
                isAdmin = sessionUser?.isAdmin
            }

            if (!isAdmin) {
                router.replace('/adminlogin');
                return;
            }

            setLoading(false);
        };
        checkSession();
    }, [router]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>Add Blog Post</title>
            </Head>
            <div className="container-padded page-section">
                <h1 className="text-3xl font-bold mb-8">Add New Blog Post</h1>
                <BlogForm onSuccess={handleSuccess} />
            </div>
        </>
    );
};

export default AddBlogPage;