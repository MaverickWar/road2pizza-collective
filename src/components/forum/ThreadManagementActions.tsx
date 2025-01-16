import { Button } from "@/components/ui/button";
import { ThreadActions } from "./ThreadActions";
import { Thread } from "./types";

interface ThreadManagementActionsProps {
  thread: Thread;
  onThreadUpdated: () => void;
  onTogglePinned: (threadId: string, currentState: boolean) => Promise<void>;
  onToggleLocked: (threadId: string, currentState: boolean) => Promise<void>;
}

const ThreadManagementActions = ({
  thread,
  onThreadUpdated,
  onTogglePinned,
  onToggleLocked,
}: ThreadManagementActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onTogglePinned(thread.id, thread.is_pinned)}
      >
        {thread.is_pinned ? "Unpin" : "Pin"}
      </Button>
      <ThreadActions
        threadId={thread.id}
        currentTitle={thread.title}
        currentContent={thread.content}
        currentCategoryId={thread.forum?.category?.id}
        onThreadUpdated={onThreadUpdated}
        isInManagement
      />
    </div>
  );
};

export default ThreadManagementActions;