import { useState, useEffect } from "react";
import { Mail, Lock, User, ExternalLink } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useLogin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, type LoginFormValues } from "@/types/auth";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginDialog = ({ isOpen, onClose }: LoginDialogProps) => {
  const { handleLogin, handleForgotPassword, isLoading } = useLogin();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [email, setEmail] = useState("");
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Fetch featured recipes with author information
  const { data: featuredRecipes = [] } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          id,
          title,
          image_url,
          author,
          created_by,
          profiles:profiles!recipes_created_by_fkey (
            username,
            avatar_url
          )
        `)
        .eq('is_featured', true)
        .limit(5);

      if (error) throw error;
      return data || [];
    },
  });

  // Auto-rotate featured recipes every 3 seconds
  useEffect(() => {
    if (featuredRecipes.length > 0) {
      const interval = setInterval(() => {
        setCurrentRecipeIndex((prev) => 
          prev === featuredRecipes.length - 1 ? 0 : prev + 1
        );
      }, 3000); // Changed to 3000ms (3 seconds)
      return () => clearInterval(interval);
    }
  }, [featuredRecipes]);

  const currentRecipe = featuredRecipes[currentRecipeIndex];

  const onSubmit = async (values: LoginFormValues) => {
    if (showForgotPassword) {
      await handleForgotPassword(values.email);
      setShowForgotPassword(false);
      return;
    }
    await handleLogin(values);
    onClose();
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    form.setValue("email", email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm animate-fade-up border-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side with dynamic recipe showcase */}
          <div className="hidden md:block relative overflow-hidden">
            {currentRecipe && (
              <>
                <div className="absolute inset-0 transition-transform duration-700 ease-out">
                  <img 
                    src={currentRecipe.image_url || '/placeholder.svg'} 
                    alt={currentRecipe.title}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
                </div>
                
                {/* Recipe info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                    {currentRecipe.title}
                  </h3>
                  <p className="text-sm mb-2 bg-gradient-to-r from-[#F97316] to-[#FEC6A1] text-transparent bg-clip-text font-medium">
                    By {currentRecipe.profiles?.username || currentRecipe.author}
                  </p>
                  <Link 
                    to={`/recipe/${currentRecipe.id}`}
                    className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
                    onClick={onClose}
                  >
                    <span>View Recipe</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Right side form */}
          <div className="bg-white p-12 rounded-l-none rounded-r-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-gray-50/30" />
            <div className="relative z-10 space-y-8">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-3xl font-semibold tracking-tight">
                  {showForgotPassword ? "Reset Password" : (isSignUp ? "Create Account" : "Welcome Back")}
                </h2>
                <p className="text-base text-muted-foreground">
                  {showForgotPassword 
                    ? "Enter your email to reset your password" 
                    : (isSignUp ? "Fill in your details below" : "Please enter your credentials")}
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  {isSignUp && (
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-admin" />
                      <Input
                        placeholder="Username"
                        className="pl-12 py-6 bg-gray-50/50 border-gray-100 text-lg rounded-xl transition-all duration-200 hover:border-admin/50 focus:border-admin focus:ring-2 focus:ring-admin/20"
                      />
                    </div>
                  )}
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-admin" />
                    <Input
                      {...form.register("email")}
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 py-6 bg-gray-50/50 border-gray-100 text-lg rounded-xl transition-all duration-200 hover:border-admin/50 focus:border-admin focus:ring-2 focus:ring-admin/20"
                    />
                  </div>
                  {!showForgotPassword && (
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-admin" />
                      <Input
                        {...form.register("password")}
                        type="password"
                        placeholder="Password"
                        className="pl-12 py-6 bg-gray-50/50 border-gray-100 text-lg rounded-xl transition-all duration-200 hover:border-admin/50 focus:border-admin focus:ring-2 focus:ring-admin/20"
                      />
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className={cn(
                    "w-full py-6 text-lg bg-gradient-to-r text-white transition-all duration-300",
                    "shadow-lg hover:shadow-xl rounded-xl relative overflow-hidden hover:scale-[1.02] active:scale-[0.98]",
                    "from-admin to-admin-secondary hover:from-admin-hover-DEFAULT hover:to-admin-hover-secondary"
                  )}
                  disabled={isLoading}
                >
                  <span className="relative z-10">
                    {isLoading 
                      ? "Please wait..." 
                      : (showForgotPassword 
                          ? "Send Reset Link"
                          : (isSignUp ? "Create Account" : "Sign In"))}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>

                <div className="space-y-4 text-center">
                  {!showForgotPassword && (
                    <button
                      type="button"
                      onClick={handleForgotPasswordClick}
                      className="text-base text-muted-foreground hover:text-admin transition-colors relative group"
                    >
                      Forgot your password?
                      <span className="absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-admin transition-all duration-300 group-hover:w-32 -translate-x-1/2" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setIsSignUp(!isSignUp);
                    }}
                    className="text-base font-medium text-admin hover:text-admin-hover-DEFAULT transition-colors"
                  >
                    {isSignUp ? "Sign In Instead" : "Create an Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
