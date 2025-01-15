import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ThreadManagementActions from "./ThreadManagementActions";
import { Thread } from "./types";

const ThreadManagement = () => {
  const { data: threads, isLoading, refetch } = useQuery({
    queryKey: ['forum-threads'],
    queryFn: async () => {
      console.log('Fetching forum threads...');
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          *,
          forum:forums(
            id,
            title,
            description,
            category:forum_categories(
              id,
              name
            )
          ),
          author:profiles(
            username,
            avatar_url,
            created_at,
            points,
            badge_title,
            badge_color,
            is_admin,
            is_staff
          ),
          posts:forum_posts(count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching threads:', error);
        toast.error('Failed to load threads');
        throw error;
      }

      console.log('Successfully fetched threads:', data);
      
      const transformedData = data?.map(thread => {
        const postsCount = thread.posts?.[0]?.count || 0;
        return {
          ...thread,
          author: thread.author || undefined,
          forum: thread.forum || undefined,
          posts: [{
            id: '',
            thread_id: thread.id,
            content: '',
            created_at: new Date().toISOString(),
            created_by: '',
            updated_at: new Date().toISOString(),
            count: postsCount
          }]
        };
      }) as Thread[];

      return transformedData;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Thread Management
          </h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Forum Threads</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading threads...</div>
            ) : threads?.length === 0 ? (
              <div className="text-center py-4">No threads found</div>
            ) : (
              <div className="space-y-4">
                {threads?.map((thread) => (
                  <div
                    key={thread.id}
                    className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{thread.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Posted in {thread.forum?.title} by {thread.author?.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {thread.posts?.[0]?.count || 0} replies
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <ThreadManagementActions
                          thread={thread}
                          onThreadUpdated={refetch}
                          onTogglePinned={async (threadId, currentState) => {
                            try {
                              console.log('Toggling pin status for thread:', threadId);
                              const { error } = await supabase
                                .from('forum_threads')
                                .update({ is_pinned: !currentState })
                                .eq('id', threadId);

                              if (error) throw error;
                              
                              toast.success(`Thread ${currentState ? 'unpinned' : 'pinned'} successfully`);
                              refetch();
                            } catch (error) {
                              console.error('Error toggling pin status:', error);
                              toast.error('Failed to update thread status');
                            }
                          }}
                          onToggleLocked={async (threadId, currentState) => {
                            try {
                              console.log('Toggling lock status for thread:', threadId);
                              const { error } = await supabase
                                .from('forum_threads')
                                .update({ is_locked: !currentState })
                                .eq('id', threadId);

                              if (error) throw error;
                              
                              toast.success(`Thread ${currentState ? 'unlocked' : 'locked'} successfully`);
                              refetch();
                            } catch (error) {
                              console.error('Error toggling lock status:', error);
                              toast.error('Failed to update thread status');
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ThreadManagement;