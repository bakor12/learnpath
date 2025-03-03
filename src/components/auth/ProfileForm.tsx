// src/components/auth/ProfileForm.tsx
import React, { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface ProfileFormProps {
    initialSkills?: string[];
    initialLearningGoals?: string[];
    initialLearningStyle?: 'visual' | 'auditory' | 'kinesthetic';
    onUpdateSuccess: () => void;
}

// Custom tag component for skills and learning goals
const Tag: React.FC<{ text: string; onRemove: () => void }> = ({ text, onRemove }) => (
    <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300"
    >
        {text}
        <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center p-0.5 ml-2 text-sm text-indigo-400 bg-transparent rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 dark:text-indigo-300"
            aria-label={`Remove ${text}`}
        >
            <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
            <span className="sr-only">Remove tag</span>
        </button>
    </motion.span>
);

const ProfileForm: React.FC<ProfileFormProps> = ({ 
    initialSkills = [], 
    initialLearningGoals = [], 
    initialLearningStyle, 
    onUpdateSuccess 
}) => {
    const { data: session, update } = useSession();
    const [skills, setSkills] = useState<string[]>(initialSkills);
    const [learningGoals, setLearningGoals] = useState<string[]>(initialLearningGoals);
    const [learningStyle, setLearningStyle] = useState<'visual' | 'auditory' | 'kinesthetic' | ''>(initialLearningStyle || '');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [skillInput, setSkillInput] = useState('');
    const [goalInput, setGoalInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [resumeFileName, setResumeFileName] = useState<string | null>(null);

    // Handle individual skill input
    const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkillInput(e.target.value);
    };

    // Add a skill when pressing Enter
    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("handleSkillKeyDown triggered", e.key, e.code, e.keyCode, skillInput); // LOG 1: Include code and keyCode
    
        // Use e.code if available, otherwise fall back to e.keyCode
        const isEnter = e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13;
    
        if (isEnter && skillInput.trim()) {
            e.preventDefault();
            const trimmedSkill = skillInput.trim();
            console.log("trimmedSkill:", trimmedSkill); // LOG 2
            if (!skills.includes(trimmedSkill)) {
                console.log("Adding skill:", trimmedSkill); // LOG 3
                setSkills(prevSkills => {
                    console.log("prevSkills:", prevSkills); // LOG 4
                    const newSkills = [...prevSkills, trimmedSkill];
                    console.log("newSkills:", newSkills);  // LOG 5
                    return newSkills;
                });
            } else {
                console.log("Skill already exists:", trimmedSkill); // LOG 6
            }
            setSkillInput('');
        }
    };

    // Remove a skill
    const removeSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    // Handle individual learning goal input
    const handleGoalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGoalInput(e.target.value);
    };

    // Add a learning goal when pressing Enter
    const handleGoalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("handleGoalKeyDown triggered", e.key, e.code, e.keyCode, goalInput); // LOG 1: Include code and keyCode
    
        // Use e.code if available, otherwise fall back to e.keyCode
        const isEnter = e.key === 'Enter' || e.code === 'Enter' || e.keyCode === 13;
    
        if (isEnter && goalInput.trim()) {
            e.preventDefault();
            const trimmedGoal = goalInput.trim();
            console.log("trimmedGoal:", trimmedGoal); // LOG 2
    
            if (!learningGoals.includes(trimmedGoal)) {
                console.log("Adding goal:", trimmedGoal); // LOG 3
                setLearningGoals(prevGoals => {
                    console.log("prevGoals:", prevGoals); // LOG 4
                    const newGoals = [...prevGoals, trimmedGoal];
                    console.log("newGoals:", newGoals); // LOG 5
                    return newGoals;
                });
            } else {
                console.log("Goal already exists:", trimmedGoal); // LOG 6
            }
            setGoalInput('');
        }
    };
    // Remove a learning goal
    const removeGoal = (index: number) => {
        setLearningGoals(learningGoals.filter((_, i) => i !== index));
    };

    // Handle learning style selection
    const handleLearningStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLearningStyle(e.target.value as 'visual' | 'auditory' | 'kinesthetic' | '');
    };

    // Handle file drop
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                handleFileSelection(file);
            } else {
                setError('Please upload a PDF file');
            }
        }
    };

    // Handle file input change
    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (file: File) => {
        setResumeFile(file);
        setResumeFileName(file.name);
        setUploadProgress(100); // Simulate complete upload for demo
        setError(null);
    };

    // Handle file browse button click
    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Remove selected file
    const handleRemoveFile = () => {
        setResumeFile(null);
        setResumeFileName(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Form submission handler
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
    
            // Add these log statements:
            console.log("Skills being sent:", skills);
            console.log("Learning Goals being sent:", learningGoals);
            console.log("Learning Style being sent", learningStyle);
            console.log("Skills being sent (inside handleSubmit):", skills); // Keep this
            console.log("Learning Goals being sent (inside handleSubmit):", learningGoals); // Keep this
            // Simulate upload progress
            const timer = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(timer);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 300);

            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                body: formData,
            });

            clearInterval(timer);
            setUploadProgress(100);

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to update profile');
            } else {
                // Update the session with new data
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        skills: data.user.skills,
                        learningGoals: data.user.learningGoals,
                        learningStyle: data.user.learningStyle
                    }
                });
                onUpdateSuccess();
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

    // Learning style options with descriptions and icons
    const learningStyleOptions = [
        { 
            value: 'visual', 
            label: 'Visual Learner', 
            description: 'You learn best through images, diagrams, and spatial understanding',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )
        },
        { 
            value: 'auditory', 
            label: 'Auditory Learner', 
            description: 'You learn best through listening and verbal discussions',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            )
        },
        { 
            value: 'kinesthetic', 
            label: 'Kinesthetic Learner', 
            description: 'You learn best through hands-on activities and physical experiences',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 md:p-8"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Skills Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                >
                    <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Your Skills
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Add your technical and soft skills to help us personalize your learning journey
                    </p>
                    
                    <div className="flex flex-wrap mt-2 mb-3">
                        {skills.map((skill, index) => (
                            <Tag key={index} text={skill} onRemove={() => removeSkill(index)} />
                        ))}
                    </div>
                    
                    <div className="relative">
                    <input
    type="text"
    id="skills"
    value={skillInput}
    onChange={handleSkillInputChange}
    onKeyDown={handleSkillKeyDown} // Use onKeyDown
    placeholder="Type a skill and press Enter"
    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400"
/>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* Learning Goals Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    <label htmlFor="learningGoals" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Your Learning Goals
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        What do you want to achieve in your learning journey?
                    </p>
                    
                    <div className="flex flex-wrap mt-2 mb-3">
                        {learningGoals.map((goal, index) => (
                            <Tag key={index} text={goal} onRemove={() => removeGoal(index)} />
                        ))}
                    </div>
                    
                    <div className="relative">
                    <input
    type="text"
    id="learningGoals"
    value={goalInput}
    onChange={handleGoalInputChange}
    onKeyDown={handleGoalKeyDown}   // Use onKeyDown
    placeholder="Type a learning goal and press Enter"
    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400"
/>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                {/* Learning Style Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Your Learning Style
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Understanding how you learn best helps us tailor content to your preferences
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        {learningStyleOptions.map((option) => (
                            <label 
                                key={option.value}
                                className={`relative flex flex-col p-4 cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                                    learningStyle === option.value 
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="learningStyle"
                                        value={option.value}
                                        checked={learningStyle === option.value}
                                        onChange={handleLearningStyleChange}
                                        className="sr-only"
                                    />
                                    <div 
                                        className={`flex-shrink-0 w-6 h-6 mr-2 rounded-full border-2 flex items-center justify-center ${
                                            learningStyle === option.value 
                                                ? 'border-indigo-500 bg-indigo-500' 
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    >
                                        {learningStyle === option.value && (
                                            <span className="w-2 h-2 rounded-full bg-white"></span>
                                        )}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {option.label}
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex items-center text-indigo-500 dark:text-indigo-400">
                                    {option.icon}
                                </div>
                                
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    {option.description}
                                </p>
                            </label>
                        ))}
                    </div>
                </motion.div>

                {/* Resume Upload Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                >
                    <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Upload Your Resume
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Upload your resume to help us analyze your skills and recommend relevant courses
                    </p>

                    <input
                        type="file"
                        id="resume"
                        ref={fileInputRef}
                        accept=".pdf"
                        onChange={handleResumeChange}
                        className="hidden"
                    />

                    {!resumeFileName ? (
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                                isDragActive 
                                    ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                                    : 'border-gray-300 dark:border-gray-700'
                            }`}
                        >
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <button
                                        type="button"
                                        onClick={handleBrowseClick}
                                        className="relative font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus:outline-none"
                                    >
                                        <span>Upload a file</span>
                                    </button>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB</p>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 rounded-md bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <svg className="h-8 w-8 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                            {resumeFileName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PDF Document
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 dark:bg-gray-700">
                                <div 
                                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Error message */}
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800"
                    >
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </motion.div>
                )}

                {/* Submit button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-2"
                >
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition-all duration-200 ${
                            loading 
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating Profile...
                            </>
                        ) : (
                            'Save Profile Changes'
                        )}
                    </button>
                </motion.div>
            </form>
        </motion.div>
    );
};

export default ProfileForm;