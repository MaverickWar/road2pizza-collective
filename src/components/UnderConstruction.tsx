import { useState } from "react";
import { LoginDialog } from "./LoginDialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const UnderConstruction = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccessCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      toast.error("Please enter an access code");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Validating access code:', accessCode);
      const { data, error } = await supabase
        .from("access_codes")
        .select()
        .eq("code", accessCode.trim())
        .single();

      if (error) {
        console.error('Access code validation error:', error);
        throw error;
      }

      if (!data) {
        toast.error("Invalid access code");
        return;
      }

      if (data.is_used) {
        toast.error("This access code has already been used");
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        toast.error("This access code has expired");
        return;
      }

      console.log('Valid access code found:', data);

      // Store the valid access code in localStorage
      localStorage.setItem("temp_access_code", accessCode);
      localStorage.setItem("temp_access_expires", data.expires_at);
      
      // Refresh the page to bypass the construction mode
      window.location.reload();
    } catch (error) {
      console.error("Error validating access code:", error);
      toast.error("Failed to validate access code");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10" />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="block">Coming Soon</span>
              <span className="block mt-2 bg-gradient-to-r from-[#FFB168] to-[#FF6B6B] text-transparent bg-clip-text">
                Something Amazing
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              We're working hard to bring you an incredible pizza-making experience. 
              Stay tuned for our launch!
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-md space-y-4">
              <form onSubmit={handleAccessCode} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#FF6B6B] to-[#FFB168] hover:from-[#FF8B8B] hover:to-[#FFCF98] text-white font-semibold"
                >
                  Access Site
                </Button>
              </form>
              
              <div className="text-center">
                <span className="text-gray-400">or</span>
              </div>

              <Button
                onClick={() => setShowLogin(true)}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Sign In
              </Button>
            </div>

            <p className="text-sm text-gray-400">
              Need an access code? Contact the administrator.
            </p>
          </div>
        </div>
      </div>

      <LoginDialog isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};