import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TopNav from './TopNav';
import MainNav from './MainNav';

// Create a new QueryClient instance outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
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