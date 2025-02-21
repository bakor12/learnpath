// src/pages/profile.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import ProfileForm from '../components/auth/ProfileForm';
import { useEffect, useState } from 'react';
import { User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

// Animation variants for page elements
const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const Profile: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect if not logged in
      return;
    }
    
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const res = await fetch(`/api/profile/${session.user.id}`);
          
          if (res.ok) {
            const userData = await res.json();
            setUser(userData); // Set initial user data
          } else {
            const errorData = await res.json();
            setError(errorData.message || "Failed to fetch user profile");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setError("Network error occurred. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [status, router, session?.user?.id]);

  const handleUpdateSuccess = () => {
    setUpdateSuccess(true);
    // Refetch user data after update
    if (session?.user?.id) {
      fetch(`/api/profile/${session.user.id}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error("Error refreshing profile data:", err));
    }
    setTimeout(() => setUpdateSuccess(false), 3000); // Hide message after 3 seconds
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Head>
          <title>Loading Profile | My Learning App</title>
        </Head>
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading your profile...</p>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Head>
          <title>Error | My Learning App</title>
        </Head>
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-600 p-4">
            <h2 className="text-white text-xl font-bold">Error Loading Profile</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button 
              onClick={() => router.reload()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated UI
  if (!session || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Head>
          <title>Authentication Required | My Learning App</title>
        </Head>
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-yellow-500 p-4">
            <h2 className="text-white text-xl font-bold">Authentication Required</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">You must be logged in to view your profile.</p>
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main profile UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Head>
        <title>Your Profile | My Learning App</title>
        <meta name="description" content="Manage your learning profile, skills, goals and preferences" />
      </Head>
      
      <motion.div 
        className="container mx-auto p-4 sm:p-6 lg:p-8"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageTransition}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-6 sm:px-8">
            <h1 className="text-3xl font-bold text-white">Your Learning Profile</h1>
            <p className="text-blue-100 mt-2">Manage your skills, goals, and learning preferences</p>
          </div>
          
          <div className="p-6 sm:p-8">
            <AnimatePresence>
              {updateSuccess && (
                <motion.div 
                  className="bg-green-100 border-l-4 border-green-500 dark:bg-green-900/30 dark:border-green-400 text-green-700 dark:text-green-300 p-4 rounded-md mb-6 flex items-start" 
                  role="alert"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex-shrink-0 mr-3">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Success!</p>
                    <p>Your profile has been updated successfully.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Summary
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{session.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Skills</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.skills?.map((skill, index) => (
                        <span key={index} className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Learning Style</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">{user.learningStyle || "Not specified"}</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Learning Goals
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg shadow-sm">
                  {(user.learningGoals ?? []).length > 0 ? (
                    <ul className="space-y-3">
                      {(user.learningGoals ?? []).map((goal, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-800 dark:text-gray-200">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No learning goals specified yet.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Edit Profile</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Update your skills, goals, and learning preferences</p>
              </div>
              <div className="p-6">
                <ProfileForm
                  initialSkills={user.skills}
                  initialLearningGoals={user.learningGoals}
                  initialLearningStyle={user.learningStyle}
                  onUpdateSuccess={handleUpdateSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;