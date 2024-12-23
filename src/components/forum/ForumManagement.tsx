import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, List } from 'lucide-react';

const ForumManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Forum Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/admin/forum/categories">
          <div className="bg-card hover:bg-card-hover p-6 rounded-lg transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <List className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Manage Categories</h2>
                <p className="text-sm text-muted-foreground">
                  Create, edit, and organize forum categories
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/admin/forum/threads">
          <div className="bg-card hover:bg-card-hover p-6 rounded-lg transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Manage Threads</h2>
                <p className="text-sm text-muted-foreground">
                  Monitor and moderate forum discussions
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/admin/forum/settings">
          <div className="bg-card hover:bg-card-hover p-6 rounded-lg transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <Settings className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Forum Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Configure forum permissions and features
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ForumManagement;