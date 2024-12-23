import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

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
    <div className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-end items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center space-x-2 text-sm text-textLight hover:text-accent">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user_metadata?.username || user.id}`} />
                  <AvatarFallback>
                    <UserRound className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span>{isAdmin ? 'Admin' : 'Member'} Dashboard</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-sm text-textLight hover:text-accent"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login" className="flex items-center space-x-2 text-sm text-textLight hover:text-accent">
              <UserRound className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;