import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const TopNav = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      if (!newUsername && !newEmail) {
        toast.error("Please provide at least one change");
        return;
      }

      if (isAdmin && user?.email === 'richgiles@hotmail.co.uk') {
        toast.error("Admin account details cannot be modified");
        return;
      }

      const { error } = await supabase
        .from('profile_change_requests')
        .insert({
          user_id: user?.id,
          requested_username: newUsername || undefined,
          requested_email: newEmail || undefined,
          preserve_roles: true
        });

      if (error) throw error;

      toast.success("Profile change request submitted for review");
      setIsProfileOpen(false);
      setNewUsername('');
      setNewEmail('');
    } catch (error) {
      console.error('Error submitting profile change request:', error);
      toast.error("Failed to submit profile change request");
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FFB168] py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-end items-center">
          <div className="flex items-center space-x-4">
            <div className="text-white font-bold">
              Welcome, {user?.user_metadata?.username || 'User'}!
            </div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full hover:bg-white/20 ring-2 ring-white p-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user_metadata?.username || user.id}`} />
                      <AvatarFallback>
                        <UserRound className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg" 
                  align="end"
                  sideOffset={5}
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.username || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Profile Settings
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-gray-800">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Request changes to your profile. Changes will be reviewed by an admin.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="username">New Username</Label>
                          <Input
                            id="username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Enter new username"
                            disabled={isAdmin && user.email === 'richgiles@hotmail.co.uk'}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">New Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter new email"
                            disabled={isAdmin && user.email === 'richgiles@hotmail.co.uk'}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleProfileUpdate}>
                          Submit Request
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenuItem onSelect={() => navigate('/dashboard')}>
                    {isAdmin ? 'Admin' : 'Member'} Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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