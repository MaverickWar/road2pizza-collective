import { Link } from 'react-router-dom';
import { Pizza, Menu, Home, Users, Star, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MainNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: navigationItems } = useQuery({
    queryKey: ['navigation-menu'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navigation_menu')
        .select(`
          *,
          pages (
            title,
            slug
          )
        `)
        .eq('menu_type', 'main')
        .eq('is_visible', true)
        .order('display_order');
      
      if (error) throw error;
      return data;
    },
  });
  
  const defaultNavLinks = [
    { href: "/", label: "Home", description: "Return to the homepage", icon: Home },
    { href: "/pizza", label: "Pizza", description: "Explore pizza styles and recipes", icon: Pizza },
    { href: "/community", label: "Community", description: "Join discussions and share ideas", icon: Users },
    { href: "/reviews", label: "Reviews", description: "Read and write equipment reviews", icon: Star },
  ];

  const customNavLinks = navigationItems?.map(item => ({
    href: `/page/${item.pages.slug}`,
    label: item.pages.title,
    description: `View ${item.pages.title}`,
    icon: MessageSquare
  })) || [];

  const allNavLinks = [...defaultNavLinks, ...customNavLinks];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-transparent border-2 border-accent rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-accent">
              <Pizza className="w-6 h-6 text-accent transition-colors group-hover:text-white" />
            </div>
            <span className="text-accent font-light text-xl tracking-wider transition-colors hover:text-accent/80">
              Road2Pizza
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {allNavLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-textLight hover:text-accent transition-colors flex items-center gap-2"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Menu className="h-6 w-6 text-textLight transition-opacity" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] bg-white border-l border-gray-100 p-0"
              >
                <SheetHeader className="p-6 border-b border-gray-100">
                  <SheetTitle className="text-2xl font-light text-accent flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-6">
                  {allNavLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="px-6 py-4 text-textLight hover:bg-accent/5 transition-all duration-300 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className="w-5 h-5 text-accent transition-colors group-hover:text-accent-hover" />
                        <div>
                          <div className="text-lg font-medium">{link.label}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {link.description}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;