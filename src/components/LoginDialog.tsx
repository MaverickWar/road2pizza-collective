import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useLogin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, type LoginFormValues } from "@/types/auth";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginDialog = ({ isOpen, onClose }: LoginDialogProps) => {
  const { handleLogin, isLoading } = useLogin();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await handleLogin(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-gradient-to-r from-admin to-admin-secondary/50 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side gradient */}
          <div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-admin to-admin-secondary text-white">
            <h2 className="text-3xl font-bold mb-2">Road2Pizza</h2>
            <p className="text-sm opacity-90">Join our community of pizza enthusiasts</p>
          </div>

          {/* Right side login form */}
          <div className="bg-white p-8 rounded-l-none rounded-r-lg">
            <div className="space-y-6">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-semibold tracking-tight">Hello, Welcome</h2>
                <p className="text-sm text-muted-foreground">
                  Please enter your credentials to continue
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...form.register("email")}
                      placeholder="Email"
                      className="pl-10 bg-gray-50/50 border-gray-100"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...form.register("password")}
                      type="password"
                      placeholder="Password"
                      className="pl-10 bg-gray-50/50 border-gray-100"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-admin to-admin-secondary hover:from-admin-hover-DEFAULT hover:to-admin-hover-secondary text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-center w-full text-muted-foreground hover:text-admin transition-colors"
                >
                  Forgot your password?
                </button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};