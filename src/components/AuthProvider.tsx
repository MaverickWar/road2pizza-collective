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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, redirecting to login');
        navigate('/login');
      }

      // Handle refresh token errors
      if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        console.log('Session ended, clearing local storage');
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

  // Return null while loading to prevent flash of content
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