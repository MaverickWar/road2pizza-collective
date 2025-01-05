import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session);
      
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user);
          navigate('/dashboard');
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          navigate('/login');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token was refreshed:', session?.user);
          break;
        case 'USER_UPDATED':
          console.log('User was updated:', session?.user);
          break;
        default:
          console.log('Unhandled auth event:', event);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </div>
    </div>
  );
}