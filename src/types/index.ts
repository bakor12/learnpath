import { ObjectId } from "mongodb";

export interface LinkData {
  url: string;
  text: string;
}

export interface BlogImage {
  url: string;
  publicId: string;
  alt?: string;
  caption?: string;
}

export interface BlogPost {
  _id: ObjectId;
  title: string;
  content: string;
  excerpt?: string;
  authorId: ObjectId;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: BlogImage; // New field for storing image data
}

export interface ClientBlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImage?: BlogImage; // New field for storing image data
}

// ... (rest of your interfaces remain unchanged) ...
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
  id: string; // Add id property
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'other';
  topic: string;
  suggestion: string;
  error?: string;
}

export interface UploadResult {
  filename: string;
  status: 'success' | 'error';
  doc_id?: string;
}

export interface UploadResponse {
  results: UploadResult[];
}

// New interface for image upload response
export interface ImageUploadResponse {
  url: string;
  publicId: string;
  error?: string;
}