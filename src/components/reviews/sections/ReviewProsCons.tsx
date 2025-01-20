import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { ReviewData } from "@/types/review";

interface ReviewProsConsProps {
  review: ReviewData;
}

export const ReviewProsCons = ({ review }: ReviewProsConsProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-secondary/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-green-600">
          <ThumbsUp className="w-5 h-5 mr-2" />
          Pros
        </h3>
        <ul className="space-y-2">
          {review.pros?.map((pro, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6 bg-secondary/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
          <ThumbsDown className="w-5 h-5 mr-2" />
          Cons
        </h3>
        <ul className="space-y-2">
          {review.cons?.map((con, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✗</span>
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};