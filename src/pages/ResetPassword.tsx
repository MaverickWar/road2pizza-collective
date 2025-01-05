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
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting to update password...");

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error("Password update error:", error);
        toast.error(error.message || "Failed to update password");
        return;
      }

      console.log("Password updated successfully:", data);
      toast.success("Password updated successfully! Please log in with your new password.");
      
      // Sign out the user after successful password reset
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      console.error("Unexpected error during password update:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if we're in a valid reset password context
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No valid session found");
          toast.error("Invalid or expired reset link. Please request a new password reset.");
          navigate("/login");
          return;
        }
        
        console.log("Valid session found");
        setSessionChecked(true);
      } catch (error) {
        console.error("Session check error:", error);
        toast.error("Failed to verify reset session");
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

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
                disabled={loading}
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