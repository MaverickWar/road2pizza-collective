import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ArticleErrorProps {
  message?: string;
}

const ArticleError = ({ message = "Error loading recipe" }: ArticleErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="flex items-center gap-2 text-destructive mb-2">
        <AlertCircle className="h-5 w-5" />
        <span className="font-semibold">Error</span>
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default ArticleError;