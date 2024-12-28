import { Button } from '@/components/ui/button';
import Editor from '@/components/Editor';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

export interface ReplyFormProps {
  threadId: string;
  onReplyAdded: () => void;
}

const ReplyForm = ({ threadId, onReplyAdded }: ReplyFormProps) => {
  const [content, setContent] = useState('');
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      const { error } = await supabase
        .from('forum_posts')
        .insert([
          {
            thread_id: threadId,
            content,
            created_by: user?.id,
          },
        ]);

      if (error) throw error;

      toast.success('Reply posted successfully');
      setContent('');
      onReplyAdded();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Post Reply</h3>
      <Editor content={content} onChange={setContent} />
      <Button onClick={handleSubmit}>Post Reply</Button>
    </div>
  );
};

export default ReplyForm;