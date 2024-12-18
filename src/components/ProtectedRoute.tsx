import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireStaff?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin, requireStaff }: ProtectedRouteProps) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }

    if (requireAdmin && !isAdmin) {
      toast.error("Admin access required");
      navigate("/dashboard");
      return;
    }

    // Add staff check when implemented
    if (requireStaff && !isAdmin /* && !isStaff */) {
      toast.error("Staff access required");
      navigate("/dashboard");
      return;
    }
  }, [user, isAdmin, requireAdmin, requireStaff, navigate]);

  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;