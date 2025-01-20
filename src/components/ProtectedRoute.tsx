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
    };

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
    if (!isLoading && user) {
      if (requireAdmin && !isAdmin) {
        console.log("Admin access required but user is not admin");
        toast.error("Admin access required");
        navigate("/");
        return;
      }

      if (requireStaff && !isAdmin && !isStaff) {
        console.log("Staff access required but user is not staff");
        toast.error("Staff access required");
        navigate("/");
        return;
      }
    }
  }, [user, isAdmin, isStaff, requireAdmin, requireStaff, navigate, isLoading]);

  // Show loading screen while checking auth state
  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;