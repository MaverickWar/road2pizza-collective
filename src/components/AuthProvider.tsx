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

  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;

    const setupSessionRefresh = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session?.user?.id);
        
        if (session?.user?.id) {
          // Calculate refresh time (5 minutes before expiry)
          const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
          const refreshTime = expiresAt ? expiresAt.getTime() - Date.now() - (5 * 60 * 1000) : null;
          
          console.log("Session expires at:", expiresAt);
          console.log("Will refresh in:", refreshTime ? `${refreshTime/1000}s` : 'N/A');
          
          if (refreshTime && refreshTime > 0) {
            refreshTimer = setTimeout(async () => {
              console.log("Refreshing session...");
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
            }, refreshTime);
          } else {
            console.log("Session expired or invalid refresh time");
            await supabase.auth.signOut();
            navigate('/login');
          }
        }
      } catch (error) {
        console.error("Error setting up session refresh:", error);
      }
    };

    setupSessionRefresh();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event, "Session:", session?.user?.id);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        setupSessionRefresh();
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to login');
        clearTimeout(refreshTimer);
        localStorage.removeItem('supabase.auth.token');
        navigate('/login');
      }

      // Handle session refresh failure
      if (!session) {
        console.log('Session invalid, signing out user');
        toast.error("Your session has expired. Please sign in again.");
        await supabase.auth.signOut();
        navigate('/login');
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

  // Show loading state while initializing
  if (loading) {
    return null;
  }

  // Show suspension notice if user is suspended
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