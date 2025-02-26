//src/components/ui/RecommendationsDisplay.tsx
import React from 'react';
import { Recommendation } from '@/types'; // Import Recommendation type

interface RecommendationsDisplayProps {
  recommendations: Recommendation[];
}

const RecommendationsDisplay: React.FC<RecommendationsDisplayProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return <p>No recommendations available at this time.</p>;
  }

    if (recommendations.length > 0 && recommendations[0].error) {
        return <p>Error: {recommendations[0].error}</p>;
    }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Recommendations</h3>
      {recommendations.map((rec, index) => (
        <div key={index} className="border rounded-md p-4">
          <h4 className="font-medium">{rec.topic}</h4>
          <p>{rec.suggestion}</p>
        </div>
      ))}
    </div>
  );
};

export default RecommendationsDisplay;