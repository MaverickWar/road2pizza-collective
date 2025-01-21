import { Suspense, useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { SidebarProvider } from "@/components/ui/sidebar/SidebarContext";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "./AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    console.log("DashboardLayout state change:", {
      path: location.pathname,
      user: !!user,
      isAdmin,
      isLoading,
      isTransitioning
    });
  }, [location.pathname, user, isAdmin, isLoading, isTransitioning]);

  useEffect(() => {
    let mounted = true;

    const validateAccess = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.log("Invalid session in DashboardLayout");
          toast.error("Please login to access the admin dashboard");
          navigate('/login', { replace: true });
          return;
        }

        if (!user || !isAdmin) {
          console.log("Access denied - Not admin");
          toast.error("Admin access required");
          navigate('/', { replace: true });
          return;
        }

        if (mounted) {
          console.log("Admin access validated");
          setIsTransitioning(false);
        }
      } catch (error) {
        console.error("Session validation error:", error);
        navigate('/login', { replace: true });
      }
    };

    if (!isLoading) {
      validateAccess();
    }

    return () => {
      mounted = false;
    };
  }, [user, isAdmin, isLoading, navigate]);

  // Show loading states
  if (isLoading || isTransitioning || !user || !isAdmin) {
    return <LoadingScreen showWelcome={false} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-admin-background">
        <AdminSidebar />
        
        <div className="flex-1 min-h-screen md:pl-64 transition-all duration-300">
          <AdminHeader />
          
          <Suspense fallback={<LoadingScreen duration={500} />}>
            <main className="p-3 md:p-6 pt-16 md:pt-20">
              {children}
            </main>
          </Suspense>
          
          <AdminFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}