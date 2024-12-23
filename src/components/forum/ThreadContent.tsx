interface ThreadContentProps {
  content: string;
}

const ThreadContent = ({ content }: ThreadContentProps) => {
  return (
    <div className="bg-card p-6 rounded-lg">
      <div 
        className="prose prose-invert max-w-none" 
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
};

export default ThreadContent;