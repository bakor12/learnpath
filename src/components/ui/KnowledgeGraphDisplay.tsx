// src/components/ui/KnowledgeGraphDisplay.tsx
import React from 'react';

interface KnowledgeGraphDisplayProps {
  html: string;
}

const KnowledgeGraphDisplay: React.FC<KnowledgeGraphDisplayProps> = ({ html }) => {
  if (!html) {
    return <p>No knowledge graph available.</p>;
  }

  return (
    <div className="knowledge-graph-container">
      {/* WARNING: Using dangerouslySetInnerHTML.  Ensure the HTML from the backend is sanitized! */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default KnowledgeGraphDisplay;