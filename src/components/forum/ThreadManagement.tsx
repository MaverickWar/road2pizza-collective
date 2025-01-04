import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import ThreadManagementActions from "./ThreadManagementActions";

const ThreadManagement = () => {
  const { data: threads, isLoading, refetch } = useQuery({
    queryKey: ["forum-threads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_threads")
        .select(`
          *,
          forum:forums(title),
          profiles(username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleTogglePinned = async (threadId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({ is_pinned: !currentState })
        .eq("id", threadId);

      if (error) throw error;

      toast.success(`Thread ${currentState ? 'unpinned' : 'pinned'} successfully`);
      refetch();
    } catch (error) {
      console.error("Error toggling thread pin status:", error);
      toast.error("Failed to update thread status");
    }
  };

  const handleToggleLocked = async (threadId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({ is_locked: !currentState })
        .eq("id", threadId);

      if (error) throw error;

      toast.success(`Thread ${currentState ? 'unlocked' : 'locked'} successfully`);
      refetch();
    } catch (error) {
      console.error("Error toggling thread lock status:", error);
      toast.error("Failed to update thread status");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Forum</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {threads?.map((thread) => (
            <TableRow key={thread.id}>
              <TableCell>{thread.title}</TableCell>
              <TableCell>{thread.profiles?.username}</TableCell>
              <TableCell>{thread.forum?.title}</TableCell>
              <TableCell>{format(new Date(thread.created_at), "MMM d, yyyy")}</TableCell>
              <TableCell>
                {thread.is_pinned && <span className="mr-2">📌</span>}
                {thread.is_locked && <span>🔒</span>}
              </TableCell>
              <TableCell>
                <ThreadManagementActions
                  thread={thread}
                  onThreadUpdated={refetch}
                  onTogglePinned={handleTogglePinned}
                  onToggleLocked={handleToggleLocked}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ThreadManagement;