import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import SuspensionNotice from "./SuspensionNotice";

type AuthContextType = {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      handleSessionChange(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      handleSessionChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSessionChange = async (session: Session | null) => {
    setLoading(true);
    try {
      if (session?.user) {
        setUser(session.user);
        // First check suspension status
        const suspended = await checkSuspensionStatus(session.user.id);
        console.log("User suspension status:", suspended);
        setIsSuspended(suspended);
        
        // Only check roles if user is not suspended
        if (!suspended) {
          await checkUserRoles(session.user.id);
        } else {
          // Reset roles if user is suspended
          setIsAdmin(false);
          setIsStaff(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsStaff(false);
        setIsSuspended(false);
      }
    } catch (error) {
      console.error("Error handling session change:", error);
      // Reset everything on error
      setUser(null);
      setIsAdmin(false);
      setIsStaff(false);
      setIsSuspended(false);
    } finally {
      setLoading(false);
    }
  };

  const checkSuspensionStatus = async (userId: string) => {
    try {
      console.log("Checking suspension status for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("is_suspended")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Suspension check error:", error);
        return false;
      }

      console.log("Suspension check data:", data);
      return data?.is_suspended || false;
    } catch (error) {
      console.error("Error checking suspension status:", error);
      return false;
    }
  };

  const checkUserRoles = async (userId: string) => {
    try {
      console.log("Checking roles for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin, is_staff, email")
        .eq("id", userId)
        .single();

      if (error) throw error;
      
      if (data) {
        // Special handling for main admin account
        if (data.email === 'richgiles@hotmail.co.uk') {
          setIsAdmin(true);
          setIsStaff(true);
        } else {
          setIsAdmin(data.is_admin || false);
          setIsStaff(data.is_staff || false);
        }
      }
    } catch (error) {
      console.error("Error checking user roles:", error);
      setIsAdmin(false);
      setIsStaff(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If user is suspended, show suspension notice without any navigation
  if (isSuspended && user) {
    return (
      <div className="min-h-screen bg-background">
        <SuspensionNotice />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
};