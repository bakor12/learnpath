// src/pages/quiz/[docId].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { generateQuiz } from '@/services/apiService';
import QuizDisplay from '@/components/ui/QuizDisplay';
import { getSession } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import type { GetServerSidePropsContext } from 'next';
import { QuizDefinition } from '@/components/ui/QuizDisplay'; // Import QuizDefinition


export default function QuizPage() {
  const router = useRouter();
  const { docId } = router.query;
  const [quizDefinition, setQuizDefinition] = useState<QuizDefinition | null>(null); // Use QuizDefinition
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (docId) {
      const fetchQuiz = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await generateQuiz(docId as string);
          setQuizDefinition(data);
        } catch (err: Error | unknown) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching the quiz.';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchQuiz();
    }
  }, [docId]);

  return (
    <div className="container-padded page-section">
      <h1 className="text-3xl font-bold mb-6">Quiz</h1>

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

      {quizDefinition && <QuizDisplay quizDefinition={quizDefinition} />}
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