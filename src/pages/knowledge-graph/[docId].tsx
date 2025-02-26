// src/pages/knowledge-graph/[docId].tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getKnowledgeGraph } from '@/services/apiService';
import KnowledgeGraphDisplay from '@/components/ui/KnowledgeGraphDisplay';
import { getSession } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import type { GetServerSidePropsContext } from 'next';

export default function KnowledgeGraphPage() {
  const router = useRouter();
  const { docId } = router.query;
  const [graphHtml, setGraphHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (docId) {
      const fetchGraph = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getKnowledgeGraph(docId as string);
          setGraphHtml(data.html);
        } catch (err: Error | unknown) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching the knowledge graph.';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchGraph();
    }
  }, [docId]);

  return (
    <div className="container-padded page-section">
      <h1 className="text-3xl font-bold mb-6">Knowledge Graph</h1>

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

      {graphHtml && <KnowledgeGraphDisplay html={graphHtml} />}
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