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
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side gradient */}
          <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-admin via-admin-secondary to-admin text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4 animate-fade-in">Road2Pizza</h2>
              <p className="text-lg opacity-90 leading-relaxed animate-fade-in delay-100">
                Join our community of pizza enthusiasts and start sharing your culinary creations today.
              </p>
            </div>
          </div>

          {/* Right side login form */}
          <div className="bg-white p-12 rounded-l-none rounded-r-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-gray-50/30"></div>
            <div className="relative z-10 space-y-8">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-admin to-admin-secondary bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-base text-muted-foreground">
                  Please enter your credentials to continue
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-6">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-admin" />
                    <Input
                      {...form.register("email")}
                      placeholder="Email"
                      className="pl-12 py-6 bg-gray-50/50 border-gray-100 text-lg rounded-xl transition-all duration-200 hover:border-admin/50 focus:border-admin focus:ring-2 focus:ring-admin/20"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-admin" />
                    <Input
                      {...form.register("password")}
                      type="password"
                      placeholder="Password"
                      className="pl-12 py-6 bg-gray-50/50 border-gray-100 text-lg rounded-xl transition-all duration-200 hover:border-admin/50 focus:border-admin focus:ring-2 focus:ring-admin/20"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg bg-gradient-to-r from-admin to-admin-secondary hover:from-admin-hover-DEFAULT hover:to-admin-hover-secondary text-white transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl relative overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  <span className="relative z-10">
                    {isLoading ? "Signing in..." : "Sign In"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-base text-center w-full text-muted-foreground hover:text-admin transition-colors relative group"
                >
                  Forgot your password?
                  <span className="absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-admin transition-all duration-300 group-hover:w-32 -translate-x-1/2"></span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};