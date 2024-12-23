import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pizza, ChefHat, Users, Star } from 'lucide-react';
import { Button } from './ui/button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[85vh] w-full overflow-hidden mt-24">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/80 dark:from-background/98 dark:to-background/90" />
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-2xl space-y-8 animate-fade-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
            <span className="text-white">Master the Art of</span>
            <span className="bg-gradient-to-r from-[#FFB168] to-[#FF6B6B] text-transparent bg-clip-text"> Pizza Making</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
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
              className="border-2 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
            {[
              { icon: ChefHat, label: 'Expert Guidance', value: '50+ Chefs' },
              { icon: Pizza, label: 'Pizza Styles', value: '20+ Styles' },
              { icon: Users, label: 'Community', value: '10k+ Members' },
              { icon: Star, label: 'Rating', value: '4.9/5' },
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-[#FF6B6B]" />
                <div className="font-bold text-xl text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;