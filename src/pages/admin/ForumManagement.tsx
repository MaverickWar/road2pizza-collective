import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForumSettings from "@/components/forum/ForumSettings";
import CategoryManagement from "@/components/forum/CategoryManagement";
import ThreadManagement from "@/components/forum/ThreadManagement";
import { MessageSquare } from "lucide-react";

const ForumManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Forum Management
          </h1>
        </div>

        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="threads">Threads</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Forum Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <ForumSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threads">
            <Card>
              <CardHeader>
                <CardTitle>Thread Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ThreadManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ForumManagement;