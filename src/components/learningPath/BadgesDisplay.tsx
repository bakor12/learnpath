// src/components/learningPath/BadgesDisplay.tsx

import React from 'react';
import Image from 'next/image';

interface BadgesDisplayProps {
    badges: string[];
}

const BadgesDisplay: React.FC<BadgesDisplayProps> = ({ badges }) => {
    // Replace with your actual badge images or icons
    const badgeImages: Record<string, string> = {
        'three-modules-complete': '/badges/three-modules.png', // Example
        'specific-skill-badge': '/badges/specific-skill.png'
        // Add more badge mappings here
    };

    return (
        <div className="mt-4">
            <h4 className="text-lg font-semibold">Your Badges</h4>
            <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                    <div key={badge} className="bg-gray-200 p-2 rounded-md">
                        {badgeImages[badge] ? (
                            <Image
                                src={badgeImages[badge]}
                                alt={badge}
                                className="h-12 w-12"
                                width={48}  // Added width prop
                                height={48} // Added height prop
                            />
                        ) : (
                            <span>{badge}</span> // Fallback to text if no image
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BadgesDisplay;