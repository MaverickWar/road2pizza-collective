import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from 'lucide-react';

interface BreadcrumbData {
  label: string;
  path?: string;
}

interface ForumBreadcrumbsProps {
  items?: BreadcrumbData[];
}

const ForumBreadcrumbs = ({ items = [] }: ForumBreadcrumbsProps) => {
  const defaultItems: BreadcrumbData[] = [
    { label: 'Home', path: '/' },
    { label: 'Community', path: '/community' },
  ];

  const allItems = [...defaultItems, ...items];

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList className="text-orange-600/60 dark:text-orange-400/60">
        {allItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === 0 ? (
                <BreadcrumbLink asChild>
                  <Link to={item.path || '#'} className="hover:text-orange-600 dark:hover:text-orange-400">
                    <Home className="h-4 w-4" />
                  </Link>
                </BreadcrumbLink>
              ) : item.path ? (
                <BreadcrumbLink asChild>
                  <Link 
                    to={item.path}
                    className="hover:text-orange-600 dark:hover:text-orange-400"
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < allItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ForumBreadcrumbs;