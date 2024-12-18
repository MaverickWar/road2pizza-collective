import React from 'react';

interface IngredientsProps {
  ingredients: string[];
}

const Ingredients = ({ ingredients }: IngredientsProps) => {
  return (
    <div className="mb-8 bg-secondary p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="text-accent">•</span>
            <span>{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ingredients;