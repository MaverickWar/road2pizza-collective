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
  const { user, isAdmin, isStaff } = useAuth();
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

    if (requireStaff && !isAdmin && !isStaff) {
      toast.error("Staff access required");
      navigate("/dashboard");
      return;
    }
  }, [user, isAdmin, isStaff, requireAdmin, requireStaff, navigate]);

  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;