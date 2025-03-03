// src/pages/learning-path.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import LearningPathDisplay from '../components/learningPath/LearningPathDisplay';
import { LearningPath, User } from '../types';
import MotivationalMessage from '../components/learningPath/MotivationalMessage';
import BadgesDisplay from '../components/learningPath/BadgesDisplay';

const LearningPathPage: NextPage = () => {
    const { data: session, status} = useSession();
    const router = useRouter();
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [badges, setBadges] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updateMessage, setUpdateMessage] = useState<string | null>(null);


    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        console.log("Session Data:", session); // Add this line

        const fetchLearningPath = async () => {
            try {
                // 1. Trigger resume analysis (if needed)
                const analyzeRes = await fetch('/api/resume/analyze', { method: 'POST' });
                if (!analyzeRes.ok) {
                    // Safely attempt to get error details, but have a fallback
                    try {
                        const errorData = await analyzeRes.json();
                        throw new Error(errorData.message || 'Failed to analyze resume');
                    } catch (parseError) {
                        // Log the parsing error
                        console.error("JSON parsing error (resume analysis):", parseError);
                        throw new Error(`Resume analysis failed: ${analyzeRes.status} ${analyzeRes.statusText}`);
                    }
                }

                // 2. Generate the learning path
                const response = await fetch('/api/learning-path/generate', {
                    method: 'POST',
                    // Add timeout signal if supported by the browser
                    signal: AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined
                });

                if (!response.ok) {
                    // Safely attempt to get error details with a fallback
                    try {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to generate learning path');
                    } catch (parseError) {
                        // Log the parsing error
                        console.error("JSON parsing error (learning path generation):", parseError);
                        throw new Error(`Learning path generation failed: ${response.status} ${response.statusText}`);
                    }
                }

                // Safely parse the response
                try {
                    const data = await response.json();
                    console.log("API Response Data:", data);
                    setLearningPath(data);
                } catch (parseError) {
                    // Log the parsing error
                    console.error("JSON parsing error (setting learning path):", parseError);
                    throw new Error('Failed to parse learning path data. Please try again.');
                }

                // 3. Fetch user data (for completed modules and badges)
                if (session?.user?.id) {
                    const userRes = await fetch(`/api/profile/${session.user.id}`);
                    if (userRes.ok) {
                        try {
                            const userData: User = await userRes.json();
                            setCompletedModules(userData.completedModules || []);
                            setBadges(userData.badges || []);
                        } catch (parseError) {
                            // Log the parsing error
                            console.error("JSON parsing error (fetching user data):", parseError);
                            setError('Failed to parse user data');
                        }
                    } else {
                        try {
                            const errorData = await userRes.json();
                            setError(errorData.message || 'Failed to fetch user data');
                        } catch (parseError) {
                            // Log the parsing error
                            console.error("JSON parsing error (fetching user data - error response):", parseError);
                            setError(`Failed to fetch user data: ${userRes.status} ${userRes.statusText}`);
                        }
                    }
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An error occurred');
                }
                console.error('Learning path error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLearningPath();
    }, [status, router, session]); // Changed: Added 'session' to the dependency array

    const handleModuleComplete = async (moduleId: string) => {
        try {
            const response = await fetch('/api/progress/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ moduleId }),
            });

            if (!response.ok) {
                try {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to update progress');
                } catch (parseError) {
                    // Log the parsing error
                    console.error("JSON parsing error (updating progress - error response):", parseError);
                    throw new Error(`Failed to update progress: ${response.status} ${response.statusText}`);
                }
            }

            try {
                const data = await response.json();
                // Update local state and session
                setCompletedModules((prev) => [...prev, moduleId]);
                if (data.newBadges && data.newBadges.length > 0) {
                    setBadges((prev) => [...prev, ...data.newBadges]);
                }
                setUpdateMessage('Progress updated successfully!');
                //await update(); // Update the session
                setTimeout(() => setUpdateMessage(null), 3000); // Clear message after 3 seconds
            } catch (parseError) {
                // Log the parsing error
                console.error("JSON parsing error (updating progress):", parseError);
                throw new Error('Failed to parse progress update response');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred');
            }
            console.error('Module completion error:', err);
        }
    };

    if (loading) {
        return <div>Loading learning path...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!session) {
        return <div>You must be logged in to view this page.</div>;
    }

    if (!learningPath) {
        return <div>No learning path generated yet.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Your Learning Path</h1>
            {updateMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    {updateMessage}
                </div>
            )}
            {/* Pass completedModules to LearningPathDisplay */}
            <LearningPathDisplay learningPath={learningPath} onModuleComplete={handleModuleComplete} completedModules={completedModules} />
            <MotivationalMessage />
            <BadgesDisplay badges={badges} />
        </div>
    );
};

export default LearningPathPage;