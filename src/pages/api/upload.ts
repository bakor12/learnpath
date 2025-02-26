// src/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs/promises';
import https from 'https'; // Import the https module

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = formidable({});

  try {
    const [ files] = await form.parse(req);

    if (!files || typeof files !== 'object') {
      console.error("No files found or invalid file format");
      return res.status(400).json({ error: 'No files uploaded or invalid file format' });
    }

    const formData = new FormData();

    for (const key in files) {
      const fileOrFiles = files[key];

      if (Array.isArray(fileOrFiles)) {
        for (const file of fileOrFiles) {
          // Use type assertion *after* a basic property check
          if (file && typeof file === 'object' && 'filepath' in file && 'originalFilename' in file) {
            const typedFile = file as formidable.File; // Type assertion
            const fileBuffer = await fs.readFile(typedFile.filepath);
            formData.append('files', new Blob([fileBuffer]), typedFile.originalFilename || 'file');
          } else {
            console.error("Invalid file object in array:", file);
          }
        }
      } else {
        // Use type assertion *after* a basic property check
        if (fileOrFiles && typeof fileOrFiles === 'object' && 'filepath' in fileOrFiles && 'originalFilename' in fileOrFiles) {
          const typedFile = fileOrFiles as formidable.File; // Type assertion
          const fileBuffer = await fs.readFile(typedFile.filepath);
          formData.append('files', new Blob([fileBuffer]), typedFile.originalFilename || 'file');
        } else {
          console.error("Invalid file object:", fileOrFiles);
        }
      }
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // TEMPORARY - FOR DEBUGGING ONLY
      })
    });

    return res.status(200).json(response.data);

  } catch (error: unknown) {
    // Improved error handling:  Log the *entire* error object, not just the message.
    console.error("Error during file upload:", error);
    let errorMessage = 'An unknown error occurred during file upload.';
    if (axios.isAxiosError(error)) {
        errorMessage = `Axios error: ${error.message}`;
        if (error.response) {
            errorMessage += `. Status: ${error.response.status}.  Data: ${JSON.stringify(error.response.data)}`;
        }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ error: 'Failed to upload documents: ' + errorMessage });
  }
}