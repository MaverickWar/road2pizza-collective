import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Editor from "@/components/Editor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

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
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>
        {user && (
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-accent hover:bg-accent/90"
          >
            New Thread
          </Button>
        )}
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
    </Card>
  );
};

export default CategorySection;