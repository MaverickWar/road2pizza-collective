import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      console.log("Attempting login with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      console.log("Login successful:", data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // More specific error messages based on the error type
      if (error.message === "Invalid login credentials") {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.message.includes("email")) {
        toast.error("Please enter a valid email address");
      } else {
        toast.error("Failed to log in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              className="text-sm"
              onClick={() => navigate("/reset-password")}
              disabled={isLoading}
            >
              Forgot your password?
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;