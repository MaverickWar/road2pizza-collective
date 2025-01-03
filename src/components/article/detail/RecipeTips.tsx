import { Card } from "@/components/ui/card";

interface RecipeTipsProps {
  tips: string[];
}

const RecipeTips = ({ tips }: RecipeTipsProps) => {
  if (!tips?.length) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
      <ul className="list-disc list-inside space-y-2">
        {tips.map((tip, index) => (
          <li key={index} className="text-gray-600">{tip}</li>
        ))}
      </ul>
    </Card>
  );
};

export default RecipeTips;