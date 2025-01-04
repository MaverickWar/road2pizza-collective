import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star } from "lucide-react";
import BadgeManagement from "@/components/admin/rewards/BadgeManagement";
import PointRulesManagement from "@/components/admin/rewards/PointRulesManagement";
import DashboardLayout from "@/components/DashboardLayout";

const RewardsManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Rewards Management</h1>
        </div>

        <Tabs defaultValue="badges" className="space-y-4">
          <TabsList>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Points
            </TabsTrigger>
          </TabsList>

          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Badge Management</CardTitle>
              </CardHeader>
              <CardContent>
                <BadgeManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle>Point Rules Management</CardTitle>
              </CardHeader>
              <CardContent>
                <PointRulesManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RewardsManagement;