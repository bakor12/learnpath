// src/pages/recommendations.tsx
import React, { useState, useEffect } from 'react';
import { getRecommendations } from '@/services/apiService';
import RecommendationsDisplay from '@/components/ui/RecommendationsDisplay';
import { useSession, getSession } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import type { GetServerSidePropsContext } from 'next';
import { Recommendation } from '@/types'; // Import Recommendation

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]); // Use Recommendation[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      if (status === 'authenticated' && session) {
          const fetchRecommendations = async () => {
              setLoading(true);
              setError(null);
              try {
                  const data = await getRecommendations(session.user.id);
                  setRecommendations(data);
              } catch (err: Error | unknown) {
                  const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching recommendations.';
                  setError(errorMessage);
              } finally {
                  setLoading(false);
              }
          };
          fetchRecommendations();
      }
  }, [session, status]);

  return (
    <div className="container-padded page-section">
      <h1 className="text-3xl font-bold mb-6">Recommendations</h1>

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

      {status === 'loading' && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" size={24} />
        </div>
      )}

      {status === 'unauthenticated' && (
        <Alert variant="info">
          <AlertTitle>Not Authenticated</AlertTitle>
          <AlertDescription>Please log in to view recommendations.</AlertDescription>
        </Alert>
      )}

      {recommendations && <RecommendationsDisplay recommendations={recommendations} />}
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