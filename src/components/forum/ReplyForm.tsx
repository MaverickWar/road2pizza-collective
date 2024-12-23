import { Button } from '@/components/ui/button';
import Editor from '@/components/Editor';

interface ReplyFormProps {
  content: string;
  onChange: (content: string) => void;
  onSubmit: () => void;
}

const ReplyForm = ({ content, onChange, onSubmit }: ReplyFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Post Reply</h3>
      <Editor content={content} onChange={onChange} />
      <Button onClick={onSubmit}>Post Reply</Button>
    </div>
  );
};

export default ReplyForm;