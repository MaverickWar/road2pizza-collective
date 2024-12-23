import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard mount - User:", user);
    console.log("Dashboard mount - Is Admin:", isAdmin);
    console.log("Dashboard mount - Is Staff:", isStaff);

    if (!user) {
      navigate("/login");
      return;
    }

    if (isAdmin) {
      navigate("/dashboard/admin");
    } else if (isStaff) {
      navigate("/dashboard/staff");
    } else {
      navigate("/dashboard/member");
    }
  }, [user, isAdmin, isStaff, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default Dashboard;