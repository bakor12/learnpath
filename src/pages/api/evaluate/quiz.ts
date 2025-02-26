// src/pages/api/evaluate/quiz.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { quiz_definition, user_answers } = req.body;

  if (!quiz_definition || !user_answers) {
    return res.status(400).json({ error: 'Missing quiz_definition or user_answers' });
  }

  if (!Array.isArray(user_answers)) {
    return res.status(400).json({ error: 'user_answers must be an array' });
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluate/quiz`, {
      quiz_definition,
      user_answers,
    });

    return res.status(200).json(response.data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string }, status?: number }, message?: string };
    console.error("Error evaluating quiz:", err.response?.data || err.message || error);
    return res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Failed to evaluate quiz' });
  }
}