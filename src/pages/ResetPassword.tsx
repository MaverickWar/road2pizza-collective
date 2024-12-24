import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pizza } from "lucide-react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  // Check if we're in a valid reset password context
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Invalid or expired reset link");
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-transparent border-2 border-accent rounded-full flex items-center justify-center mb-4">
            <Pizza className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-light text-accent tracking-wider mb-2">Road2Pizza</h1>
          <p className="text-textLight dark:text-gray-300 text-center">
            Enter your new password
          </p>
        </div>

        <div className="bg-card dark:bg-card-dark rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;