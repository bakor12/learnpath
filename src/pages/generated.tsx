//pages/generated.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Link from 'next/link';
import { LearningPath } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

// Custom hook for learning paths management
const useLearningPaths = () => {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchLearningPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/learning-path/list');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch learning paths');
      }
      
      const data = await response.json();
      setLearningPaths(data);
    } catch (err: unknown) {
      console.error('Error fetching learning paths:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteLearningPath = async (id: string) => {
    try {
      const response = await fetch(`/api/learning-path/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete learning path');
      }

      // Update state to remove the deleted path
      setLearningPaths(prevPaths => prevPaths.filter(path => path.id !== id));
      return true;
    } catch (err: unknown) {
      console.error('Error deleting learning path:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete learning path');
      }
      return false;
    }
  };

  useEffect(() => {
    if (session) {
      fetchLearningPaths();
    }
  }, [session]);

  return {
    learningPaths,
    loading,
    error,
    refreshPaths: fetchLearningPaths,
    deleteLearningPath
  };
};

// Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16 px-4">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900">No learning paths found</h3>
    <p className="mt-2 text-sm text-gray-500">
      Generate a new learning path to get started on your educational journey.
    </p>
    <div className="mt-6">
      <Link href="/learning-path" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Generate New Path
      </Link>
    </div>
  </div>
);

interface LearningPathCardProps {
  path: LearningPath;
  onDelete: (id: string) => Promise<boolean>;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({ path, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  //const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this learning path?')) {
      setIsDeleting(true);
      const success = await onDelete(path.id);
      if (!success) {
        setIsDeleting(false);
      }
    }
  };

  // Calculate completion percentage
  const completedModules = path.modules.filter(module => module.completed).length;
  const totalModules = path.modules.length;
  const completionPercentage = totalModules > 0 
    ? Math.round((completedModules / totalModules) * 100) 
    : 0;

  // Get difficulty distribution
  const difficultyCount = {
    beginner: 0,
    intermediate: 0,
    advanced: 0
  };
  
  path.modules.forEach(module => {
    difficultyCount[module.difficulty]++;
  });

  // Get total estimated time (rough calculation)
  const estimatedTime = path.modules.reduce((total, module) => {
    const timeStr = module.estimatedTime.toLowerCase();
    let hours = 0;
    
    if (timeStr.includes('hour')) {
      hours = parseInt(timeStr.replace(/[^0-9]/g, '')) || 1;
    } else if (timeStr.includes('day')) {
      hours = (parseInt(timeStr.replace(/[^0-9]/g, '')) || 1) * 8;
    } else if (timeStr.includes('week')) {
      hours = (parseInt(timeStr.replace(/[^0-9]/g, '')) || 1) * 40;
    }
    
    return total + hours;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <Link href={`/generated/${path.id}`} className="block h-full">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Learning Path {path.id.substring(0, 8)}
              </h2>
              <p className="text-gray-600 mb-4">
                {path.modules.length} modules
              </p>
            </div>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
              aria-label="Delete learning path"
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-t-2 border-red-500 rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="block text-xs text-green-700">Beginner</span>
              <span className="font-medium text-green-800">{difficultyCount.beginner}</span>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <span className="block text-xs text-yellow-700">Intermediate</span>
              <span className="font-medium text-yellow-800">{difficultyCount.intermediate}</span>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <span className="block text-xs text-red-700">Advanced</span>
              <span className="font-medium text-red-800">{difficultyCount.advanced}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Est. {estimatedTime} hours to complete</span>
          </div>
          
          <div className="mt-4 flex justify-end">
            <span className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
              View details
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const GeneratedPathsPage: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { learningPaths, loading, error, deleteLearningPath } = useLearningPaths();
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleDeletePath = async (id: string) => {
    const success = await deleteLearningPath(id);
    
    if (success) {
      setNotification({
        type: 'success',
        message: 'Learning path deleted successfully'
      });
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } else {
      setNotification({
        type: 'error',
        message: 'Failed to delete learning path'
      });
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
    
    return success;
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null; // Router will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">Your Learning Paths</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          View and manage all your generated learning paths. Each path is customized based on your skills, 
          experience, and learning goals.
        </p>
        <div className="mt-6 flex space-x-4">
          <Link href="/learning-path" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Generate New Path
          </Link>
          <Link href="/profile" 
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Update Profile
          </Link>
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading learning paths</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      {loading ? (
        <LoadingSpinner />
      ) : learningPaths.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {learningPaths.map(path => (
              <LearningPathCard 
                key={path.id} 
                path={path} 
                onDelete={handleDeletePath} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default GeneratedPathsPage;