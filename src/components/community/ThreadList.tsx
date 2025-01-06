import ThreadItem from './ThreadItem';

interface ThreadListProps {
  threads: Array<{
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    category_id: string;
    forum_posts: any[];
  }>;
  showAdminControls: boolean;
  onThreadUpdated: () => void;
}

const ThreadList = ({ threads, showAdminControls, onThreadUpdated }: ThreadListProps) => {
  if (threads.length === 0) {
    return (
      <p className="text-center py-8 text-muted-foreground">
        No threads yet. Be the first to start a discussion!
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {threads.map((thread) => (
        <ThreadItem 
          key={thread.id} 
          thread={thread}
          showAdminControls={showAdminControls}
          onThreadUpdated={onThreadUpdated}
        />
      ))}
    </div>
  );
};

export default ThreadList;