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
import { queryClient } from "@/config/queryClient";

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
    let refreshTimer: NodeJS.Timeout;
    let mounted = true;

    const setupSessionRefresh = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session fetch error:", sessionError);
          throw sessionError;
        }

        if (session && mounted) {
          const expiresIn = new Date(session.expires_at || 0).getTime() - Date.now() - 5 * 60 * 1000;
          
          if (expiresIn > 0) {
            console.log("Setting up session refresh timer for:", new Date(Date.now() + expiresIn));
            refreshTimer = setTimeout(async () => {
              try {
                const { data, error } = await supabase.auth.refreshSession();
                if (error) throw error;
                
                console.log("Session refreshed successfully:", data.session?.expires_at);
                if (mounted) setupSessionRefresh(); // Setup next refresh
              } catch (error) {
                console.error("Session refresh failed:", error);
                toast.error("Your session has expired. Please sign in again.");
                await supabase.auth.signOut();
                queryClient.clear();
                navigate('/login');
              }
            }, expiresIn);
          } else {
            console.log("Token needs immediate refresh");
            const { error } = await supabase.auth.refreshSession();
            if (error) throw error;
          }
        }
      } catch (error) {
        console.error("Session setup error:", error);
        if (mounted) {
          toast.error("Session error. Please sign in again.");
          await supabase.auth.signOut();
          queryClient.clear();
          navigate('/login');
        }
      }
    };

    setupSessionRefresh();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        if (mounted) setupSessionRefresh();
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to login');
        clearTimeout(refreshTimer);
        queryClient.clear();
        localStorage.removeItem('supabase.auth.token');
        navigate('/login');
      }

      if (event === 'SIGNED_IN') {
        console.log('User signed in, setting up session');
        if (mounted) setupSessionRefresh();
      }
    });

    window.addEventListener('supabase.auth.error', (event: any) => {
      if (event.detail?.error?.message?.includes('refresh_token_not_found')) {
        console.log('Invalid refresh token, signing out user');
        toast.error("Your session has expired. Please sign in again.");
        supabase.auth.signOut().then(() => {
          queryClient.clear();
          navigate('/login');
        });
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