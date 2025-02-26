// src/pages/exercise/[docId].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { generateQuiz } from '@/services/apiService'; // Reuse generateQuiz, but with exercise_type
import ExerciseDisplay from '@/components/ui/ExerciseDisplay';
import { getSession } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import type { GetServerSidePropsContext } from 'next';

// Define ExerciseDefinition interface (adjust based on actual structure)
export interface ExerciseDefinition {
  id: string;
  type: string;
  questions: {
    id: string;
    text: string;
    options?: string[]; // If it has options
    correctAnswer?: string; // Or other answer format
  }[];
  // Add other properties as needed, based on your ExerciseDisplay component
}

export default function ExercisePage() {
  const router = useRouter();
  const { docId } = router.query;
  const [exerciseDefinition, setExerciseDefinition] = useState<ExerciseDefinition | null>(null); // Use ExerciseDefinition
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (docId) {
      const fetchExercise = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await generateQuiz(docId as string, undefined, 'exercise'); // Specify exercise_type
          setExerciseDefinition(data);
        } catch (err: Error | unknown) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching the exercise.';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchExercise();
    }
  }, [docId]);

  return (
    <div className="container-padded page-section">
      <h1 className="text-3xl font-bold mb-6">Exercise</h1>

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" size={48} />
        </div>
      )}

      {error && (
        <Alert variant="error">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {exerciseDefinition && <ExerciseDisplay exerciseDefinition={exerciseDefinition} />}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}