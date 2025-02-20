// src/types/index.ts

export interface User {
    id: string;
    email: string;
    name?: string;
    password?: string; // Optional because it won't be sent to the client
    skills?: string[];
    learningGoals?: string[];
    learningStyle?: 'visual' | 'auditory' | 'kinesthetic';
    resumeText?: string;
    completedModules: string[]; // Added for progress tracking
    badges: string[];        // Added for gamification
  }
  
  export interface LearningModule {
    id: string;
    title: string;
    description?: string;
    estimatedTime: string; // e.g., "2 hours", "1 week"
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    resourceLinks: string[];
    prerequisites: string[]; // IDs of prerequisite modules
    completed?: boolean; // Track completion status (can be used on the frontend)
  }
  
  export interface LearningPath {
    id: string;
    userId: string;
    modules: LearningModule[];
    // Add other learning path properties as needed
  }
  
  export interface Recommendation {
    title: string;
    description: string;
    url: string;
    type: 'article' | 'video' | 'course' | 'other';
  }
  
  // You can add other shared types here as needed