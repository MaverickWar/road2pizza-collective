import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './components/AuthProvider';
import { UnderConstruction } from './components/UnderConstruction';
import { supabase } from './integrations/supabase/client';

function App() {
  const [isUnderConstruction, setIsUnderConstruction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bypassConstruction, setBypassConstruction] = useState(false);

  useEffect(() => {
    const checkConstructionMode = async () => {
      try {
        console.log("Checking construction mode...");
        const { data, error } = await supabase
          .from('site_settings')
          .select('under_construction')
          .single();

        if (error) throw error;

        // Check for admin session
        const { data: { session } } = await supabase.auth.getSession();
        const isAdmin = session?.user?.id ? 
          (await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single()
          ).data?.is_admin : false;

        // Check for temporary access code
        const tempCode = localStorage.getItem('temp_access_code');
        const tempExpires = localStorage.getItem('temp_access_expires');
        
        const hasValidTempAccess = tempCode && tempExpires && 
          new Date(tempExpires) > new Date();

        console.log("Construction mode check:", {
          isUnderConstruction: data?.under_construction,
          isAdmin,
          hasValidTempAccess
        });

        setIsUnderConstruction(data?.under_construction || false);
        setBypassConstruction(isAdmin || hasValidTempAccess);
      } catch (error) {
        console.error('Error checking construction mode:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkConstructionMode();

    // Subscribe to changes in site settings
    const subscription = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings'
        },
        () => {
          checkConstructionMode();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return null;
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