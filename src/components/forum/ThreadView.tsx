import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Thread } from "./types";
import ThreadHeader from "./ThreadHeader";
import ThreadContent from "./ThreadContent";
import ThreadReplies from "./ThreadReplies";
import ReplyForm from "./ReplyForm";
import { ThreadActions } from "./ThreadActions";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import PasswordProtectedDialog from "./components/PasswordProtectedDialog";

interface ThreadViewProps {
  threadId?: string;
  inModal?: boolean;
}

const ThreadView = ({ threadId: propThreadId, inModal }: ThreadViewProps) => {
  const { id: paramId } = useParams();
  const id = propThreadId || paramId;
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const fetchThread = async () => {
    try {
      console.log("Fetching thread with ID:", id);
      const { data, error } = await supabase
        .from("forum_threads")
        .select(`
          *,
          forum:forums(
            id,
            title,
            category:forum_categories(
              id,
              name
            )
          ),
          author:profiles!forum_threads_created_by_fkey(
            username,
            avatar_url,
            created_at,
            points,
            badge_title,
            badge_color,
            is_admin,
            is_staff
          ),
          posts:forum_posts(
            id,
            content,
            created_at,
            created_by,
            user:profiles!forum_posts_created_by_fkey(
              username,
              avatar_url,
              is_admin,
              is_staff,
              points,
              badge_title,
              badge_color
            )
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching thread:", error);
        throw error;
      }

      if (data) {
        console.log("Thread data fetched successfully:", data);
        
        // Update view count
        const { error: updateError } = await supabase
          .from("forum_threads")
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq("id", id);

        if (updateError) {
          console.error("Error updating view count:", updateError);
        }

        setThread(data as Thread);
        
        // Check if thread is password protected
        if (data.password_protected) {
          console.log("Thread is password protected");
          setIsPasswordDialogOpen(true);
          setHasAccess(false);
        } else {
          setHasAccess(true);
        }
      } else {
        console.log("Thread not found");
        toast.error("Thread not found");
      }
    } catch (error) {
      console.error("Error in fetchThread:", error);
      toast.error("Error loading thread");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      console.log("Thread ID changed, fetching new thread data:", id);
      setHasAccess(false);
      fetchThread();
    }
  }, [id]);

  const handlePasswordSubmit = (password: string) => {
    if (!thread) return;
    
    if (password === thread.password) {
      setHasAccess(true);
      setIsPasswordDialogOpen(false);
      toast.success("Access granted! You can now view the thread.");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-4">Loading thread...</div>;
  }

  if (!thread) {
    return <div className="p-4">Thread not found</div>;
  }

  if (thread.password_protected && !hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mb-6">
          <Link to="/community">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forum
            </Button>
          </Link>
        </div>

        <PasswordProtectedDialog
          isOpen={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
          onSubmit={handlePasswordSubmit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Link to="/community">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forum
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        <ThreadHeader thread={thread} />
        <div className="flex justify-end">
          <ThreadActions 
            threadId={thread.id}
            currentTitle={thread.title}
            currentContent={thread.content}
            currentCategoryId={thread.forum?.category?.id}
            isPinned={thread.is_pinned}
            isLocked={thread.is_locked}
            onThreadUpdated={fetchThread}
          />
        </div>
      </div>
      <ThreadContent content={thread.content} />
      <ThreadReplies 
        posts={thread.posts || []} 
        threadId={thread.id}
        onReplyAdded={fetchThread}
      />
      {!thread.is_locked && (
        <ReplyForm threadId={thread.id} onReplyAdded={fetchThread} />
      )}
    </div>
  );
};

export default ThreadView;
