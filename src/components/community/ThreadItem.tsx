import { Link } from "react-router-dom";
import { MessageSquare, Eye, Clock, Pin, PinOff, Lock, LockOpen, Trash2, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ThreadItemProps {
  thread: {
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    category_id: string;
    forum_posts: any[];
    created_at: string;
    created_by: string;
    post_count: number;
    view_count: number;
    last_post_at: string;
    last_post_by: string;
    password_protected?: boolean;
    author?: {
      username: string;
      avatar_url?: string;
      is_admin?: boolean;
      is_staff?: boolean;
    };
    last_poster?: {
      username: string;
      avatar_url?: string;
    };
  };
  showAdminControls?: boolean;
  onThreadUpdated: () => void;
}

const ThreadItem = ({ thread, showAdminControls, onThreadUpdated }: ThreadItemProps) => {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  
  const getUsernameStyle = (isAdmin?: boolean, isStaff?: boolean) => {
    if (isAdmin) return "font-bold text-red-500";
    if (isStaff) return "font-bold text-blue-500";
    return "text-gray-900 dark:text-gray-100";
  };

  const handlePinToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({ is_pinned: !thread.is_pinned })
        .eq("id", thread.id);

      if (error) throw error;
      toast.success(thread.is_pinned ? "Thread unpinned" : "Thread pinned");
      onThreadUpdated();
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast.error("Failed to update thread");
    }
  };

  const handleLockToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({ is_locked: !thread.is_locked })
        .eq("id", thread.id);

      if (error) throw error;
      toast.success(thread.is_locked ? "Thread unlocked" : "Thread locked");
      onThreadUpdated();
    } catch (error) {
      console.error("Error toggling lock:", error);
      toast.error("Failed to update thread");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    
    if (!confirm("Are you sure you want to delete this thread?")) return;
    
    try {
      const { error } = await supabase
        .from("forum_threads")
        .delete()
        .eq("id", thread.id);

      if (error) throw error;
      toast.success("Thread deleted");
      onThreadUpdated();
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast.error("Failed to delete thread");
    }
  };

  const handlePasswordUpdate = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({ 
          password: password || null,
          password_protected: Boolean(password)
        })
        .eq("id", thread.id);

      if (error) throw error;
      toast.success(password ? "Password set successfully" : "Password removed");
      setIsPasswordDialogOpen(false);
      setPassword("");
      onThreadUpdated();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  const handlePasswordClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    setIsPasswordDialogOpen(true);
  };

  // Use author as last poster if no last poster exists
  const displayPoster = thread.last_poster || thread.author;

  return (
    <div className="group relative flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/5">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <Link
            to={`/community/forum/thread/${thread.id}`}
            className="text-lg font-semibold hover:text-accent transition-colors line-clamp-1"
          >
            {thread.title}
          </Link>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-2">
            by{" "}
            <span className={getUsernameStyle(thread.author?.is_admin, thread.author?.is_staff)}>
              {thread.author?.username || "Unknown"}
            </span>
          </span>
          <span className="text-muted-foreground">
            {format(new Date(thread.created_at), 'PP')}
          </span>
        </div>
      </div>

      {showAdminControls && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePinToggle}
            className={cn(
              "transition-colors",
              thread.is_pinned && "text-yellow-500 hover:text-yellow-600"
            )}
          >
            {thread.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLockToggle}
            className={cn(
              "transition-colors",
              thread.is_locked && "text-red-500 hover:text-red-600"
            )}
          >
            {thread.is_locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePasswordClick}
            className={cn(
              "transition-colors",
              thread.password_protected && "text-blue-500 hover:text-blue-600"
            )}
          >
            <Key className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Separator orientation="vertical" className="h-12" />

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex flex-col items-center">
          <span className="font-medium">{thread.view_count || 0}</span>
          <span className="text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" /> Views
          </span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="font-medium">{thread.post_count || thread.forum_posts?.length || 0}</span>
          <span className="text-xs flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> Replies
          </span>
        </div>
      </div>

      <Separator orientation="vertical" className="h-12" />

      <div className="flex flex-col items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src={displayPoster?.avatar_url} />
          <AvatarFallback>
            {displayPoster?.username?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(new Date(thread.last_post_at || thread.created_at), 'PP')}
        </div>
      </div>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {thread.password_protected ? 'Update Thread Password' : 'Set Thread Password'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between">
              <Button onClick={handlePasswordUpdate}>
                {password ? 'Save Password' : 'Remove Password'}
              </Button>
              {thread.password_protected && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setPassword('');
                    handlePasswordUpdate;
                  }}
                >
                  Remove Password
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThreadItem;