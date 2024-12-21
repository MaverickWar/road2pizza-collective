import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ArticleHeaderProps {
  category: string;
  title: string;
  author: string;
}

const ArticleHeader = ({ category, title, author }: ArticleHeaderProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/pizza" className="inline-flex items-center text-accent hover:text-highlight mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Pizza Styles
      </Link>
      
      <div>
        <span className="text-accent text-sm font-semibold">{category || 'Uncategorized'}</span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4">{title}</h1>
        <p className="text-gray-400 mb-6">By {author}</p>
      </div>
    </div>
  );
};

export default ArticleHeader;