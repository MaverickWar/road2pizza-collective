import { useNavigate } from 'react-router-dom';
import { Pizza, ChefHat, Users, Star, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from './AuthProvider';

const Hero = () => {
  console.log('Rendering Hero component');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const stats = [
    { icon: ChefHat, label: 'Expert Guidance', value: '10 Pizza Experts' },
    { icon: Pizza, label: 'Pizza Styles', value: '6 Styles' },
    { icon: Users, label: 'Community', value: '12k+ Members' },
    { icon: Star, label: 'Rating', value: '4.5/5' },
  ];

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  return (
    <section className="relative w-full py-20">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
          maxHeight: '800px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="text-white">Master the Art of</span>
            <span className="block mt-2 bg-gradient-to-r from-[#FFB168] to-[#FF6B6B] text-transparent bg-clip-text">Pizza Making</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            Join our passionate community of pizza enthusiasts and discover the secrets 
            to creating the perfect pie, from classic Neapolitan to innovative modern styles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              onClick={() => handleNavigation('/pizza')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#FF6B6B] to-[#FFB168] hover:from-[#FF8B8B] hover:to-[#FFCF98] text-white font-semibold"
            >
              <Pizza className="mr-2 h-5 w-5" />
              Explore Recipes
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => handleNavigation('/signup')}
              className="w-full sm:w-auto border-2 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white font-semibold"
            >
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Button>

            {isAdmin && (
              <Button 
                size="lg"
                variant="outline"
                onClick={() => handleNavigation('/logs')}
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 font-semibold"
              >
                <FileText className="mr-2 h-5 w-5" />
                System Logs
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 text-[#FF6B6B]" />
              <div className="font-bold text-xl md:text-2xl text-white">{stat.value}</div>
              <div className="text-sm md:text-base text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;