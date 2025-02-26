//Modified apiService.ts
import axios from 'axios';
import { Recommendation, UploadResponse} from '@/types'; // Import the Recommendation type
import { QuizDefinition } from '@/components/ui/QuizDisplay'; // Import QuizDefinition

export const uploadDocuments = async (files: File[]): Promise<UploadResponse> => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
  }
  const response = await axios.post<UploadResponse>('/api/upload', formData); // Specify the response type
  return response.data;
};

export const answerQuestion = async (question: string, doc_ids: string[]) => {
  const response = await axios.post('/api/answer', { question, doc_ids });
  return response.data;
};

export const generateQuiz = async (document_id: string, topic?: string, exercise_type: string = 'quiz', difficulty: string = 'medium') => {
  const response = await axios.post('/api/quiz', { document_id, topic, exercise_type, difficulty });
  return response.data;
};

export const evaluateQuiz = async (quiz_definition: QuizDefinition, user_answers: string[]) => { // Use QuizDefinition
  const response = await axios.post('/api/evaluate/quiz', { quiz_definition, user_answers });
  return response.data;
};

export const evaluateExercise = async (exercise_definition: unknown, user_answers: string[]) => {
  const response = await axios.post('/api/evaluate/exercise', { exercise_definition, user_answers });
  return response.data;
};

export const getRecommendations = async (user_id: string): Promise<Recommendation[]>  => {
  const response = await axios.post<Recommendation[]>('/api/recommendation', { user_id });
  return response.data;
};

export const getKnowledgeGraph = async (document_id: string) => {
  const response = await axios.post('/api/knowledge_graph', { document_id });
  return response.data;
};

export const translateText = async (text: string, target_language: string, source_language: string = 'auto') => {
  const response = await axios.post('/api/translate', { text, source_language, target_language });
  return response.data;
};