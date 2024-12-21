interface RecipeStatsProps {
  reviews: any[];
}

const RecipeStats = ({ reviews }: RecipeStatsProps) => {
  const calculateAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="space-y-1">
      <div className="text-sm">
        {reviews?.length || 0} reviews
      </div>
      {reviews?.length > 0 && (
        <div className="text-sm text-yellow-500">
          {calculateAverageRating(reviews)} ⭐
        </div>
      )}
    </div>
  );
};

export default RecipeStats;