import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Thread } from "./types";
import ThreadHeader from "./ThreadHeader";
import ThreadContent from "./ThreadContent";
import ThreadReplies from "./ThreadReplies";
import ReplyForm from "./ReplyForm";
import { ThreadActions } from "./ThreadActions";

interface ThreadViewProps {
  threadId?: string;
  inModal?: boolean;
}

const ThreadView = ({ threadId: propThreadId, inModal }: ThreadViewProps) => {
  const { id: paramId } = useParams();
  const id = propThreadId || paramId;
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchThread = async () => {
    try {
      console.log("Fetching thread:", id);
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
            created_at
          ),
          posts:forum_posts(
            id,
            content,
            created_at,
            created_by,
            updated_at,
            is_solution,
            is_edited,
            likes_count,
            is_reported,
            is_removed,
            user:profiles(username)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Update view count
      await supabase
        .from("forum_threads")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", id);

      console.log("Fetched thread:", data);
      setThread(data as Thread);
    } catch (error) {
      console.error("Error fetching thread:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchThread();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!thread) {
    return <div>Thread not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <ThreadHeader thread={thread} />
        <ThreadActions 
          threadId={thread.id}
          currentTitle={thread.title}
          currentContent={thread.content}
          currentCategoryId={thread.forum?.category?.id}
          onThreadUpdated={fetchThread}
        />
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