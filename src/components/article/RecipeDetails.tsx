import React from 'react';
import { Clock, Users, ChefHat } from 'lucide-react';

interface RecipeDetailsProps {
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
}

const RecipeDetails = ({ prepTime, cookTime, servings, difficulty }: RecipeDetailsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-secondary p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-accent" />
        <div>
          <p className="text-sm text-gray-400">Prep Time</p>
          <p className="font-medium">{prepTime}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-accent" />
        <div>
          <p className="text-sm text-gray-400">Cook Time</p>
          <p className="font-medium">{cookTime}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Users className="w-5 h-5 text-accent" />
        <div>
          <p className="text-sm text-gray-400">Servings</p>
          <p className="font-medium">{servings}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ChefHat className="w-5 h-5 text-accent" />
        <div>
          <p className="text-sm text-gray-400">Difficulty</p>
          <p className="font-medium">{difficulty}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;