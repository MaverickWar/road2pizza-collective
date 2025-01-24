import { Link } from "react-router-dom";
import { MessageSquare, Eye, Clock, Pin, Lock, LockOpen, Trash2, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

interface ThreadItemProps {
  thread: any;
  showAdminControls?: boolean;
  onThreadUpdate?: (threadId: string, updates: any) => void;
}

export const ThreadItem = ({
  thread,
  showAdminControls = false,
  onThreadUpdate,
}: ThreadItemProps) => {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isPinned, setIsPinned] = useState(thread.is_pinned);
  const [isLocked, setIsLocked] = useState(thread.is_locked);
  const { user } = useAuth();

  const handlePinToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Attempting to toggle pin status for thread:', thread.id);
      const { data, error } = await supabase
        .from('forum_threads')
        .update({ is_pinned: !isPinned })
        .eq('id', thread.id)
        .select();

      if (error) {
        console.error('Error toggling pin:', error);
        throw error;
      }

      console.log('Pin toggle successful:', data);
      setIsPinned(!isPinned);
      onThreadUpdate?.(thread.id, { is_pinned: !isPinned });
      toast.success(isPinned ? 'Thread unpinned' : 'Thread pinned');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to update thread pin status');
    }
  };

  const handleLockToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Attempting to toggle lock status for thread:', thread.id);
      const { data, error } = await supabase
        .from('forum_threads')
        .update({ is_locked: !isLocked })
        .eq('id', thread.id)
        .select();

      if (error) {
        console.error('Error toggling lock:', error);
        throw error;
      }

      console.log('Lock toggle successful:', data);
      setIsLocked(!isLocked);
      onThreadUpdate?.(thread.id, { is_locked: !isLocked });
      toast.success(isLocked ? 'Thread unlocked' : 'Thread locked');
    } catch (error) {
      console.error('Error toggling lock:', error);
      toast.error('Failed to update thread lock status');
    }
  };

  const handlePasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordSet = async () => {
    try {
      const updates = password
        ? { password_protected: true, password }
        : { password_protected: false, password: null };

      const { error } = await supabase
        .from('forum_threads')
        .update(updates)
        .eq('id', thread.id);

      if (error) throw error;

      onThreadUpdate?.(thread.id, updates);
      setIsPasswordDialogOpen(false);
      setPassword("");
      toast.success(password ? 'Password protection enabled' : 'Password protection removed');
    } catch (error) {
      console.error('Error setting password:', error);
      toast.error('Failed to update password protection');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('forum_threads')
        .delete()
        .eq('id', thread.id);

      if (error) throw error;

      onThreadUpdate?.(thread.id, { deleted: true });
      setIsDeleteDialogOpen(false);
      toast.success('Thread deleted successfully');
    } catch (error) {
      console.error('Error deleting thread:', error);
      toast.error('Failed to delete thread');
    }
  };

  const displayPoster = thread.last_poster || thread.author;

  return (
    <div className="group relative flex flex-col md:flex-row items-start md:items-center gap-4 rounded-lg border border-border hover:bg-accent/5 p-4">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={thread.author?.avatar_url} />
            <AvatarFallback>
              {thread.author?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/community/forum/thread/${thread.id}`}
              className="font-medium hover:text-accent"
            >
              {thread.title}
            </Link>
            <div className="text-sm text-muted-foreground">
              by {thread.author?.username || 'Unknown'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{thread.post_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{thread.view_count || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{format(new Date(thread.last_post_at || thread.created_at), 'MMM d, yyyy')}</span>
        </div>
      </div>

      <Separator orientation="vertical" className="hidden md:block h-12" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={displayPoster?.avatar_url} />
            <AvatarFallback>
              {displayPoster?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-xs">
            <div className="font-medium text-foreground">
              {displayPoster?.username || 'Unknown'}
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(thread.last_post_at || thread.created_at), 'MMM d, yyyy')}
            </div>
          </div>
        </div>

        {showAdminControls && (
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePinToggle}
              className={cn(
                "h-7 w-7 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900",
                isPinned ? "text-orange-500" : "text-muted-foreground"
              )}
            >
              <Pin className={cn("h-3 w-3", isPinned && "fill-current")} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLockToggle}
              className={cn(
                "h-7 w-7 transition-colors hover:bg-red-100 dark:hover:bg-red-900",
                isLocked ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {isLocked ? (
                <Lock className="h-3 w-3 stroke-[3]" />
              ) : (
                <LockOpen className="h-3 w-3" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handlePasswordClick}
              className={cn(
                "h-7 w-7 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900",
                thread.password_protected ? "text-blue-500" : "text-muted-foreground"
              )}
            >
              <Key className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-7 w-7 text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {thread.password_protected ? 'Remove Password Protection' : 'Set Thread Password'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {thread.password_protected
                ? 'Remove password protection from this thread?'
                : 'Enter a password to protect this thread. Leave empty to remove protection.'}
            </DialogDescription>
          </DialogHeader>
          {!thread.password_protected && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSet}>
              {thread.password_protected ? 'Remove Password' : 'Set Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Thread</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this thread? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background text-foreground border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ThreadItem;
