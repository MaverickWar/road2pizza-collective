import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Activity, Bell } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalErrors: number;
    resolvedIssues: number;
    activeAlerts: number;
    avgResponseTime: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  console.log("Rendering StatsCards with stats:", stats);
  
  const cards = [
    {
      title: "Total Errors",
      value: stats.totalErrors,
      icon: AlertTriangle,
      color: "text-red-500",
      gradient: "from-red-500/10 to-red-500/5",
    },
    {
      title: "Resolved Issues",
      value: stats.resolvedIssues,
      icon: CheckCircle,
      color: "text-green-500",
      gradient: "from-green-500/10 to-green-500/5",
    },
    {
      title: "Active Alerts",
      value: stats.activeAlerts,
      icon: Bell,
      color: "text-yellow-500",
      gradient: "from-yellow-500/10 to-yellow-500/5",
    },
    {
      title: "Avg Response Time",
      value: `${stats.avgResponseTime}ms`,
      icon: Activity,
      color: "text-blue-500",
      gradient: "from-blue-500/10 to-blue-500/5",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
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