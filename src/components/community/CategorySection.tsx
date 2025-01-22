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
import { Plus, Settings } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ThreadItem from "./ThreadItem";

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
      is_pinned: boolean;
      is_locked: boolean;
      category_id: string;
      post_count: number;
      last_post_at: string;
      last_post_by: string;
      author?: {
        username: string;
        avatar_url?: string;
      };
      last_poster?: {
        username: string;
        avatar_url?: string;
      };
    }>;
  };
  onThreadCreated: () => void;
}

const CategorySection = ({ category, onThreadCreated }: CategorySectionProps) => {
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
      onThreadCreated();
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <h3 className="text-2xl font-bold">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-accent hover:bg-accent/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Thread
            </Button>
          )}
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Category</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete Category</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Separator className="my-4" />
        
        <div className="space-y-4">
          {category.forum_threads?.map((thread) => (
            <Link
              key={thread.id}
              to={`/community/forum/thread/${thread.id}`}
              className="block"
            >
              <ThreadItem 
                thread={{
                  ...thread,
                  is_pinned: thread.is_pinned || false,
                  is_locked: thread.is_locked || false,
                  category_id: thread.category_id || category.id,
                  post_count: thread.post_count || 0,
                  view_count: thread.view_count || 0,
                  last_post_at: thread.last_post_at || thread.created_at,
                  last_post_by: thread.last_post_by || thread.created_by
                }}
                showAdminControls={isAdmin}
                onThreadUpdate={onThreadCreated}
              />
            </Link>
          ))}

          {category.forum_threads?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No threads yet. Be the first to start a discussion!
            </p>
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