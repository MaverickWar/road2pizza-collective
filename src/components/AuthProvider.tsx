import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

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

  useEffect(() => {
    console.log("AuthProvider mounted");
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Error getting initial session:", sessionError);
          return;
        }
        console.log("Initial session check:", session);
        await handleSessionChange(session);
      } catch (error) {
        console.error("Error during auth initialization:", error);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", session);
      await handleSessionChange(session);
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const handleSessionChange = async (session: Session | null) => {
    setLoading(true);
    try {
      if (session?.user) {
        setUser(session.user);
        await checkUserRoles(session.user.id);
      } else {
        console.log("No session, clearing user state");
        setUser(null);
        setIsAdmin(false);
        setIsStaff(false);
      }
    } catch (error) {
      console.error("Error handling session change:", error);
    } finally {
      setLoading(false);
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

      console.log("User roles data:", data);
      console.log("User roles error:", error);

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
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
};