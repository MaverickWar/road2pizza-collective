import React from 'react';

const RecipeVisibilityBanner = () => {
  return (
    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
      This recipe is unpublished. Only you and administrators can view it.
    </div>
  );
};

export default RecipeVisibilityBanner;