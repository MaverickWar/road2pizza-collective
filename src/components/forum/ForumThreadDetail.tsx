import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ThreadView from './ThreadView';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ForumThreadDetail = () => {
  const { id, threadId } = useParams();
  const threadIdToUse = threadId || id;

  const { data: thread, isLoading } = useQuery({
    queryKey: ['forum-thread', threadIdToUse],
    queryFn: async () => {
      console.log('Fetching thread details for:', threadIdToUse);
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          *,
          forum_posts (
            *,
            profiles (
              username,
              avatar_url
            )
          ),
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('id', threadIdToUse)
        .single();

      if (error) throw error;
      console.log('Thread data:', data);
      return data;
    },
    enabled: !!threadIdToUse
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <Card className="p-4">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ) : !thread ? (
          <Card className="p-4">
            <p className="text-center text-muted-foreground">Thread not found</p>
          </Card>
        ) : (
          <ThreadView threadId={thread.id} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ForumThreadDetail;