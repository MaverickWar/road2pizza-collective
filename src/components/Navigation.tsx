import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TopNav from './TopNav';
import MainNav from './MainNav';

// Create a new QueryClient instance with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 404s
        if (error?.status === 404) return false;
        // Retry up to 2 times on other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

const Navigation = () => {
  console.log('Rendering Navigation component');
  
  return (
    <QueryClientProvider client={queryClient}>
      <header className="fixed top-0 left-0 right-0 w-full z-50">
        <TopNav />
        <MainNav />
      </header>
    </QueryClientProvider>
  );
};

export default Navigation;