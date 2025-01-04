import { Card } from "@/components/ui/card";

interface ThreadContentProps {
  content: string;
}

const ThreadContent = ({ content }: ThreadContentProps) => {
  return (
    <Card className="p-6 bg-card hover:bg-card/80 transition-colors">
      <div 
        className="prose prose-sm md:prose-base prose-invert max-w-none" 
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </Card>
  );
};

export default ThreadContent;