import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './components/AuthProvider';
import { UnderConstruction } from './components/UnderConstruction';
import { supabase } from './integrations/supabase/client';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isUnderConstruction, setIsUnderConstruction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bypassConstruction, setBypassConstruction] = useState(false);

  useEffect(() => {
    const checkConstructionMode = async () => {
      try {
        console.log('Checking construction mode...');
        const { data, error } = await supabase
          .from('site_settings')
          .select('under_construction')
          .single();

        if (error) {
          console.error('Error fetching site settings:', error);
          throw error;
        }

        console.log('Site settings data:', data);

        // Check for temporary access code
        const tempCode = localStorage.getItem('temp_access_code');
        const tempExpires = localStorage.getItem('temp_access_expires');
        
        const hasValidTempAccess = tempCode && tempExpires && 
          new Date(tempExpires) > new Date();

        console.log('Access code check:', {
          hasCode: !!tempCode,
          hasExpiry: !!tempExpires,
          isValid: hasValidTempAccess
        });

        setIsUnderConstruction(data?.under_construction || false);
        setBypassConstruction(hasValidTempAccess);
      } catch (error) {
        console.error('Error checking construction mode:', error);
        // Default to non-construction mode on error
        setIsUnderConstruction(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConstructionMode();
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  if (isUnderConstruction && !bypassConstruction) {
    return (
      <ThemeProvider>
        <AuthProvider>
          <UnderConstruction />
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;