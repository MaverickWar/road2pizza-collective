import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Editor from "@/components/Editor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      forum_posts: any[];
      created_by: string;
      author?: {
        username: string;
        avatar_url?: string;
      };
    }>;
  };
  onThreadCreated: () => void;
}

const CategorySection = ({ category, onThreadCreated }: CategorySectionProps) => {
  const { user } = useAuth();
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
            created_by: user.id
          }
        ]);

      if (error) throw error;

      toast.success('Thread created successfully');
      setIsDialogOpen(false);
      reset();
      setContent("");
      onThreadCreated();
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>
        {user && (
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="bg-primary hover:bg-primary/90"
          >
            New Thread
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {category.forum_threads.map((thread) => (
          <Link key={thread.id} to={`/community/forum/thread/${thread.id}`}>
            <Card className="p-4 hover:bg-accent/5 transition-colors">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={thread.author?.avatar_url} />
                  <AvatarFallback>{getInitials(thread.author?.username || 'Unknown')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                    {thread.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {thread.content.replace(/<[^>]*>/g, '')}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{thread.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{thread.forum_posts?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{format(new Date(thread.created_at), 'PP')}</span>
                    </div>
                    <span>by {thread.author?.username || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

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
    </div>
  );
};

export default CategorySection;