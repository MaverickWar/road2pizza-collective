import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import type { Thread } from './types';
import { Lock, Unlock, Pin, PinOff } from 'lucide-react';

const ThreadManagement = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          *,
          forum:forums(title, description),
          profiles:created_by(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setThreads(data || []);
    } catch (error) {
      console.error('Error loading threads:', error);
      toast.error('Failed to load threads');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleThreadLock = async (threadId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('forum_threads')
        .update({ is_locked: !currentStatus })
        .eq('id', threadId);

      if (error) throw error;

      setThreads(threads.map(thread => 
        thread.id === threadId 
          ? { ...thread, is_locked: !currentStatus }
          : thread
      ));

      toast.success(`Thread ${currentStatus ? 'unlocked' : 'locked'} successfully`);
    } catch (error) {
      console.error('Error toggling thread lock:', error);
      toast.error('Failed to update thread status');
    }
  };

  const toggleThreadPin = async (threadId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('forum_threads')
        .update({ is_pinned: !currentStatus })
        .eq('id', threadId);

      if (error) throw error;

      setThreads(threads.map(thread => 
        thread.id === threadId 
          ? { ...thread, is_pinned: !currentStatus }
          : thread
      ));

      toast.success(`Thread ${currentStatus ? 'unpinned' : 'pinned'} successfully`);
    } catch (error) {
      console.error('Error toggling thread pin:', error);
      toast.error('Failed to update thread status');
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <Label htmlFor="search">Search Threads</Label>
          <Input
            id="search"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Forum</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredThreads.map((thread) => (
            <TableRow key={thread.id}>
              <TableCell>{thread.title}</TableCell>
              <TableCell>{thread.forum?.title}</TableCell>
              <TableCell>{thread.profiles?.username}</TableCell>
              <TableCell>{new Date(thread.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleThreadLock(thread.id, thread.is_locked)}
                    title={thread.is_locked ? "Unlock thread" : "Lock thread"}
                  >
                    {thread.is_locked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Unlock className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleThreadPin(thread.id, thread.is_pinned)}
                    title={thread.is_pinned ? "Unpin thread" : "Pin thread"}
                  >
                    {thread.is_pinned ? (
                      <PinOff className="h-4 w-4" />
                    ) : (
                      <Pin className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ThreadManagement;