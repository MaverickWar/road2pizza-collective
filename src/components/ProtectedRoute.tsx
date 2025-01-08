import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireStaff?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin, requireStaff }: ProtectedRouteProps) => {
  const { user, isAdmin, isStaff } = useAuth();
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

    checkSession();
  }, [navigate]);

  useEffect(() => {
    console.log("Protected Route Check:", {
      user,
      isAdmin,
      isStaff,
      requireAdmin,
      requireStaff
    });

    if (!user) {
      console.log("No user found, redirecting to login");
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }

    if (requireAdmin && !isAdmin) {
      console.log("Admin access required but user is not admin");
      toast.error("Admin access required");
      navigate("/dashboard");
      return;
    }

    if (requireStaff && !isAdmin && !isStaff) {
      console.log("Staff access required but user is not staff");
      toast.error("Staff access required");
      navigate("/dashboard");
      return;
    }
  }, [user, isAdmin, isStaff, requireAdmin, requireStaff, navigate]);

  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;