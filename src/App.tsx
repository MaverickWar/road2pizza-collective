import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/AuthProvider';
import { Toaster } from './components/ui/toaster';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AppRoutes />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;