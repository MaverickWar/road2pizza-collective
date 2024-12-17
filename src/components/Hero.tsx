import React from 'react';

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] w-full overflow-hidden mt-24">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-background/70"></div>
      </div>
      <div className="relative container mx-auto h-full flex items-center px-4">
        <div className="max-w-2xl animate-fade-up">
          <h1 className="text-4xl md:text-7xl font-bold text-textLight mb-6">
            The Art of Pizza Making
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Join our community of passionate pizza makers and discover the secrets to creating the perfect pie
          </p>
          <button className="bg-accent hover:bg-highlight text-white px-6 py-3 rounded-full transition-colors text-base md:text-lg">
            Join Community
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;