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
    <>
      <Link to="/" className="inline-flex items-center text-accent hover:text-highlight mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <span className="text-accent text-sm font-semibold">{category}</span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4">{title}</h1>
        <p className="text-gray-400 mb-6">By {author}</p>
      </div>
    </>
  );
};

export default ArticleHeader;