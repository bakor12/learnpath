// src/pages/api/answer.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { question, doc_ids } = req.body;

  if (!question || !doc_ids) {
    return res.status(400).json({ error: 'Missing question or doc_ids' });
  }

  if (!Array.isArray(doc_ids)) {
    return res.status(400).json({ error: 'doc_ids must be an array' });
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/answer`, {
      question,
      doc_ids,
    });

    return res.status(200).json(response.data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string }, status?: number }, message?: string };
    console.error("Error answering question:", err.response?.data || err.message || error);
    return res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Failed to answer question' });
  }
}