import { Thread } from './types';

interface ThreadHeaderProps {
  thread: Thread;
}

const ThreadHeader = ({ thread }: ThreadHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{thread.title}</h1>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
        <span>Forum: {thread.forum?.title}</span>
        {thread.forum?.category && (
          <span>• Category: {thread.forum.category.name}</span>
        )}
        {thread.is_locked && (
          <span className="text-destructive">• 🔒 Locked</span>
        )}
      </div>
    </div>
  );
};

export default ThreadHeader;