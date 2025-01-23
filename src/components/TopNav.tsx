import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { UserRound } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { Button } from './ui/button';

interface TopNavProps {
  onLoginClick?: () => void;
}

const TopNav = ({ onLoginClick }: TopNavProps) => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="w-full bg-gradient-to-r from-admin to-admin-secondary py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div></div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="text-white font-bold">
                  Welcome, {user?.username || user?.email || 'User'}!
                </div>
                <UserMenu user={user} isAdmin={isAdmin} />
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-white/90">
                  Welcome to Road2Pizza!
                </div>
                <Button
                  onClick={onLoginClick}
                  variant="ghost"
                  className="text-white hover:text-white/90 hover:bg-white/10"
                >
                  <UserRound className="h-4 w-4 mr-2" />
                  Login / Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;