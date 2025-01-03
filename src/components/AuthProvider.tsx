import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import SuspensionNotice from "./SuspensionNotice";

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  isStaff: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isStaff: false,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);

  useEffect(() => {
    console.log("AuthProvider mounted");
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session);
        
        if (session?.user) {
          setUser(session.user);
          await checkSuspensionStatus(session.user.id);
          await checkUserRoles(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", session);
      if (session?.user) {
        setUser(session.user);
        await checkSuspensionStatus(session.user.id);
        await checkUserRoles(session.user.id);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsStaff(false);
        setIsSuspended(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSuspensionStatus = async (userId: string) => {
    try {
      console.log("Checking suspension status for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("is_suspended")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setIsSuspended(data?.is_suspended || false);
    } catch (error) {
      console.error("Error checking suspension status:", error);
      setIsSuspended(false);
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

  if (isSuspended && user) {
    return <SuspensionNotice />;
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isStaff, loading }}>
      {children}
    </AuthContext.Provider>
  );
};