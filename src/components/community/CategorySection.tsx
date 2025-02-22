
import { useAuth } from "@/components/AuthProvider";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Editor from "@/components/Editor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, MessageSquare, Eye, Clock, Shield, Pin, Lock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface CategorySectionProps {
  category: {
    id: string;
    name: string;
    description: string;
    forum_threads: Array<{
      id: string;
      title: string;
      content: string;
      created_at: string;
      view_count: number;
      created_by: string;
      is_pinned: boolean;
      is_locked: boolean;
      category_id: string;
      post_count: number;
      last_post_at: string;
      last_post_by: string;
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
    }>;
  };
}

const CategorySection = ({ category }: CategorySectionProps) => {
  const { user, isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('forum_threads')
        .insert([
          {
            title: data.title,
            content: content,
            category_id: category.id,
            created_by: user.id,
            is_pinned: false,
            is_locked: false,
            post_count: 0,
            view_count: 0,
            last_post_at: new Date().toISOString(),
            last_post_by: user.id
          }
        ]);

      if (error) throw error;

      toast.success('Thread created successfully');
      setIsDialogOpen(false);
      reset();
      setContent("");
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedThreads = [...category.forum_threads].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return new Date(b.last_post_at).getTime() - new Date(a.last_post_at).getTime();
  });

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
          </div>
          {user && (
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-accent hover:bg-accent/90"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Thread
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {sortedThreads.map((thread) => (
            <Link
              key={thread.id}
              to={`/community/forum/thread/${thread.id}`}
              className="block group"
            >
              <div className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={thread.author?.avatar_url} />
                  <AvatarFallback>
                    {thread.author?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {thread.is_pinned && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                        <Pin className="w-3 h-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                    {thread.is_locked && (
                      <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                    <h4 className="font-medium text-foreground group-hover:text-accent-foreground truncate">
                      {thread.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{thread.post_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{thread.view_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDistanceToNow(new Date(thread.last_post_at))} ago</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm">
                  <div className="font-medium text-foreground">
                    {thread.author?.username}
                    {(thread.author?.is_admin || thread.author?.is_staff) && (
                      <Badge variant="secondary" className="ml-2">
                        <Shield className="w-3 h-3 mr-1" />
                        {thread.author?.is_admin ? "Admin" : "Staff"}
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground mt-1">
                    Last reply by {thread.last_poster?.username || thread.author?.username}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {category.forum_threads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No threads yet. Be the first to start a discussion!
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                placeholder="Thread Title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {errors.title.message as string}
                </p>
              )}
            </div>
            <div>
              <Editor content={content} onChange={setContent} />
              {!content && (
                <p className="text-sm text-destructive mt-1">
                  Content is required
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !content}
              >
                {isSubmitting ? "Creating..." : "Create Thread"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CategorySection;
