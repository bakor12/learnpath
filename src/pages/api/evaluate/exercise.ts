// src/pages/api/evaluate/exercise.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { exercise_definition, user_answers } = req.body;

  if (!exercise_definition || !user_answers) {
    return res.status(400).json({ error: 'Missing exercise_definition or user_answers' });
  }
    if (!Array.isArray(user_answers)) {
    return res.status(400).json({ error: 'user_answers must be an array' });
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluate/exercise`, {
      exercise_definition,
      user_answers,
    });

    return res.status(200).json(response.data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string }, status?: number }, message?: string };
    console.error("Error evaluating exercise:", err.response?.data || err.message || error);
    return res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Failed to evaluate exercise' });
  }
}