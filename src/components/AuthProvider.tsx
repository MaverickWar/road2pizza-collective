import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/profile";
import SuspensionNotice from "./SuspensionNotice";

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
  const [user, setUser] = useState<(User & Partial<Profile>) | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);

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

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      
      console.log("Fetched profile:", profile);
      return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
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

      if (error) {
        console.error("Role check error:", error);
        throw error;
      }
      
      console.log("User role data:", data);
      
      if (data) {
        // Special handling for main admin account
        if (data.email === 'richgiles@hotmail.co.uk') {
          console.log("Setting admin privileges for main admin account");
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session);

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile ? { ...session.user, ...profile } : session.user);
          
          const suspended = await checkSuspensionStatus(session.user.id);
          console.log("User suspension status:", suspended);
          setIsSuspended(suspended);
          
          if (!suspended) {
            await checkUserRoles(session.user.id);
          } else {
            setIsAdmin(false);
            setIsStaff(false);
          }
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            console.log("Auth state changed:", session);
            if (session?.user) {
              const profile = await fetchUserProfile(session.user.id);
              setUser(profile ? { ...session.user, ...profile } : session.user);
              
              const suspended = await checkSuspensionStatus(session.user.id);
              setIsSuspended(suspended);
              
              if (!suspended) {
                await checkUserRoles(session.user.id);
              } else {
                setIsAdmin(false);
                setIsStaff(false);
              }
            } else {
              setUser(null);
              setIsAdmin(false);
              setIsStaff(false);
              setIsSuspended(false);
            }
          }
        );

        setLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;