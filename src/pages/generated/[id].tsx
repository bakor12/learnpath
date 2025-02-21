// src/pages/generated/[id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { LearningPath, LearningModule } from '../../types';
import { connectToDatabase } from '../../lib/db';
import { ObjectId } from 'mongodb';
import { AnimatePresence, motion } from 'framer-motion';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';


interface DetailPageProps {
  initialLearningPath: LearningPath | null;
  error?: string;
}

// Types for module progress tracking
/*interface ModuleProgress {
  started: boolean;
  completed: boolean;
  lastUpdated: Date | null;
  notes: string;
}*/

// Custom hook for learning module progression
const useModuleProgress = (pathId: string, moduleId: string, initialStatus: boolean) => {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(initialStatus || false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { update } = useSession();

  useEffect(() => {
    // Get the progress status from localStorage
    const progressKey = `module-progress-${pathId}-${moduleId}`;
    const savedProgress = localStorage.getItem(progressKey);

    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setIsStarted(parsed.started);
      // Only use localStorage completion status if the API hasn't already marked it complete
      if (!initialStatus) {
        setIsCompleted(parsed.completed);
      }
    }
  }, [pathId, moduleId, initialStatus]);

  const markAsStarted = () => {
    const progressKey = `module-progress-${pathId}-${moduleId}`;
    setIsStarted(true);
    localStorage.setItem(progressKey, JSON.stringify({
      started: true,
      completed: isCompleted,
      lastUpdated: new Date(),
      notes: ''
    }));
  };

  const markAsCompleted = async () => {
    if (isCompleted) return; // Already completed

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleId, pathId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update progress');
      }

      // Update progress in localStorage
      const progressKey = `module-progress-${pathId}-${moduleId}`;
      localStorage.setItem(progressKey, JSON.stringify({
        started: true,
        completed: true,
        lastUpdated: new Date(),
        notes: ''
      }));

      setIsStarted(true);
      setIsCompleted(true);
      await update(); // Update the session

      return data.newBadges || [];
    } catch (err: unknown) {
      console.error('Error updating module completion:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark module as completed';
      setError(errorMessage);
      return [];
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isStarted,
    isCompleted,
    isSubmitting,
    error,
    markAsStarted,
    markAsCompleted
  };
};

