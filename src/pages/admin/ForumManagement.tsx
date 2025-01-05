import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryManagement from "@/components/forum/CategoryManagement";
import ForumSettings from "@/components/forum/ForumSettings";
import { Card } from "@/components/ui/card";

const ForumManagement = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Forum Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your forum categories, settings, and configuration
          </p>
        </div>

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <Card className="p-6">
              <CategoryManagement />
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <ForumSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ForumManagement;