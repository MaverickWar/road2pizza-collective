import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, List } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const ForumManagement = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Forum Management</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <Link 
            to="/dashboard/admin/forum/categories"
            className="block bg-card hover:bg-card-hover rounded-lg transition-colors duration-200"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-secondary rounded-lg">
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

          <Link 
            to="/dashboard/admin/forum/threads"
            className="block bg-card hover:bg-card-hover rounded-lg transition-colors duration-200"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-secondary rounded-lg">
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

          <Link 
            to="/dashboard/admin/forum/settings"
            className="block bg-card hover:bg-card-hover rounded-lg transition-colors duration-200"
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-secondary rounded-lg">
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
    </DashboardLayout>
  );
};

export default ForumManagement;