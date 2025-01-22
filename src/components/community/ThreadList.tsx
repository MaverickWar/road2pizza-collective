import ThreadItem from './ThreadItem';
import { Card } from "@/components/ui/card";

interface ThreadListProps {
  threads: Array<{
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    category_id: string;
    forum_posts: any[];
    created_at: string;
    created_by: string;
    post_count: number;
    view_count: number;
    last_post_at: string;
    last_post_by: string;
    author?: {
      username: string;
      avatar_url?: string;
    };
    last_poster?: {
      username: string;
      avatar_url?: string;
    };
  }>;
  showAdminControls: boolean;
  onThreadUpdated: () => void;
}

const ThreadList = ({ threads, showAdminControls, onThreadUpdated }: ThreadListProps) => {
  if (threads.length === 0) {
    return (
      <Card className="p-8">
        <p className="text-center text-muted-foreground">
          No threads yet. Be the first to start a discussion!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <ThreadItem 
          key={thread.id} 
          thread={{
            ...thread,
            view_count: thread.view_count || 0
          }}
          showAdminControls={showAdminControls}
          onThreadUpdated={onThreadUpdated}
        />
      ))}
    </div>
  );
};

export default ThreadList;