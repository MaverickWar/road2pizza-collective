import { useState } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ModerationDashboard = () => {
  const [activeTab, setActiveTab] = useState("reported");

  const { data: reportedContent, isLoading } = useQuery({
    queryKey: ["reported-content"],
    queryFn: async () => {
      console.log("Fetching reported content...");
      const { data, error } = await supabase
        .from("forum_posts")
        .select(`
          *,
          forum_threads (title),
          profiles (username)
        `)
        .eq("is_reported", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reported content:", error);
        throw error;
      }

      console.log("Fetched reported content:", data);
      return data;
    },
  });

  const handleModerate = async (postId: string, action: "approve" | "remove") => {
    try {
      const { error } = await supabase
        .from("forum_posts")
        .update({
          is_reported: false,
          ...(action === "remove" && { is_removed: true }),
        })
        .eq("id", postId);

      if (error) throw error;

      toast.success(
        `Post ${action === "approve" ? "approved" : "removed"} successfully`
      );
    } catch (error) {
      console.error("Error moderating post:", error);
      toast.error("Failed to moderate post");
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Content Moderation</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="reported">Reported Content</TabsTrigger>
            <TabsTrigger value="banned">Banned Users</TabsTrigger>
          </TabsList>

          <TabsContent value="reported">
            <Card>
              <CardHeader>
                <CardTitle>Reported Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Thread</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportedContent?.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>{post.profiles?.username}</TableCell>
                          <TableCell className="max-w-md truncate">
                            {post.content}
                          </TableCell>
                          <TableCell>{post.forum_threads?.title}</TableCell>
                          <TableCell>
                            {new Date(post.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleModerate(post.id, "approve")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleModerate(post.id, "remove")}
                              >
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!reportedContent || reportedContent.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No reported content to review
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banned">
            <Card>
              <CardHeader>
                <CardTitle>Banned Users Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Banned users management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ModerationDashboard;