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
    let refreshTimer: NodeJS.Timeout;

    const setupSessionRefresh = async () => {
      try {
        // Clear any existing session data
        localStorage.removeItem('supabase.auth.token');
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          navigate('/login');
          return;
        }

        if (!session) {
          console.log('No session found, redirecting to login');
          navigate('/login');
          return;
        }

        // Store the new session
        localStorage.setItem('supabase.auth.token', JSON.stringify(session));

        // Calculate refresh time (5 minutes before expiry)
        const expiresAt = session.expires_at ? new Date(session.expires_at).getTime() : 0;
        const timeUntilExpiry = expiresAt - Date.now();
        const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);

        console.log('Session management:', {
          expiresAt: new Date(expiresAt).toISOString(),
          timeUntilExpiry: Math.floor(timeUntilExpiry / 1000),
          refreshTime: Math.floor(refreshTime / 1000),
          hasRefreshToken: !!session.refresh_token
        });

        if (refreshTime > 0 && mounted && session.refresh_token) {
          refreshTimer = setTimeout(async () => {
            try {
              const { data, error } = await supabase.auth.refreshSession();
              
              if (error) {
                console.error('Session refresh failed:', error);
                toast.error("Session expired. Please sign in again.");
                await supabase.auth.signOut();
                navigate('/login');
                return;
              }

              console.log('Session refreshed successfully:', data.session?.expires_at);
              if (mounted) {
                setupSessionRefresh(); // Setup next refresh
              }
            } catch (error) {
              console.error('Unexpected error during session refresh:', error);
              toast.error("Session refresh failed. Please sign in again.");
              await supabase.auth.signOut();
              navigate('/login');
            }
          }, refreshTime);
        } else {
          console.log('Session requires immediate refresh or is invalid');
          await supabase.auth.signOut();
          navigate('/login');
        }
      } catch (error) {
        console.error('Error in setupSessionRefresh:', error);
        navigate('/login');
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        if (mounted) {
          setupSessionRefresh();
        }
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, cleaning up');
        clearTimeout(refreshTimer);
        localStorage.removeItem('supabase.auth.token');
        navigate('/login');
      }

      if (event === 'SIGNED_IN') {
        console.log('User signed in, setting up session');
        if (mounted) {
          setupSessionRefresh();
        }
      }
    });

    // Initial setup
    setupSessionRefresh();

    return () => {
      console.log('Cleaning up auth provider');
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(refreshTimer);
    };
  }, [navigate]);

  console.log("AuthProvider state:", { 
    user, 
    isAdmin, 
    isStaff, 
    loading, 
    isSuspended,
    showEmailPrompt,
    showUsernamePrompt
  });

  if (loading) {
    return null;
  }

  if (isSuspended && user) {
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