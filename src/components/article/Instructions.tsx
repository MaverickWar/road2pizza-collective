import React from 'react';

interface InstructionsProps {
  instructions: string[];
}

const Instructions = ({ instructions }: InstructionsProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Instructions</h2>
      <ol className="space-y-4">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex space-x-4">
            <span className="text-accent font-bold">{index + 1}.</span>
            <span>{instruction}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Instructions;