import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useTheme } from "next-themes";
import { Pizza } from "lucide-react";
import { toast } from "sonner";
import { AuthError, AuthResponse, Session, User, AuthChangeEvent } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error checking session:", error);
      return;
    }
    if (session) {
      console.log("Active session found:", session);
      navigate("/dashboard");
    }
  };

  React.useEffect(() => {
    console.log("Login component mounted");
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log("Auth state changed - Event:", event);
      console.log("Auth state changed - Session:", session);

      switch (event) {
        case 'SIGNED_IN':
          console.log("User signed in");
          navigate("/dashboard");
          break;
        case 'SIGNED_OUT':
          console.log("User signed out");
          navigate("/login");
          break;
        case 'USER_UPDATED':
          console.log("User updated");
          break;
        case 'USER_DELETED':
          console.log("User deleted");
          navigate("/login");
          break;
        default:
          console.log("Unhandled auth event:", event);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleError = (error: AuthError) => {
    console.error("Auth error:", error);
    toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <Pizza className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Pizza Login</h1>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#ef4444',
                  brandAccent: '#dc2626',
                },
              },
            },
          }}
          theme={theme === "dark" ? "dark" : "default"}
          providers={["google"]}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default Login;