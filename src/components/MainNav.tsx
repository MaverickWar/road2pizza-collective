import { Link } from 'react-router-dom';
import { Pizza, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MainNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { href: "/", label: "Home", description: "Return to the homepage" },
    { href: "/pizza", label: "Pizza", description: "Explore pizza styles and recipes" },
    { href: "/community", label: "Community", description: "Join discussions and share ideas" },
    { href: "/reviews", label: "Reviews", description: "Read and write equipment reviews" },
  ];

  return (
    <nav className="w-full bg-white/95 dark:bg-background-dark backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-transparent border-2 border-accent rounded-full flex items-center justify-center transition-colors hover:bg-accent/5">
              <Pizza className="w-6 h-6 text-accent" />
            </div>
            <span className="text-accent font-light text-xl tracking-wider hover:text-accent/80 transition-colors">
              Road2Pizza
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-textLight hover:text-accent transition-colors dark:text-gray-200 dark:hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Menu className="h-6 w-6 text-textLight dark:text-gray-200" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] bg-white dark:bg-background-dark border-l border-gray-100 dark:border-gray-800 p-0"
              >
                <SheetHeader className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <SheetTitle className="text-2xl font-light text-accent">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="px-6 py-4 text-textLight dark:text-gray-200 hover:bg-accent/5 dark:hover:bg-accent/10 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="text-lg font-medium">{link.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {link.description}
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