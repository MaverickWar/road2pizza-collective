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
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        if (!session) {
          console.log('No session found');
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        // Validate session data
        if (!session.refresh_token || !session.expires_at) {
          console.error('Invalid session data:', { 
            hasRefreshToken: !!session.refresh_token,
            expiresAt: session.expires_at 
          });
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        // Calculate refresh timing
        const expiresAt = new Date(session.expires_at).getTime();
        const timeUntilExpiry = expiresAt - Date.now();
        const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000); // 5 minutes before expiry

        console.log('Session status:', {
          expiresAt: new Date(expiresAt).toISOString(),
          timeUntilExpiry: Math.floor(timeUntilExpiry / 1000),
          refreshTime: Math.floor(refreshTime / 1000)
        });

        // Set up refresh timer
        if (refreshTime > 0 && mounted) {
          refreshTimer = setTimeout(async () => {
            try {
              console.log('Attempting to refresh session...');
              const { data, error } = await supabase.auth.refreshSession();
              
              if (error) {
                console.error('Session refresh failed:', error);
                toast.error("Session expired. Please sign in again.");
                await supabase.auth.signOut();
                navigate('/login');
                return;
              }

              if (!data.session) {
                console.error('No session returned after refresh');
                toast.error("Session refresh failed. Please sign in again.");
                await supabase.auth.signOut();
                navigate('/login');
                return;
              }

              console.log('Session refreshed successfully:', {
                expiresAt: data.session.expires_at,
                user: data.session.user.id
              });

              if (mounted) {
                setupSessionRefresh(); // Setup next refresh cycle
              }
            } catch (error) {
              console.error('Unexpected error during session refresh:', error);
              toast.error("Session refresh failed. Please sign in again.");
              await supabase.auth.signOut();
              navigate('/login');
            }
          }, refreshTime);
        } else {
          console.log('Session requires immediate refresh');
          await supabase.auth.signOut();
          navigate('/login');
        }
      } catch (error) {
        console.error('Error in setupSessionRefresh:', error);
        await supabase.auth.signOut();
        navigate('/login');
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", { event, sessionExists: !!session });
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in, initializing session');
        if (mounted) {
          await setupSessionRefresh();
        }
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, cleaning up');
        clearTimeout(refreshTimer);
        navigate('/login');
      }
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed, updating session');
        if (mounted) {
          await setupSessionRefresh();
        }
      }
    });

    // Initial session setup
    setupSessionRefresh();

    return () => {
      console.log('Cleaning up auth provider');
      mounted = false;
      clearTimeout(refreshTimer);
      subscription.unsubscribe();
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