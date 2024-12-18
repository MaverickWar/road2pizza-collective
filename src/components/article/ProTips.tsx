import React from 'react';

interface ProTipsProps {
  tips: string[];
}

const ProTips = ({ tips }: ProTipsProps) => {
  return (
    <div className="mt-12 bg-secondary rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Pro Tips</h3>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start">
            <span className="text-accent mr-2">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProTips;