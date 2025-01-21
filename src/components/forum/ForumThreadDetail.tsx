import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ThreadView from './ThreadView';
import MainLayout from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ForumThreadDetail = () => {
  const { id, threadId } = useParams();
  const threadIdToUse = threadId || id;

  const { data: thread, isLoading, error } = useQuery({
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
              id,
              username,
              avatar_url,
              is_admin,
              is_staff,
              points,
              badge_title,
              badge_color
            )
          ),
          profiles (
            id,
            username,
            avatar_url,
            is_admin,
            is_staff,
            points,
            badge_title,
            badge_color
          ),
          forum:forums (
            id,
            title,
            category:forum_categories (
              id,
              name
            )
          )
        `)
        .eq('id', threadIdToUse)
        .maybeSingle();

      if (error) {
        console.error('Error fetching thread:', error);
        throw error;
      }
      
      if (!data) {
        console.log('Thread not found');
        return null;
      }

      console.log('Thread data:', data);
      return data;
    },
    enabled: !!threadIdToUse
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-4">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-4">
            <p className="text-center text-red-500">Error loading thread</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!thread) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-4">
            <p className="text-center text-muted-foreground">Thread not found</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <ThreadView threadId={thread.id} />
      </div>
    </MainLayout>
  );
};

export default ForumThreadDetail;