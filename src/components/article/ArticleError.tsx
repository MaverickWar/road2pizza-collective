import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation';

const ArticleError = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <Link to="/pizza" className="text-accent hover:text-highlight">
            Return to Pizza Styles
          </Link>
        </div>
      </div>
    </>
  );
};

export default ArticleError;