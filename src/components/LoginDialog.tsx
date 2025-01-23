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
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 bg-gradient-to-r from-admin to-admin-secondary/50 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side gradient */}
          <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-admin to-admin-secondary text-white">
            <h2 className="text-4xl font-bold mb-4">Road2Pizza</h2>
            <p className="text-lg opacity-90">Join our community of pizza enthusiasts and start sharing your culinary creations today.</p>
          </div>

          {/* Right side login form */}
          <div className="bg-white p-12 rounded-l-none rounded-r-lg">
            <div className="space-y-8">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-3xl font-semibold tracking-tight">Welcome Back</h2>
                <p className="text-base text-muted-foreground">
                  Please enter your credentials to continue
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-6">
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...form.register("email")}
                      placeholder="Email"
                      className="pl-12 py-6 bg-gray-50/50 border-gray-100 text-lg"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...form.register("password")}
                      type="password"
                      placeholder="Password"
                      className="pl-12 py-6 bg-gray-50/50 border-gray-100 text-lg"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg bg-gradient-to-r from-admin to-admin-secondary hover:from-admin-hover-DEFAULT hover:to-admin-hover-secondary text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-base text-center w-full text-muted-foreground hover:text-admin transition-colors"
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