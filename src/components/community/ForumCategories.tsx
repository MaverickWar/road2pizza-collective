import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { MessageSquare, Pin, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Editor from '@/components/Editor';

interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  forum_threads: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    is_pinned: boolean;
    is_locked: boolean;
    posts: {
      id: string;
      content: string;
      created_at: string;
    }[];
  }[];
}

const ForumCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching forum categories...');
      const { data, error } = await supabase
        .from('forum_categories')
        .select(`
          id,
          name,
          description,
          forum_threads (
            id,
            title,
            content,
            created_at,
            is_pinned,
            is_locked,
            posts (
              id,
              content,
              created_at
            )
          )
        `)
        .order('display_order');

      if (error) throw error;

      console.log('Fetched categories:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load forum categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!selectedCategoryId) {
      toast.error('Please select a category first');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('forum_threads')
        .insert([
          {
            title: newThread.title,
            content: newThread.content,
            category_id: selectedCategoryId,
            created_by: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Thread created successfully');
      setIsCreateDialogOpen(false);
      setNewThread({ title: '', content: '' });
      fetchCategories(); // Refresh the categories to show the new thread
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-textLight">Forum Categories</h2>
        {isAdmin && (
          <Button asChild variant="outline">
            <Link to="/dashboard/admin/forum">Manage Categories</Link>
          </Button>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-textLight bg-secondary rounded-lg">
          No categories available yet.
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div 
                className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
                onClick={() => setSelectedCategoryId(selectedCategoryId === category.id ? null : category.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-textLight">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-textLight/70 mt-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-textLight/70">
                    <MessageSquare className="w-4 h-4" />
                    <span>{category.forum_threads?.length || 0} threads</span>
                  </div>
                </div>
              </div>

              {/* Show threads when category is selected */}
              {selectedCategoryId === category.id && (
                <div className="ml-4 space-y-2">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-textLight">Threads</h4>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">New Thread</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Thread</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Thread Title"
                            value={newThread.title}
                            onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                          />
                          <div className="min-h-[200px]">
                            <Editor
                              content={newThread.content}
                              onChange={(content) => setNewThread({ ...newThread, content })}
                            />
                          </div>
                          <Button onClick={handleCreateThread} className="w-full">
                            Create Thread
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {category.forum_threads?.map((thread) => (
                    <Link
                      key={thread.id}
                      to={`/community/forum/thread/${thread.id}`}
                      className="block p-3 bg-background rounded-lg hover:bg-background/80 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {thread.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                            {thread.is_locked && <Lock className="w-4 h-4 text-destructive" />}
                            <h5 className="font-medium text-textLight">{thread.title}</h5>
                          </div>
                          <p className="text-sm text-textLight/70 mt-1 line-clamp-2">
                            {thread.content}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-textLight/70">
                          <MessageSquare className="w-4 h-4" />
                          <span>{thread.posts?.length || 0} replies</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumCategories;