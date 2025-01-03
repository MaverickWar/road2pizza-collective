import { Card } from "@/components/ui/card";

interface RecipeTipsProps {
  tips: string[];
}

const RecipeTips = ({ tips }: RecipeTipsProps) => {
  if (!tips?.length) return null;

  return (
    <Card className="p-6 bg-card hover:bg-card-hover transition-colors">
      <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
      <ul className="space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start">
            <span className="text-highlight mr-2">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default RecipeTips;