// Module Card Component
interface ModuleCardProps {
  module: LearningModule;
  index: number;
  pathId: string;
  onModuleComplete: (moduleId: string, badges: string[]) => void;
  completedModules: string[];
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  index,
  pathId,
  onModuleComplete,
  completedModules
}) => {
  //const [showResources, setShowResources] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'resources'>('overview');
  const initialCompletionStatus = completedModules.includes(module.id);

  const {
    isStarted,
    isCompleted,
    isSubmitting,
    markAsStarted,
    markAsCompleted
  } = useModuleProgress(pathId, module.id, initialCompletionStatus);

  const handleStartModule = () => {
    markAsStarted();
  };

  const handleCompleteModule = async () => {
    const newBadges = await markAsCompleted();
    onModuleComplete(module.id, newBadges);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${isCompleted ? 'bg-green-50 border-green-200' :
        isStarted ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
        }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700'
              }`}>
              {isCompleted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
            {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
          </span>
        </div>

        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-4">
            <button
              onClick={() => setActiveSection('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeSection === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('resources')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeSection === 'resources'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Resources
            </button>
          </nav>
        </div>

        {activeSection === 'overview' && (
          <div>
            <p className="text-gray-600 mb-4">
              {module.description || 'No description available.'}
            </p>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Estimated time: {module.estimatedTime}</span>
            </div>

            {module.prerequisites.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Prerequisites:</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {module.prerequisites.map((prereq, idx) => (
                    <li key={idx}>{prereq}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeSection === 'resources' && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Learning Resources:</h4>
            <ul className="space-y-2">
              {module.resourceLinks.map((link, idx) => (
                <li key={idx} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <a
                    href={link.startsWith('http') ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
              {module.resourceLinks.length === 0 && (
                <li className="text-gray-500 text-sm italic">No resources available</li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          {!isStarted && !isCompleted && (
            <button
              onClick={handleStartModule}
              className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Module
            </button>
          )}

          {(isStarted || isCompleted) && !isCompleted && (
            <button
              onClick={handleCompleteModule}
              disabled={isSubmitting}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Mark as Completed'
              )}
            </button>
          )}

          {isCompleted && (
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Completed
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};


const DetailPage: React.FC<DetailPageProps> = ({ initialLearningPath, error }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [learningPath, setLearningPath] = useState<LearningPath | null>(initialLearningPath);
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<string[]>([]);
    const [showBadgeModal, setShowBadgeModal] = useState(false);


    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        const fetchUpdatedPath = async () => {
            if (initialLearningPath && session?.user?.id) {
                try {
                    const userRes = await fetch(`/api/profile/${session.user.id}`);
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setCompletedModules(userData.completedModules || []);

                        // Update the learning path with completion status
                        const updatedPath: LearningPath = {
                            ...initialLearningPath,
                            modules: initialLearningPath.modules.map(module => ({
                                ...module,
                                completed: userData.completedModules.includes(module.id)
                            }))
                        };
                        setLearningPath(updatedPath);
                    }
                } catch (fetchError) {
                    console.error("Failed to fetch updated user data:", fetchError);
                }
            }
        };
        fetchUpdatedPath();

    }, [status, router, initialLearningPath, session?.user?.id]);


    const handleModuleComplete = (moduleId: string, badges: string[]) => {
        setCompletedModules(prev => [...prev, moduleId]);
        if (badges.length > 0) {
            setNewlyEarnedBadges(badges);
            setShowBadgeModal(true);
        }
    };

    const closeModal = () => {
        setShowBadgeModal(false);
        setNewlyEarnedBadges([]); // Clear the badges
    };

    if (status === 'loading') {
        return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    if (!session) {
        return null; // Or a redirect, handled by the useEffect
    }

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    if (!learningPath) {
        return <div className="p-4">Learning path not found.</div>;
    }

    return (
        <>
            <Head>
                <title>Learning Path Details</title>
                <meta name="description" content="Detailed view of your learning path." />
            </Head>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white-900">Learning Path Details</h1>
                        <p className="text-gray-500 mt-2">
                            Track your progress and explore the modules in your learning path.
                        </p>
                    </div>
                    <Link href="/generated" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Back to Learning Paths
                    </Link>
                </div>

                <AnimatePresence>
                    {showBadgeModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed z-50 inset-0 overflow-y-auto"
                            aria-labelledby="modal-title"
                            role="dialog"
                            aria-modal="true"
                        >
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                                >
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                    Congratulations!
                                                </h3>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        You&aposve earned {newlyEarnedBadges.length} new badge{newlyEarnedBadges.length > 1 ? 's' : ''}!
                                                    </p>
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {newlyEarnedBadges.map((badge, index) => (
                                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {badge}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-6">
                    {learningPath.modules.map((module, index) => (
                        <ModuleCard
                            key={module.id}
                            module={module}
                            index={index}
                            pathId={learningPath.id}
                            onModuleComplete={handleModuleComplete}
                            completedModules={completedModules}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps<DetailPageProps> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
        // Redirect to login if not authenticated
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const { id } = context.params as { id: string };

    try {
        const { db } = await connectToDatabase();
        const learningPath = await db.collection('learning_paths').findOne({ id: id, userId: session.user.id });

        if (!learningPath) {
            return {
                props: {
                    initialLearningPath: null,
                    error: 'Learning path not found or you do not have permission to view it.',
                },
            };
        }
      // Fetch user data to get completedModules
        const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });
        const completedModules = user?.completedModules || [];

        // Convert the MongoDB document to a plain JavaScript object
        const serializedLearningPath: LearningPath = JSON.parse(JSON.stringify({
            ...learningPath,
            modules: learningPath.modules.map((module: LearningModule) => ({
                ...module,
                completed: completedModules.includes(module.id) // Mark as completed
            })),
        }));

        return {
            props: {
                initialLearningPath: serializedLearningPath,
            },
        };
    } catch (error) {
        console.error('Error fetching learning path:', error);
        return {
            props: {
                initialLearningPath: null,
                error: 'Failed to load learning path.',
            },
        };
    }
};

export default DetailPage;