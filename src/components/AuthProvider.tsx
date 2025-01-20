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
  isLoading: boolean; // Added isLoading to the type
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  isAdmin: false,
  isStaff: false,
  isLoading: true // Added default value
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

    const setupSessionRefresh = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        // Calculate time until token needs refresh (5 minutes before expiry)
        const expiresIn = new Date(session.expires_at || 0).getTime() - Date.now() - 5 * 60 * 1000;
        
        if (expiresIn > 0) {
          refreshTimer = setTimeout(async () => {
            const { data, error } = await supabase.auth.refreshSession();
            if (error) {
              console.error('Session refresh failed:', error);
              toast.error("Your session has expired. Please sign in again.");
              await supabase.auth.signOut();
              navigate('/login');
            } else {
              console.log('Session refreshed successfully:', data.session?.expires_at);
              setupSessionRefresh(); // Setup next refresh
            }
          }, expiresIn);
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
        setupSessionRefresh(); // Setup next refresh after token refresh
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to login');
        clearTimeout(refreshTimer);
        localStorage.removeItem('supabase.auth.token');
        navigate('/login');
      }
    });

    // Handle refresh token errors globally
    window.addEventListener('supabase.auth.error', (event: any) => {
      if (event.detail?.error?.message?.includes('refresh_token_not_found')) {
        console.log('Invalid refresh token, signing out user');
        toast.error("Your session has expired. Please sign in again.");
        supabase.auth.signOut().then(() => {
          navigate('/login');
        });
      }
    });

    return () => {
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
