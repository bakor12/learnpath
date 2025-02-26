import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { ClientBlogPost } from '../types';
import { formatDistanceToNow } from '../lib/dateUtils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface BlogPageProps {
  initialPosts: ClientBlogPost[];
}

export default function BlogPage({ initialPosts }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts, error, isLoading } = useSWR<ClientBlogPost[]>(
    '/api/blog',
    fetcher,
    { fallbackData: initialPosts, refreshInterval: 60000 }
  );

  const filteredPosts = posts?.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (error) return (
    <div className="container-padded py-16 text-center">
      <h1 className="text-2xl font-bold text-red-500 dark:text-red-400">Error loading blog posts</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Please try refreshing the page</p>
    </div>
  );

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} (${formatDistanceToNow(date)} ago)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 dark:from-gray-900 to-gray-100 dark:to-gray-800">
      <div className="container-padded py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Latest Insights
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Discover trends, strategies, and expert advice to enhance your learning journey
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input w-full pl-12 pr-4 py-3 rounded-full" // Use form-input class
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          </div>
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-96">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPosts.map((post) => (
              <motion.div
                key={post._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
              >
                <Link href={`/blog/${post._id}`} className="block h-full">
                  <div className="relative h-48 overflow-hidden">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-400 dark:from-blue-600 to-indigo-500 dark:to-indigo-700 flex items-center justify-center">
                        <h3 className="text-white dark:text-gray-100 text-xl font-bold px-4 text-center">
                          {truncateText(post.title, 50)}
                        </h3>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar size={16} className="mr-1" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                      {truncateText(post.title, 60)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {truncateText(post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150), 120)}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-sm text-gray-500 dark:text-gray-400">By {post.authorName}</span>
                      <span className="text-blue-600 dark:text-blue-400 flex items-center font-medium text-sm">
                        Read more <ArrowRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">No posts found</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery
                ? `No posts matching "${searchQuery}". Try a different search term.`
                : "There are no blog posts available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog`);

    if (!res.ok) {
      throw new Error(`Failed to fetch blog posts: ${res.status}`);
    }

    const initialPosts: ClientBlogPost[] = await res.json();

    return {
      props: {
        initialPosts,
      },
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      props: {
        initialPosts: [],
      },
    };
  }
};