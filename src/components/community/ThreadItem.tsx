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
  onThreadDelete?: (threadId: string) => void;
}

export const ThreadItem = ({
  thread,
  showAdminControls = false,
  onThreadUpdate,
  onThreadDelete,
}: ThreadItemProps) => {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { user } = useAuth();

  const handlePinToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('forum_threads')
        .update({ is_pinned: !thread.is_pinned })
        .eq('id', thread.id);

      if (error) throw error;

      onThreadUpdate?.(thread.id, { is_pinned: !thread.is_pinned });
      toast.success(thread.is_pinned ? 'Thread unpinned' : 'Thread pinned');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to update thread pin status');
    }
  };

  const handleLockToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('forum_threads')
        .update({ is_locked: !thread.is_locked })
        .eq('id', thread.id);

      if (error) throw error;

      onThreadUpdate?.(thread.id, { is_locked: !thread.is_locked });
      toast.success(thread.is_locked ? 'Thread unlocked' : 'Thread locked');
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

      onThreadDelete?.(thread.id);
      setIsDeleteDialogOpen(false);
      toast.success('Thread deleted successfully');
    } catch (error) {
      console.error('Error deleting thread:', error);
      toast.error('Failed to delete thread');
    }
  };

  const displayPoster = thread.last_poster || thread.author;

  return (
    <div className="group relative flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/5">
      <Link
        to={`/community/forum/thread/${thread.id}`}
        className="absolute inset-0 z-0"
        aria-label={`View thread: ${thread.title}`}
      />
      
      <div className="flex-1 min-w-0 space-y-1 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground transition-colors line-clamp-1">
            {thread.title}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">{thread.excerpt}</p>
      </div>

      {showAdminControls && (
        <div className="flex items-center gap-2 relative z-10" onClick={e => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePinToggle}
            className={cn(
              "transition-colors hover:bg-orange-100 dark:hover:bg-orange-900",
              thread.is_pinned ? "text-orange-500" : "text-foreground"
            )}
          >
            <Pin className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLockToggle}
            className={cn(
              "transition-colors hover:bg-red-100 dark:hover:bg-red-900",
              thread.is_locked ? "text-red-500" : "text-foreground"
            )}
          >
            {thread.is_locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handlePasswordClick}
            className={cn(
              "transition-colors hover:bg-blue-100 dark:hover:bg-blue-900",
              thread.password_protected ? "text-blue-500" : "text-foreground"
            )}
          >
            <Key className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Separator orientation="vertical" className="h-12" />

      <div className="flex items-center gap-6 text-sm text-muted-foreground relative z-10">
        <div className="flex flex-col items-center">
          <span className="font-medium">{thread.view_count || 0}</span>
          <span className="text-xs flex items-center gap-1">
            <Eye className="h-3 w-3" /> Views
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium">{thread.post_count || 0}</span>
          <span className="text-xs flex items-center gap-1">
            <MessageSquare className="h-3 w-3" /> Posts
          </span>
        </div>
      </div>

      <Separator orientation="vertical" className="h-12" />

      <div className="flex flex-col items-center relative z-10">
        <Avatar className="h-8 w-8">
          <AvatarImage src={displayPoster?.avatar_url} />
          <AvatarFallback>
            {displayPoster?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="mt-1 text-xs text-center">
          <div className="font-medium text-foreground">
            {displayPoster?.username || 'Unknown'}
          </div>
          <div className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(new Date(thread.last_post_at || thread.created_at), 'MMM d, yyyy')}
          </div>
        </div>
      </div>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {thread.password_protected ? 'Remove Password Protection' : 'Set Thread Password'}
            </DialogTitle>
            <DialogDescription>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Thread</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this thread? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ThreadItem;