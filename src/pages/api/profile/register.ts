// src/pages/api/profile/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../../lib/db';
import { User } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
  }
  if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  try {
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser: User = {
      id: uuidv4(), // Generate a unique ID
      email,
      password: hashedPassword, // Store the hashed password
      name,
      completedModules: [],
      badges: []
    };

    await db.collection('users').insertOne(newUser);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error: unknown) {
    console.error('Error registering user:', error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}