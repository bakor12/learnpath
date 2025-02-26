// src/components/ui/QuizDisplay.tsx
import React, { useState } from 'react';
import { evaluateQuiz } from '@/services/apiService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// --- Define the interfaces ---

export interface QuizDefinition {
  questions: string[];
  raw_output?: string; // Optional, as it's only used in one branch
  error?: string;      // Optional, for error handling
}

interface EvaluationResult {
  score?: number;    // Optional, as it might be absent in case of error
  feedback?: string; // Optional, as it might be absent in case of error
  error?: string;      // Optional, for error handling
}

// --- End of interface definitions ---

interface QuizDisplayProps {
  quizDefinition: QuizDefinition; // Use the new interface
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ quizDefinition }) => {
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null); // Use the new interface
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setError(null);
    setEvaluationResult(null);

    if (userAnswers.length !== quizDefinition.questions.length) {
      setError("Please answer all questions.");
      return;
    }

    try {
      const result = await evaluateQuiz(quizDefinition, userAnswers);
      setEvaluationResult(result);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during evaluation.';
      setError(errorMessage);
    }
  };

  if (!quizDefinition || quizDefinition.error) {
    return (
      <Alert variant="error">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{quizDefinition?.error || 'Invalid quiz data.'}</AlertDescription>
      </Alert>
    );
  }

  if (quizDefinition.raw_output) {
    return (
      <div>
        <h4 className="font-semibold mb-2">Raw Quiz Output:</h4>
        <p>{quizDefinition.raw_output}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Quiz</h3>
      {quizDefinition.questions?.map((question: string, index: number) => (
        <div key={index} className="space-y-2">
          <p className="font-medium">{index + 1}. {question}</p>
          <input
            type="text"
            value={userAnswers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder="Your answer..."
            className="form-input w-full"
          />
        </div>
      ))}
      <button onClick={handleSubmit} className="btn-primary">
        Submit Answers
      </button>

      {error && (
        <Alert variant="error">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {evaluationResult && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h4 className="font-semibold mb-2">Evaluation:</h4>
          {evaluationResult.error ? (
            <Alert variant="error">
              <AlertTitle>Evaluation Error</AlertTitle>
              <AlertDescription>{evaluationResult.error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <p>Score: {evaluationResult.score}%</p>
              <p className="mt-2">{evaluationResult.feedback}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizDisplay;