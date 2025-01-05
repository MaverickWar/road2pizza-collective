import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_suspended) {
          toast({
            title: "Account Suspended",
            description: "Your account has been suspended. Please contact support.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return;
        }

        navigate('/dashboard');
      }

      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in');
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          navigate('/login');
          break;
        case 'USER_UPDATED':
          console.log('User updated');
          break;
        case 'USER_DELETED':
          console.log('User deleted');
          navigate('/login');
          break;
        default:
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center">Welcome Back</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default Login;