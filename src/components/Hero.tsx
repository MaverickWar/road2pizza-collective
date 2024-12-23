import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pizza, ChefHat, Users, Star } from 'lucide-react';
import { Button } from './ui/button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full pt-32 md:pt-40">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/95 to-background/90 dark:from-background-dark/98 dark:via-background-dark/95 dark:to-background-dark/90" />
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl space-y-8 md:space-y-10 animate-fade-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
            <span className="text-textLight dark:text-white">Master the Art of</span>
            <span className="bg-gradient-to-r from-[#FFB168] to-[#FF6B6B] text-transparent bg-clip-text"> Pizza Making</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Join our passionate community of pizza enthusiasts and discover the secrets 
            to creating the perfect pie, from classic Neapolitan to innovative modern styles.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/pizza')}
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB168] hover:from-[#FF8B8B] hover:to-[#FFCF98] text-white font-semibold"
            >
              <Pizza className="mr-2 h-5 w-5" />
              Explore Recipes
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/community')}
              className="border-2 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-[#FF6B6B]"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-8 md:pt-12">
            {[
              { icon: ChefHat, label: 'Expert Guidance', value: '50+ Chefs' },
              { icon: Pizza, label: 'Pizza Styles', value: '20+ Styles' },
              { icon: Users, label: 'Community', value: '10k+ Members' },
              { icon: Star, label: 'Rating', value: '4.9/5' },
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 rounded-lg bg-card/5 dark:bg-card-dark/5 backdrop-blur-sm border border-white/10 dark:border-white/5 hover:bg-card/10 dark:hover:bg-card-dark/10 transition-colors"
              >
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-[#FF6B6B]" />
                <div className="font-bold text-lg md:text-xl text-textLight dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;