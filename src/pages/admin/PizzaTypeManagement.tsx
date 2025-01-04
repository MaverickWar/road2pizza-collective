import DashboardLayout from "@/components/DashboardLayout";
import PizzaTypeGrid from "@/components/pizza/PizzaTypeGrid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PizzaTypeManagement = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Pizza Type Management</h1>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Pizza Type
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pizza Types</CardTitle>
          </CardHeader>
          <CardContent>
            <PizzaTypeGrid />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PizzaTypeManagement;