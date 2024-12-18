import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin, is_staff")
          .eq("id", user.id)
          .single();

        if (profile?.is_admin) {
          navigate("/dashboard/admin");
        } else if (profile?.is_staff) {
          navigate("/dashboard/staff");
        } else {
          navigate("/dashboard/member");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/dashboard/member");
      }
    };

    checkUserRole();
  }, [user, isAdmin, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default Dashboard;