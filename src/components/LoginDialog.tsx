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
      console.log('Fetching featured recipes for login dialog...');
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
        .eq('status', 'published')
        .eq('approval_status', 'approved')
        .limit(5);

      if (error) {
        console.error('Error fetching featured recipes:', error);
        throw error;
      }
      
      console.log('Successfully fetched featured recipes:', data);
      return data || [];
    },
  });

  // Auto-rotate featured recipes every 5 seconds
  useEffect(() => {
    if (featuredRecipes.length > 0) {
      const interval = setInterval(() => {
        setCurrentRecipeIndex((prev) => 
          prev === featuredRecipes.length - 1 ? 0 : prev + 1
        );
      }, 5000);
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
          {/* Left side with dynamic recipe showcase - Hidden on mobile */}
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
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                    {currentRecipe.title}
                  </h3>
                  <p className="text-sm mb-2 bg-gradient-to-r from-[#F97316] to-[#FEC6A1] text-transparent bg-clip-text font-medium">
                    By {currentRecipe.profiles?.username || currentRecipe.author}
                  </p>
                  <Link 
                    to={`/recipe/${currentRecipe.id}`}
                    className="inline-flex items-center gap-2 text-sm text-white font-bold hover:text-[#F97316] transition-colors"
                    onClick={onClose}
                  >
                    <span>View Recipe</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile-only recipe showcase header */}
          <div className="md:hidden relative h-48 overflow-hidden">
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
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                    {currentRecipe.title}
                  </h3>
                  <p className="text-sm mb-1 bg-gradient-to-r from-[#F97316] to-[#FEC6A1] text-transparent bg-clip-text font-medium">
                    By {currentRecipe.profiles?.username || currentRecipe.author}
                  </p>
                  <Link 
                    to={`/recipe/${currentRecipe.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-white font-bold hover:text-[#F97316] transition-colors"
                    onClick={onClose}
                  >
                    <span>View Recipe</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Right side form */}
          <div className="bg-white p-6 md:p-12 rounded-l-none rounded-r-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-gray-50/30" />
            <div className="relative z-10 space-y-6 md:space-y-8">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  {showForgotPassword ? "Reset Password" : (isSignUp ? "Create Account" : "Welcome Back")}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
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
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={handleForgotPasswordClick}
                        className="text-base text-muted-foreground hover:text-admin transition-colors relative group"
                      >
                        Forgot your password?
                      </button>
                      <span className="text-gray-300">|</span>
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
                  )}

                  {showForgotPassword && (
                    <div className="flex items-center justify-center space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setIsSignUp(true);
                        }}
                        className="text-base text-muted-foreground hover:text-admin transition-colors"
                      >
                        Create Account
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setIsSignUp(false);
                        }}
                        className="text-base font-medium text-admin hover:text-admin-hover-DEFAULT transition-colors"
                      >
                        Sign In Instead
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};