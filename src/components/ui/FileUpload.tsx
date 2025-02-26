// src/components/ui/FileUpload.tsx (Corrected)
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadDocuments } from '@/services/apiService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileIcon, FilePlus, XCircle } from 'lucide-react';
import { UploadResponse, UploadResult } from '@/types'; // Import the new types


interface FileUploadProps {
    onUploadSuccess?: (results: UploadResponse) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResults, setUploadResults] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploadStatus('uploading');
        setError(null); // Clear previous errors
        try {
            const results = await uploadDocuments(acceptedFiles);
            setUploadResults(results);
            setUploadStatus('success');
            onUploadSuccess?.(results); // Notify parent component
        } catch (err: Error | unknown) {
            setUploadStatus('error');
            setError(err instanceof Error ? err.message : 'An unknown error occurred during upload.');
            console.error("Upload error:", err);
        }
    }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'], // Only accept PDF files
    },
  });

  return (
    <div {...getRootProps()} className={`
      border-2 border-dashed rounded-md p-4 cursor-pointer text-center
      ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 dark:border-gray-600'}
      transition-colors duration-200
    `}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        {isDragActive ? (
          <p className="text-blue-600 dark:text-blue-400">Drop the files here...</p>
        ) : (
            <>
                <FilePlus className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                    Drag &apos;n&apos; drop some files here, or click to select files
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">(Only PDF files are allowed)</p>
            </>
        )}
      </div>

      {uploadStatus === 'uploading' && (
        <Alert variant="info" className="mt-4">
          <AlertTitle>Uploading...</AlertTitle>
          <AlertDescription>Please wait while your files are being uploaded.</AlertDescription>
        </Alert>
      )}

      {uploadStatus === 'success' && uploadResults && (
        <Alert variant="success" className="mt-4">
          <AlertTitle>Upload Successful!</AlertTitle>
          <AlertDescription>
            <ul>
              {uploadResults.results.map((result: UploadResult) => (
                <li key={result.filename} className="flex items-center gap-2">
                    {result.status === 'success' ? (
                        <>
                            <FileIcon className="w-4 h-4 text-green-500" />
                            <span>{result.filename} (ID: {result.doc_id})</span>
                        </>
                    ) : (
                        <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span>{result.filename} ({result.status})</span>
                        </>
                    )}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {uploadStatus === 'error' && error && (
        <Alert variant="error" className="mt-4">
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUpload;