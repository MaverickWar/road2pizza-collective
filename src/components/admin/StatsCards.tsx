import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, MessageSquare, Star } from "lucide-react";

interface StatsCardsProps {
  stats: {
    users: number;
    recipes: number;
    reviews: number;
    averageRating: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      color: "text-blue-500",
      gradient: "from-blue-500/10 to-blue-500/5",
    },
    {
      title: "Total Recipes",
      value: stats.recipes,
      icon: BookOpen,
      color: "text-green-500",
      gradient: "from-green-500/10 to-green-500/5",
    },
    {
      title: "Total Reviews",
      value: stats.reviews,
      icon: MessageSquare,
      color: "text-purple-500",
      gradient: "from-purple-500/10 to-purple-500/5",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: "text-yellow-500",
      gradient: "from-yellow-500/10 to-yellow-500/5",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card 
          key={card.title} 
          className="relative overflow-hidden transition-all duration-200 hover:shadow-lg"
        >
          <CardContent className="p-6">
            <div className={`bg-gradient-to-br ${card.gradient} absolute inset-0 opacity-50`} />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <card.icon className={`w-8 h-8 ${card.color}`} />
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;