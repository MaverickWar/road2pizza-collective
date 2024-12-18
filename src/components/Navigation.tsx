import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Pizza, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from './AuthProvider';
import { supabase } from "@/integrations/supabase/client";
import { Button } from './ui/button';
import { toast } from 'sonner';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pizza", label: "Pizza" },
    { href: "/community", label: "Community" },
    { href: "/techniques", label: "Techniques" },
  ];

  if (isAdmin) {
    navLinks.push({ href: "/admin", label: "Admin Dashboard" });
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-transparent border-2 border-white rounded-full flex items-center justify-center">
              <Pizza className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-light text-xl tracking-wider hover:text-accent transition-colors">Road2Pizza</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-textLight hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Button
                variant="ghost"
                className="text-textLight hover:text-accent"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="text-textLight hover:text-accent">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger className="md:hidden p-2">
              <Menu className="h-6 w-6 text-textLight" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background border-l border-gray-800">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-lg text-textLight hover:text-accent transition-colors px-4 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <Button
                    variant="ghost"
                    className="text-textLight hover:text-accent justify-start px-4"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="text-textLight hover:text-accent w-full justify-start px-4">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;