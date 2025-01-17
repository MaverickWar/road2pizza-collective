import { Button } from "@/components/ui/button";
import { ThreadActions } from "./ThreadActions";
import { Thread } from "./types";
import { Lock, LockOpen, Pin, PinOff } from "lucide-react";

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
      {/* Single Pin/Unpin Button */}
      <Button
        variant="outline"
        size="sm"
        className={`transition-colors ${thread.is_pinned ? "bg-orange-500 text-white hover:bg-orange-600" : ""}`}
        onClick={() => onTogglePinned(thread.id, thread.is_pinned)}
      >
        {thread.is_pinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
      </Button>

      {/* Single Lock/Unlock Button */}
      <Button
        variant="outline"
        size="sm"
        className={`transition-colors ${thread.is_locked ? "bg-orange-500 text-white hover:bg-orange-600" : ""}`}
        onClick={() => onToggleLocked(thread.id, thread.is_locked)}
      >
        {thread.is_locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
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