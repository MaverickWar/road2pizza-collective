import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ForumThreadDetail = () => {
  const { id, threadId } = useParams();
  const threadIdToUse = threadId || id; // Use either threadId from category route or id from direct route

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

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    );
  }

  if (!thread) {
    return (
      <Card className="p-4">
        <p className="text-center text-muted-foreground">Thread not found</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
      <div className="prose dark:prose-invert max-w-none" 
           dangerouslySetInnerHTML={{ __html: thread.content }} />
      
      <div className="mt-4 border-t pt-4">
        <h2 className="text-xl font-semibold mb-4">Responses</h2>
        {thread.forum_posts?.map((post: any) => (
          <div key={post.id} className="mb-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <img 
                src={post.profiles?.avatar_url || '/placeholder.svg'} 
                alt={post.profiles?.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{post.profiles?.username}</span>
            </div>
            <div className="prose dark:prose-invert max-w-none"
                 dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ForumThreadDetail;