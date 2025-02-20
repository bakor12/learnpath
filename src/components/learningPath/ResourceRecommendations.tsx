// src/components/learningPath/ResourceRecommendations.tsx (Corrected)
import React from 'react';
import useSWR from 'swr';

interface ResourceRecommendationsProps {
  moduleId: string;
}
interface Recommendation {
    title: string;
    description: string;
    url: string;
    type: 'article' | 'video' | 'course' | 'other';
}

const fetcher = async (url: string) => {
  const res = await fetch(url);

  // Check for HTTP errors *before* trying to parse JSON
  if (!res.ok) {
    const errorText = await res.text(); // Get error message as text
    throw new Error(`API Error: ${res.status} - ${errorText}`); // Include status and text
  }

  // Only try to parse JSON if the response was ok
  return res.json();
};

const ResourceRecommendations: React.FC<ResourceRecommendationsProps> = ({ moduleId }) => {
  const { data: recommendations, error } = useSWR<Recommendation[]>(
    `/api/recommendations?moduleId=${moduleId}`,
    fetcher
  );

  if (error) return <div>Failed to load recommendations: {error.message}</div>; // More detailed error
  if (!recommendations) return <div>Loading recommendations...</div>;

  // Defensive programming: Check if recommendations is an array
  if (!Array.isArray(recommendations)) {
      return <div>Unexpected data format received from the server.</div>;
  }

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold">Recommended Resources</h4>
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-gray-100 p-2 rounded-md">
            <h5 className="font-bold">{rec.title}</h5>
            <p className="text-sm">{rec.description}</p>
            <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View Resource ({rec.type})
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceRecommendations;