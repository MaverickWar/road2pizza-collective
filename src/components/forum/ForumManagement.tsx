import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, List, Users } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

const ForumManagement = () => {
  const managementCards = [
    {
      title: 'Categories',
      description: 'Create and manage forum categories',
      icon: <List className="w-6 h-6" />,
      link: '/dashboard/admin/forum/categories',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Threads',
      description: 'Monitor and moderate forum discussions',
      icon: <MessageSquare className="w-6 h-6" />,
      link: '/dashboard/admin/forum/threads',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Members',
      description: 'Manage forum members and permissions',
      icon: <Users className="w-6 h-6" />,
      link: '/dashboard/admin/forum/members',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Settings',
      description: 'Configure forum preferences and features',
      icon: <Settings className="w-6 h-6" />,
      link: '/dashboard/admin/forum/settings',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 animate-fade-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Forum Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage and moderate your community forums
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {managementCards.map((card, index) => (
            <Link 
              key={index}
              to={card.link}
              className="block group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold group-hover:text-accent transition-colors">
                        {card.title}
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ForumManagement;