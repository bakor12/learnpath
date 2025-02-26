// src/pages/api/knowledge_graph.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { document_id } = req.body;

  if (!document_id) {
    return res.status(400).json({ error: 'Missing document_id' });
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/knowledge_graph`, {
      document_id,
    });

    return res.status(200).json(response.data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string }, status?: number }, message?: string };
    console.error("Error generating knowledge-graph:", err.response?.data || err.message || error);
    return res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Failed to generate knowledge-graph' });
  }
}