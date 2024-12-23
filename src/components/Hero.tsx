import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pizza, ChefHat, Users, Star } from 'lucide-react';
import { Button } from './ui/button';

const Hero = () => {
  const navigate = useNavigate();

  const stats = React.useMemo(() => [
    { icon: ChefHat, label: 'Expert Guidance', value: '50+ Chefs' },
    { icon: Pizza, label: 'Pizza Styles', value: '20+ Styles' },
    { icon: Users, label: 'Community', value: '10k+ Members' },
    { icon: Star, label: 'Rating', value: '4.9/5' },
  ], []);

  return (
    <div className="relative min-h-screen w-full pt-32 md:pt-40">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed transition-opacity duration-700"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl space-y-8 md:space-y-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold animate-fade-in">
            <span className="text-white">Master the Art of</span>
            <span className="bg-gradient-to-r from-[#FFB168] to-[#FF6B6B] text-transparent bg-clip-text"> Pizza Making</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            Join our passionate community of pizza enthusiasts and discover the secrets 
            to creating the perfect pie, from classic Neapolitan to innovative modern styles.
          </p>
          
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button 
              size="lg"
              onClick={() => navigate('/pizza')}
              className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB168] hover:from-[#FF8B8B] hover:to-[#FFCF98] text-white font-semibold transform transition-all duration-300 hover:scale-105"
            >
              <Pizza className="mr-2 h-5 w-5" />
              Explore Recipes
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/community')}
              className="border-2 border-white text-white hover:bg-white/10 transform transition-all duration-300 hover:scale-105"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-8 md:pt-12 animate-fade-in" style={{ animationDelay: '600ms' }}>
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${(index + 4) * 150}ms` }}
              >
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-[#FF6B6B]" />
                <div className="font-bold text-lg md:text-xl text-white">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;