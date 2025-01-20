import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LoadingScreen from "./LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireStaff?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin, requireStaff }: ProtectedRouteProps) => {
  const { user, isAdmin, isStaff, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return;
        }

        if (!session) {
          console.log("No active session found");
          toast.error("Please login to access this page");
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("Unexpected error checking session:", error);
        navigate("/login");
      }
    };

    // Only check session if we're done loading and there's no user
    if (!isLoading && !user) {
      checkSession();
    }
  }, [navigate, user, isLoading]);

  useEffect(() => {
    console.log("Protected Route Check:", {
      user,
      isAdmin,
      isStaff,
      requireAdmin,
      requireStaff,
      isLoading
    });

    // Only perform checks after loading is complete
    if (!isLoading) {
      if (requireAdmin && !isAdmin && user) {
        console.log("Admin access required but user is not admin");
        toast.error("Admin access required");
        navigate("/");
        return;
      }

      if (requireStaff && !isAdmin && !isStaff && user) {
        console.log("Staff access required but user is not staff");
        toast.error("Staff access required");
        navigate("/");
        return;
      }
    }
  }, [user, isAdmin, isStaff, requireAdmin, requireStaff, navigate, isLoading]);

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Additional role-based checks
  if (requireAdmin && !isAdmin) {
    return null; // Will redirect in useEffect
  }

  if (requireStaff && !isAdmin && !isStaff) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;