import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Star, 
  Award,
  FileText,
  Bell,
  Settings,
  Palette,
  Image,
  Trophy,
  MessageSquare
} from 'lucide-react';

interface DashboardNavItemsProps {
  isAdmin: boolean;
  isStaff: boolean;
  isMobile: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const DashboardNavItems = ({ 
  isAdmin, 
  isStaff, 
  isMobile,
  setIsSidebarOpen 
}: DashboardNavItemsProps) => {
  const handleClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  if (isAdmin) {
    return (
      <>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Overview
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin/users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin/recipes">
            <BookOpen className="w-4 h-4 mr-2" />
            Recipes
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin/reviews">
            <Star className="w-4 h-4 mr-2" />
            Reviews
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin/rewards">
            <Award className="w-4 h-4 mr-2" />
            Rewards
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin/pizza-types">
            <FileText className="w-4 h-4 mr-2" />
            Pizza Types
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin/forum">
            <MessageSquare className="w-4 h-4 mr-2" />
            Forum
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin/notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin/settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin/theme">
            <Palette className="w-4 h-4 mr-2" />
            Theme
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/admin/media">
            <Image className="w-4 h-4 mr-2" />
            Media
          </Link>
        </Button>
      </>
    );
  }

  if (isStaff) {
    return (
      <>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/staff">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Overview
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/staff/recipes">
            <BookOpen className="w-4 h-4 mr-2" />
            Recipes
          </Link>
        </Button>
        <Button variant="ghost" asChild onClick={handleClick}>
          <Link to="/dashboard/staff/reviews">
            <Star className="w-4 h-4 mr-2" />
            Reviews
          </Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <Button variant="ghost" asChild onClick={handleClick}>
        <Link to="/dashboard">
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Overview
        </Link>
      </Button>
      <Button variant="ghost" asChild onClick={handleClick}>
        <Link to="/dashboard/recipes">
          <BookOpen className="w-4 h-4 mr-2" />
          My Recipes
        </Link>
      </Button>
      <Button variant="ghost" asChild onClick={handleClick}>
        <Link to="/dashboard/reviews">
          <Star className="w-4 h-4 mr-2" />
          My Reviews
        </Link>
      </Button>
      <Button variant="ghost" asChild onClick={handleClick}>
        <Link to="/dashboard/achievements">
          <Trophy className="w-4 h-4 mr-2" />
          Achievements
        </Link>
      </Button>
    </>
  );
};

export default DashboardNavItems;