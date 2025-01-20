import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SuspensionNotice from "./SuspensionNotice";
import EmailPromptDialog from "./EmailPromptDialog";
import UsernamePromptDialog from "./UsernamePromptDialog";
import { useAuthState } from "@/hooks/useAuthState";

type AuthContextType = {
  user: (User & Partial<Profile>) | null;
  isAdmin: boolean;
  isStaff: boolean;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  isAdmin: false,
  isStaff: false 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const {
    user,
    isAdmin,
    isStaff,
    loading,
    isSuspended,
    showEmailPrompt,
    showUsernamePrompt,
    handleEmailSet,
    handleUsernameSet,
  } = useAuthState();

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthProvider] Auth state change:", { 
        event, 
        sessionExists: !!session,
        sessionUser: session?.user?.id,
        currentPath: window.location.pathname
      });
      
      if (event === 'SIGNED_OUT') {
        console.log('[AuthProvider] User signed out, redirecting to login');
        navigate('/login');
      }

      if (event === 'SIGNED_IN') {
        console.log('[AuthProvider] User signed in:', {
          userId: session?.user?.id,
          email: session?.user?.email,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Initial session check
    const checkSession = async () => {
      try {
        console.log('[AuthProvider] Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthProvider] Session check error:', {
            error,
            errorMessage: error.message,
            timestamp: new Date().toISOString()
          });
          navigate('/login');
          return;
        }

        if (!session) {
          console.log('[AuthProvider] No active session found');
          navigate('/login');
          return;
        }

        console.log('[AuthProvider] Valid session found:', {
          userId: session.user.id,
          email: session.user.email,
          expiresAt: session.expires_at,
          currentPath: window.location.pathname
        });
      } catch (error) {
        console.error('[AuthProvider] Unexpected error checking session:', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        });
        navigate('/login');
      }
    };

    checkSession();

    return () => {
      console.log('[AuthProvider] Cleaning up auth provider');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  console.log("[AuthProvider] Current state:", { 
    user, 
    isAdmin, 
    isStaff, 
    loading, 
    isSuspended,
    showEmailPrompt,
    showUsernamePrompt,
    currentPath: window.location.pathname,
    timestamp: new Date().toISOString()
  });

  if (loading) {
    console.log('[AuthProvider] Still loading auth state...');
    return null;
  }

  if (isSuspended && user) {
    console.log('[AuthProvider] User is suspended:', { userId: user.id });
    return (
      <div className="min-h-screen bg-background">
        <SuspensionNotice />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isStaff }}>
      {showEmailPrompt && user ? (
        <EmailPromptDialog
          open={showEmailPrompt}
          userId={user.id}
          onEmailSet={handleEmailSet}
        />
      ) : null}
      {showUsernamePrompt && user ? (
        <UsernamePromptDialog
          open={showUsernamePrompt}
          userId={user.id}
          currentUsername={user.username || ''}
          onUsernameSet={handleUsernameSet}
        />
      ) : null}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;