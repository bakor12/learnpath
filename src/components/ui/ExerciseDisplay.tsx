// src/components/ui/ExerciseDisplay.tsx
import React, { useState } from 'react';
import { evaluateExercise } from '@/services/apiService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define the interfaces for the exercise data
interface Evaluation {
  question: string;
  ideal_answer: string;
  user_answer: string;
  similarity: number;
  correct: boolean;
}

interface EvaluationResult {
  error?: string;
  evaluations?: Evaluation[];
}

 interface ExerciseDefinition {
  questions: {
    id: string;
    text: string;
    options?: string[];
    correctAnswer?: string;
  }[];
  error?: string;
  raw_output?: string;
  id: string;
  type: string;
  
}

interface ExerciseDisplayProps {
  exerciseDefinition: ExerciseDefinition;
}

const ExerciseDisplay: React.FC<ExerciseDisplayProps> = ({ exerciseDefinition }) => {
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setError(null);
    setEvaluationResult(null);
    if (userAnswers.length !== exerciseDefinition.questions?.length) {
        setError("Please answer all questions.");
        return;
    }
    try {
      const result = await evaluateExercise(exerciseDefinition, userAnswers);
      setEvaluationResult(result);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during evaluation.';
      setError(errorMessage);
    }
  };

  if (!exerciseDefinition || exerciseDefinition.error) {
    return (
      <Alert variant="error">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{exerciseDefinition?.error || 'Invalid exercise data.'}</AlertDescription>
      </Alert>
    );
  }

  if (exerciseDefinition.raw_output) {
    return (
      <div>
        <h4 className="font-semibold mb-2">Raw Exercise Output:</h4>
        <p>{exerciseDefinition.raw_output}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Exercise</h3>
      {exerciseDefinition.questions?.map((question, index) => (
        <div key={index} className="space-y-2">
          <p className="font-medium">{index + 1}. {question.text}</p>
          <textarea
            value={userAnswers[index] || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder="Your answer..."
            className="form-input w-full"
            rows={3}
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
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md space-y-2">
          <h4 className="font-semibold mb-2">Evaluation:</h4>
          {evaluationResult.error ? (
            <Alert variant="error">
                <AlertTitle>Evaluation Error</AlertTitle>
                <AlertDescription>{evaluationResult.error}</AlertDescription>
            </Alert>
          ) : (
            evaluationResult.evaluations?.map((evaluation: Evaluation, index: number) => (
              <div key={index} className="border-b pb-2 mb-2 last:border-none">
                <p>
                  <strong>Question:</strong> {evaluation.question}
                </p>
                <p>
                  <strong>Ideal Answer:</strong> {evaluation.ideal_answer}
                </p>
                <p>
                  <strong>Your Answer:</strong> {evaluation.user_answer}
                </p>
                <p>
                  <strong>Similarity:</strong> {evaluation.similarity.toFixed(2)}
                </p>
                <p>
                  <strong>Correct:</strong> {evaluation.correct ? 'Yes' : 'No'}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseDisplay;