// src/components/learningPath/MotivationalMessage.tsx
import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MotivationalMessage: React.FC = () => {
  const { data, error } = useSWR('/api/motivation', fetcher);

  if (error) return null; // Don't display anything if there's an error
  if (!data) return <div>Loading motivational message...</div>; // Optional loading indicator

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4" role="alert">
      <p className="font-bold">Motivational Message</p>
      <p>{data.message}</p>
    </div>
  );
};

export default MotivationalMessage;