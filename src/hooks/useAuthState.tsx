import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/profile";

export const useAuthState = () => {
  const [user, setUser] = useState<(User & Partial<Profile>) | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);

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
    if (!userId) {
      console.log("No user ID provided to fetchUserProfile");
      return null;
    }

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

      // Store the session in localStorage to persist it
      if (profile) {
        localStorage.setItem('userProfile', JSON.stringify(profile));
      }

      if (!profile.email) {
        console.log("Email missing for user, showing prompt");
        setShowEmailPrompt(true);
      }

      if (profile.username?.startsWith('user_')) {
        console.log("Username is auto-generated, showing prompt");
        setShowUsernamePrompt(true);
      }

      return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const checkUserRoles = async (userId: string) => {
    if (!userId) {
      console.log("No user ID provided to checkUserRoles");
      setIsAdmin(false);
      setIsStaff(false);
      return;
    }

    try {
      console.log("Checking roles for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin, is_staff")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Role check error:", error);
        throw error;
      }
      
      console.log("User role data:", data);
      
      if (data) {
        setIsAdmin(data.is_admin || false);
        setIsStaff(data.is_staff || false);
      }
    } catch (error) {
      console.error("Error checking user roles:", error);
      setIsAdmin(false);
      setIsStaff(false);
    }
  };

  const handleEmailSet = async () => {
    if (user?.id) {
      const profile = await fetchUserProfile(user.id);
      setUser(profile ? { ...user, ...profile } : user);
      setShowEmailPrompt(false);
    }
  };

  const handleUsernameSet = async () => {
    if (user?.id) {
      const profile = await fetchUserProfile(user.id);
      setUser(profile ? { ...user, ...profile } : user);
      setShowUsernamePrompt(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authListener: any = null;

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        
        // First check localStorage for cached profile
        const cachedProfile = localStorage.getItem('userProfile');
        const parsedProfile = cachedProfile ? JSON.parse(cachedProfile) : null;

        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session);

        if (session?.user) {
          // Use cached profile while fetching fresh data
          if (parsedProfile) {
            setUser({ ...session.user, ...parsedProfile });
          }
          
          const profile = await fetchUserProfile(session.user.id);
          if (mounted && profile) {
            setUser({ ...session.user, ...profile });
            
            const suspended = await checkSuspensionStatus(session.user.id);
            setIsSuspended(suspended);
            
            if (!suspended) {
              await checkUserRoles(session.user.id);
            } else {
              setIsAdmin(false);
              setIsStaff(false);
            }
          }
        } else {
          if (mounted) {
            setUser(null);
            localStorage.removeItem('userProfile');
          }
        }

        // Set up auth state listener
        authListener = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", { event, session });
          
          if (session?.user && mounted) {
            const profile = await fetchUserProfile(session.user.id);
            if (mounted) {
              setUser(profile ? { ...session.user, ...profile } : session.user);
              
              const suspended = await checkSuspensionStatus(session.user.id);
              setIsSuspended(suspended);
              
              if (!suspended) {
                await checkUserRoles(session.user.id);
              } else {
                setIsAdmin(false);
                setIsStaff(false);
              }
            }
          } else if (mounted) {
            setUser(null);
            setIsAdmin(false);
            setIsStaff(false);
            setIsSuspended(false);
            localStorage.removeItem('userProfile');
          }
        });

      } catch (error) {
        console.error("Error in auth initialization:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authListener && 
          authListener.subscription && 
          typeof authListener.subscription.unsubscribe === 'function') {
        try {
          authListener.subscription.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from auth state in hook:", error);
        }
      }
    };
  }, []);

  return {
    user,
    isAdmin,
    isStaff,
    loading,
    isSuspended,
    showEmailPrompt,
    showUsernamePrompt,
    handleEmailSet,
    handleUsernameSet,
  };
};
