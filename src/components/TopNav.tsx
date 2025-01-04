import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { UserRound } from 'lucide-react';
import { UserMenu } from './UserMenu';

const TopNav = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB168] py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-end items-center">
          <div className="flex items-center space-x-4">
            <div className="text-white font-bold">
              Welcome, {user?.username || user?.email || 'User'}!
            </div>
            {user ? (
              <UserMenu user={user} isAdmin={isAdmin} />
            ) : (
              <Link to="/login" className="flex items-center space-x-2 text-sm text-white hover:text-white/80">
                <UserRound className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;