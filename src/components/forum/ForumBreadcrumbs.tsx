import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  // Default items for the forum section
  const defaultItems: BreadcrumbData[] = [
    { label: 'Home', path: '/' },
    { label: 'Community', path: '/community' },
  ];

  const allItems = [...defaultItems, ...items];

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {allItems.map((item, index) => (
          <BreadcrumbItem key={index}>
            {index === 0 ? (
              <BreadcrumbLink asChild>
                <Link to={item.path || '#'}>
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbLink>
            ) : item.path ? (
              <BreadcrumbLink asChild>
                <Link to={item.path}>{item.label}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
            {index < allItems.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default ForumBreadcrumbs;