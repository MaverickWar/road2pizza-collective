import React from 'react';

interface NutritionInfoProps {
  nutritionInfo: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

const NutritionInfo = ({ nutritionInfo }: NutritionInfoProps) => {
  return (
    <div className="mt-8 bg-secondary rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Nutrition Information</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-400">Calories</p>
          <p className="font-medium">{nutritionInfo.calories || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-400">Protein</p>
          <p className="font-medium">{nutritionInfo.protein || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-400">Carbs</p>
          <p className="font-medium">{nutritionInfo.carbs || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-400">Fat</p>
          <p className="font-medium">{nutritionInfo.fat || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default NutritionInfo;