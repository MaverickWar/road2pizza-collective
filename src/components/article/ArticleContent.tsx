import React from 'react';
import { Recipe } from '@/integrations/supabase/types';

interface ArticleContentProps {
  content: string;
  nutritionInfo: Recipe['nutrition_info'];
}

const ArticleContent = ({ content, nutritionInfo }: ArticleContentProps) => {
  return (
    <div className="space-y-8 md:space-y-12">
      <div className="prose prose-invert max-w-none">
        {content?.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-6 text-lg leading-relaxed">{paragraph}</p>
        ))}
      </div>
      
      {nutritionInfo && (
        <div className="mt-8 bg-secondary rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Nutrition Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400">Calories</p>
              <p className="font-medium">{nutritionInfo.calories}</p>
            </div>
            <div>
              <p className="text-gray-400">Protein</p>
              <p className="font-medium">{nutritionInfo.protein}</p>
            </div>
            <div>
              <p className="text-gray-400">Carbs</p>
              <p className="font-medium">{nutritionInfo.carbs}</p>
            </div>
            <div>
              <p className="text-gray-400">Fat</p>
              <p className="font-medium">{nutritionInfo.fat}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleContent;