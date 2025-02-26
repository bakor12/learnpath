import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClientBlogPost } from '../../types';
import { formatDate, formatDistanceToNow, calculateReadingTime } from '../../lib/dateUtils';

interface BlogDetailProps {
  post: ClientBlogPost | null;
  error?: string;
}

export default function BlogDetail({ post, error }: BlogDetailProps) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    const checkBookmark = () => {
      if (post) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
        setIsBookmarked(bookmarks.includes(post._id));
      }
    };

    window.addEventListener('scroll', handleScroll);
    checkBookmark();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  if (router.isFallback) {
    return <BlogPostSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 dark:text-red-400 mb-4">
            {error || 'Blog post not found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The blog post you are looking for might have been removed or is temporarily unavailable.
          </p>
          <Link
            href="/blog"
            className="btn-primary flex items-center mx-auto w-fit" // Use btn-primary class
          >
            <ArrowLeft className="mr-2" size={16} /> Back to all articles
          </Link>
        </div>
      </div>
    );
  }

  const toggleBookmark = () => {
    if (!post) return;

    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    const updatedBookmarks = isBookmarked
      ? bookmarks.filter((id: string) => id !== post._id)
      : [...bookmarks, post._id];

    localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const sharePost = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'copyLink') => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;

    try {
      switch (platform) {
        case 'twitter':
          await window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'facebook':
          await window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'linkedin':
          await window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'copyLink':
          await navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
          break;
      }
    } catch (err) {
      console.error('Failed to share: ', err);
      alert('Failed to share. Please try again.'); // Provide user feedback
    } finally {
      setShowShareOptions(false);
    }
  };

  const readingTime = calculateReadingTime(post.content);
  const publishDate = new Date(post.createdAt);
  const formattedDate = formatDate(publishDate);
  const timeAgo = formatDistanceToNow(publishDate);

  return (
    <>
      <Head>
        <title>{post.metaTitle || post.title} | Learning Platform Blog</title>
        <meta name="description" content={post.metaDescription || post.excerpt || `Read about ${post.title}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription || post.excerpt || `Read about ${post.title}`} />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage.url} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-blue-500 dark:bg-blue-400 z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-16">
        {/* Back Button & Actions */}
        <div className="container-padded py-6 flex justify-between items-center">
          <Link
            href="/blog"
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="mr-2" size={18} /> Back to all articles
          </Link>

          <div className="flex space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow"
                aria-label="Share article"
              >
                <Share2 size={20} className="text-gray-600 dark:text-gray-300" />
              </button>

              {showShareOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50 border dark:border-gray-700"
                >
                  <div className="py-1">
                    <button
                      onClick={() => sharePost('twitter')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => sharePost('facebook')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => sharePost('linkedin')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => sharePost('copyLink')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <span>Copy link</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <button
              onClick={toggleBookmark}
              className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              {isBookmarked ? (
                <BookmarkCheck size={20} className="text-blue-600 dark:text-blue-400" />
              ) : (
                <Bookmark size={20} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Blog Post Header */}
        <header className="container-padded md:px-8 py-8 md:py-12 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center text-gray-600 dark:text-gray-300 mb-8 gap-4 md:gap-6"
          >
            <div className="flex items-center">
              <User size={18} className="mr-2" />
              <span>{post.authorName}</span>
            </div>

            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              <span title={formattedDate}>{timeAgo} ago</span>
            </div>

            <div className="flex items-center">
              <Clock size={18} className="mr-2" />
              <span>{readingTime} min read</span>
            </div>
          </motion.div>

          {post.featuredImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl mb-8"
            >
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
              {post.featuredImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                  {post.featuredImage.caption}
                </div>
              )}
            </motion.div>
          )}
        </header>

        {/* Blog Post Content */}
        <main className="container-padded md:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-10 prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </main>
      </div>
    </>
  );
}

// Skeleton loader for blog post
function BlogPostSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-16">
      <div className="container-padded py-6">
        <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="container-padded md:px-8 py-8 max-w-4xl">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-3/4 animate-pulse" />
        <div className="flex space-x-4 mb-8">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-xl mb-8 animate-pulse" />

        <div className="space-y-4 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog post: ${res.status}`);
    }

    const post: ClientBlogPost = await res.json();

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      props: {
        post: null,
        error: 'Failed to load blog post',
      },
    };
  }
};