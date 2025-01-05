import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Pizza } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current session:", session);
      if (error) {
        console.error("Session check error:", error);
      }
      if (session) {
        navigate("/");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (session) {
        navigate("/");
      }
      if (event === 'USER_DELETED') {
        toast.error("Account has been deleted");
      }
      if (event === 'PASSWORD_RECOVERY') {
        toast.info("Password recovery email sent");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-transparent border-2 border-accent rounded-full flex items-center justify-center mb-4">
            <Pizza className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-light text-accent tracking-wider mb-2">Road2Pizza</h1>
          <p className="text-textLight dark:text-gray-300 text-center">
            Join our community of pizza enthusiasts
          </p>
        </div>

        {/* Auth Container */}
        <div className="bg-card dark:bg-card-dark rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#E86565',
                    brandAccent: '#D45555',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#FFE4E7',
                    defaultButtonBackgroundHover: '#FFD1D6',
                    defaultButtonText: '#2D2B2F',
                    inputBackground: 'transparent',
                    inputBorder: '#E1E1E1',
                    inputBorderHover: '#E86565',
                    inputBorderFocus: '#E86565',
                  },
                  fonts: {
                    bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
                    buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
                    inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
                    labelFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full px-4 py-2 rounded-lg font-medium transition-colors',
                input: 'w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-colors dark:bg-secondary-dark dark:border-gray-700',
                label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
                message: 'text-sm text-red-500 dark:text-red-400',
              },
            }}
            providers={[]}
            onError={(error) => {
              console.error("Auth error:", error);
              toast.error(error.message || "An error occurred during authentication");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;