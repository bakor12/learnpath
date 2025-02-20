// src/components/auth/ProfileForm.tsx
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

interface ProfileFormProps {
    initialSkills?: string[];
    initialLearningGoals?: string[];
    initialLearningStyle?: 'visual' | 'auditory' | 'kinesthetic';
    onUpdateSuccess: () => void;
}
const ProfileForm: React.FC<ProfileFormProps> = ({ initialSkills = [], initialLearningGoals = [], initialLearningStyle, onUpdateSuccess }) => {
    const { data: session, update } = useSession();
    const [skills, setSkills] = useState<string[]>(initialSkills);
    const [learningGoals, setLearningGoals] = useState<string[]>(initialLearningGoals);
    const [learningStyle, setLearningStyle] = useState<'visual' | 'auditory' | 'kinesthetic' | ''>(initialLearningStyle || '');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkills(e.target.value.split(',').map(s => s.trim()));
    };

    const handleLearningGoalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLearningGoals(e.target.value.split(',').map(s => s.trim()));
    };

    const handleLearningStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLearningStyle(e.target.value as 'visual' | 'auditory' | 'kinesthetic' | '');
    };

    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            if (resumeFile) {
                formData.append('resume', resumeFile);
            }
            formData.append('skills', JSON.stringify(skills));
            formData.append('learningGoals', JSON.stringify(learningGoals));
            formData.append('learningStyle', learningStyle);

            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                body: formData, // Send FormData for file uploads
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to update profile');
            } else {
                // Update the session with new data (if needed)
                await update({
                  ...session,
                  user: {
                    ...session?.user,
                    skills: data.user.skills,
                    learningGoals: data.user.learningGoals,
                    learningStyle: data.user.learningStyle
                  }
                });
                onUpdateSuccess(); // Callback for success handling
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                    Skills (comma-separated)
                </label>
                <input
                    type="text"
                    id="skills"
                    value={skills.join(', ')}
                    onChange={handleSkillsChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="learningGoals" className="block text-sm font-medium text-gray-700">
                    Learning Goals (comma-separated)
                </label>
                <input
                    type="text"
                    id="learningGoals"
                    value={learningGoals.join(', ')}
                    onChange={handleLearningGoalsChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700">
                    Learning Style
                </label>
                <select
                    id="learningStyle"
                    value={learningStyle}
                    onChange={handleLearningStyleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Select...</option>
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                </select>
            </div>
            <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                    Upload Resume (PDF)
                </label>
                <input
                    type="file"
                    id="resume"
                    accept=".pdf"
                    onChange={handleResumeChange}
                    className="mt-1 block w-full"
                />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
                type="submit"
                disabled={loading}
                className={`${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    }  group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
                {loading ? 'Updating...' : 'Update Profile'}
            </button>
        </form>
    );
};

export default ProfileForm;