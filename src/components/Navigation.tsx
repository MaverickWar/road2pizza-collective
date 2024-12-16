import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-accent hover:text-highlight transition-colors">
            Road2Pizza
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-textLight hover:text-accent transition-colors">Home</Link>
            <Link to="/recipes" className="text-textLight hover:text-accent transition-colors">Recipes</Link>
            <Link to="/community" className="text-textLight hover:text-accent transition-colors">Community</Link>
            <Link to="/techniques" className="text-textLight hover:text-accent transition-colors">Techniques</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;