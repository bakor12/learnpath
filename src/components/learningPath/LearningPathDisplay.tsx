import React from 'react';
import { LearningPath } from '../../types';
import ResourceRecommendations from './ResourceRecommendations'; // Import

interface LearningPathDisplayProps {
    learningPath: LearningPath;
    onModuleComplete: (moduleId: string) => void; // Add this prop
}

const LearningPathDisplay: React.FC<LearningPathDisplayProps> = ({ learningPath, onModuleComplete }) => { // Add onModuleComplete
  if (!learningPath || !learningPath.modules) { // Add this check
    return <div>Loading or no modules available.</div>; // Or some other placeholder
  }

  return (
    <div className="space-y-4">
      {learningPath.modules.map((module) => (
        <div key={module.id} className="bg-white p-4 rounded-md shadow">
          <h3 className="text-xl font-bold">{module.title}</h3>
          {module.description && <p className="text-gray-700">{module.description}</p>}
          <p><strong>Estimated Time:</strong> {module.estimatedTime}</p>
          <p><strong>Difficulty:</strong> {module.difficulty}</p>
          <p><strong>Prerequisites:</strong> {module.prerequisites.join(', ') || 'None'}</p>
          <div>
            <strong>Resource Links:</strong>
            <ul className="list-disc list-inside">
              {module.resourceLinks.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Add Resource Recommendations */}
          <ResourceRecommendations moduleId={module.id} />
          {/* Add Mark as Complete button */}
          <button
            onClick={() => onModuleComplete(module.id)}
            className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Mark as Complete
          </button>
        </div>
      ))}
    </div>
  );
};

export default LearningPathDisplay;