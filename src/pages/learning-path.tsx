// src/pages/learning-path.tsx (Added console.log)
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import LearningPathDisplay from '../components/learningPath/LearningPathDisplay';
import { LearningPath, User } from '../types';
import MotivationalMessage from '../components/learningPath/MotivationalMessage';
import BadgesDisplay from '../components/learningPath/BadgesDisplay';

const LearningPathPage: NextPage = () => {
    const { data: session, status, update } = useSession();
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
                    // Get more detailed error message from the response
                    const errorData = await analyzeRes.json();
                    throw new Error(errorData.message || 'Failed to analyze resume');
                }

                // 2. Generate the learning path
                const response = await fetch('/api/learning-path/generate', { method: 'POST' });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to generate learning path');
                }
                const data = await response.json();
                console.log("API Response Data:", data); // ADD THIS LINE
                setLearningPath(data);

                // 3. Fetch user data (for completed modules and badges)
                if (session?.user?.id) {
                    const userRes = await fetch(`/api/profile/${session.user.id}`);
                    if (userRes.ok) {
                        const userData: User = await userRes.json();
                        setCompletedModules(userData.completedModules || []);
                        setBadges(userData.badges || []);
                    } else {
                        const errorData = await userRes.json();
                        setError(errorData.message || 'Failed to fetch user data'); // Set error state
                    }
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchLearningPath();
    }, [status, router, session?.user?.id]);

    const handleModuleComplete = async (moduleId: string) => {
        try {
            const response = await fetch('/api/progress/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ moduleId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update progress');
            }
            // Update local state and session
            setCompletedModules((prev) => [...prev, moduleId]);
            if (data.newBadges && data.newBadges.length > 0) {
                setBadges((prev) => [...prev, ...data.newBadges]);
            }
            setUpdateMessage('Progress updated successfully!');
            await update(); // Update the session
            setTimeout(() => setUpdateMessage(null), 3000); // Clear message after 3 seconds

        } catch (err: any) {
            setError(err.message || 'An error occurred');
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
            <LearningPathDisplay learningPath={learningPath} onModuleComplete={handleModuleComplete} />
            <MotivationalMessage />
            <BadgesDisplay badges={badges} />
        </div>
    );
};

export default LearningPathPage;