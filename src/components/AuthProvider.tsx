
import { createContext, useContext, useEffect, useState, useCallback } from "react";
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
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isStaff: false,
  isLoading: true
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

  const [sessionChecked, setSessionChecked] = useState(false);

  const setupSessionRefresh = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session); // Debug log
      
      if (session?.user?.id) {
        const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
        const refreshTime = expiresAt ? expiresAt.getTime() - Date.now() - (5 * 60 * 1000) : null;
        
        console.log("Session details:", {
          userId: session.user.id,
          expiresAt: expiresAt?.toISOString(),
          refreshIn: refreshTime ? `${Math.round(refreshTime/1000)}s` : 'N/A'
        });
        
        if (refreshTime && refreshTime > 0) {
          return setTimeout(async () => {
            try {
              console.log("Refreshing session...");
              const { data, error } = await supabase.auth.refreshSession();
              
              if (error) {
                console.error('Session refresh failed:', error);
                toast.error("Your session has expired. Please sign in again.");
                await supabase.auth.signOut();
                navigate('/login');
              } else {
                console.log('Session refreshed successfully:', data.session?.expires_at);
                return setupSessionRefresh();
              }
            } catch (error) {
              console.error("Error during session refresh:", error);
              toast.error("Session refresh failed. Please sign in again.");
              await supabase.auth.signOut();
              navigate('/login');
            }
          }, refreshTime);
        }
      }
      return null;
    } catch (error) {
      console.error("Error setting up session refresh:", error);
      return null;
    }
  }, [navigate]);

  useEffect(() => {
    let refreshTimer: NodeJS.Timeout | null = null;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initAuth = async () => {
      try {
        console.log("Initializing auth state..."); // Debug log
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session); // Debug log
        
        if (session?.user?.id) {
          console.log("Valid session found for user:", session.user.id);
        } else {
          console.log("No valid session found");
        }

        refreshTimer = await setupSessionRefresh();
        
        authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", {
            event,
            userId: session?.user?.id,
            email: session?.user?.email
          });
          
          if (event === 'SIGNED_IN') {
            console.log('User signed in successfully:', session?.user?.id);
            if (refreshTimer) clearTimeout(refreshTimer);
            refreshTimer = await setupSessionRefresh();
          }
          
          if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed successfully');
            if (refreshTimer) clearTimeout(refreshTimer);
            refreshTimer = await setupSessionRefresh();
          }
          
          if (event === 'SIGNED_OUT') {
            console.log('User signed out, redirecting to login');
            if (refreshTimer) clearTimeout(refreshTimer);
            localStorage.removeItem('supabase.auth.token');
            navigate('/login');
            return;
          }

          if (!session && event !== 'INITIAL_SESSION') {
            console.log('Session invalid or expired, signing out user');
            toast.error("Your session has expired. Please sign in again.");
            await supabase.auth.signOut();
            navigate('/login');
            return;
          }
        }).data.subscription;

      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setSessionChecked(true);
      }
    };

    initAuth();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, [navigate, setupSessionRefresh]);

  if (loading || !sessionChecked) {
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
    <AuthContext.Provider value={{ user, isAdmin, isStaff, isLoading: loading }}>
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
