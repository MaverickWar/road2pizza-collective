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

      // Check if email is missing
      if (!profile.email) {
        console.log("Email missing for user, showing prompt");
        setShowEmailPrompt(true);
      }

      // Check if username is auto-generated
      if (profile.username.startsWith('user_')) {
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

  const handleEmailSet = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.id);
      setUser(profile ? { ...user, ...profile } : user);
      setShowEmailPrompt(false);
    }
  };

  const handleUsernameSet = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.id);
      setUser(profile ? { ...user, ...profile } : user);
      setShowUsernamePrompt(false);
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

        setLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
      }
    };

    initializeAuth();

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

    return () => {
      subscription.unsubscribe();
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