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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          return;
        }

        if (!session?.refresh_token || !session?.expires_at) {
          console.log('No valid session found, redirecting to login');
          navigate('/login');
          return;
        }

        // Calculate time until token needs refresh (5 minutes before expiry)
        const expiresAt = new Date(session.expires_at).getTime();
        const timeUntilExpiry = expiresAt - Date.now();
        const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000); // 5 minutes before expiry

        console.log('Session expires in:', Math.floor(timeUntilExpiry / 1000), 'seconds');
        console.log('Will refresh in:', Math.floor(refreshTime / 1000), 'seconds');

        if (refreshTime > 0 && mounted) {
          refreshTimer = setTimeout(async () => {
            try {
              const { data, error } = await supabase.auth.refreshSession();
              
              if (error) {
                console.error('Session refresh failed:', error);
                if (error.message.includes('refresh_token_not_found')) {
                  toast.error("Your session has expired. Please sign in again.");
                  await supabase.auth.signOut();
                  navigate('/login');
                  return;
                }
              } else {
                console.log('Session refreshed successfully:', data.session?.expires_at);
                setupSessionRefresh(); // Setup next refresh
              }
            } catch (error) {
              console.error('Unexpected error during session refresh:', error);
              toast.error("Session refresh failed. Please sign in again.");
              await supabase.auth.signOut();
              navigate('/login');
            }
          }, refreshTime);
        }
      } catch (error) {
        console.error('Error in setupSessionRefresh:', error);
      }
    };

    // Initial setup
    setupSessionRefresh();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        setupSessionRefresh(); // Setup next refresh after token refresh
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to login');
        clearTimeout(refreshTimer);
        localStorage.removeItem('supabase.auth.token');
        navigate('/login');
      }

      if (event === 'SIGNED_IN') {
        console.log('User signed in, setting up session refresh');
        setupSessionRefresh();
      }
    });

    return () => {
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