// src/pages/blogedit/[id].tsx
import React from 'react';
import { useRouter } from 'next/router';
import BlogForm from '../../components/blog/BlogForm';
import { BlogPost, ClientBlogPost } from '../../types'; // Import both
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

interface EditBlogPageProps {
    initialBlogPost: ClientBlogPost | null; // Use ClientBlogPost for props
}

const EditBlogPage: React.FC<EditBlogPageProps> = ({ initialBlogPost }) => {
    const router = useRouter();

    const handleSuccess = (updatedBlogPost: ClientBlogPost) => { // Expect ClientBlogPost
        console.log('Blog post updated:', updatedBlogPost);
        router.push('/bloglist');
    };

    if (!initialBlogPost) {
        return <div className="container-padded page-section">Error: Blog post not found.</div>;
    }

    return (
        <>
            <Head>
                <title>Edit Blog Post</title>
            </Head>
            <div className="container-padded page-section">
                <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
                {/* BlogForm should be updated to work with ClientBlogPost */}
                <BlogForm onSuccess={handleSuccess} initialData={initialBlogPost} />
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const { id } = context.params as { id: string };

    if (!session || !session.user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });

    if (!user || !user.isAdmin) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    try {
        const blogPost = await db.collection<BlogPost>('blogPosts').findOne({ _id: new ObjectId(id) });

        if (!blogPost) {
            return {
                props: { initialBlogPost: null },
            };
        }

        // Convert to ClientBlogPost before passing as props
        const serializedBlogPost: ClientBlogPost = {
            ...blogPost,
            _id: blogPost._id.toString(),
            authorId: blogPost.authorId.toString(),
            createdAt: blogPost.createdAt.toISOString(), // Convert Date to ISO string
            updatedAt: blogPost.updatedAt.toISOString(), // Convert Date to ISO string
        };

        return {
            props: { initialBlogPost: serializedBlogPost },
        };
    } catch (error) {
        console.error("Error fetching blog post for editing:", error);
        return {
            props: { initialBlogPost: null, error: "Failed to fetch blog post." },
        };
    }
};

export default EditBlogPage;