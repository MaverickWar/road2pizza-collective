import { Suspense, useEffect, useState, memo } from "react";
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

const MemoizedAdminFooter = memo(AdminFooter);
const MemoizedAdminHeader = memo(AdminHeader);
const MemoizedAdminSidebar = memo(AdminSidebar);

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [sessionValidated, setSessionValidated] = useState(false);

  // Debug mount/unmount
  useEffect(() => {
    console.log("DashboardLayout mounted", {
      path: location.pathname,
      user: !!user,
      isAdmin,
      isLoading,
      isTransitioning,
      sessionValidated
    });

    return () => {
      console.log("DashboardLayout unmounted");
    };
  }, []);

  // Validate session and access rights
  useEffect(() => {
    let mounted = true;

    const validateAccess = async () => {
      try {
        console.log("Validating admin access...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.log("Invalid session in DashboardLayout");
          throw new Error("Invalid session");
        }

        if (!user || !isAdmin) {
          console.log("Access denied - Not admin");
          throw new Error("Admin access required");
        }

        if (mounted) {
          console.log("Admin access validated");
          setSessionValidated(true);
          setIsTransitioning(false);
        }
      } catch (error) {
        console.error("Session validation error:", error);
        if (mounted) {
          toast.error(error instanceof Error ? error.message : "Access denied");
          navigate('/login', { replace: true });
        }
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
  if (isLoading || isTransitioning || !user || !isAdmin || !sessionValidated) {
    return <LoadingScreen showWelcome={false} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-admin-background flex flex-col">
        <MemoizedAdminSidebar />
        
        <div className="flex-1 md:pl-64 flex flex-col min-h-screen transition-all duration-300">
          <MemoizedAdminHeader />
          
          <main className="flex-1 p-3 md:p-6 pt-16 md:pt-20">
            <Suspense fallback={<LoadingScreen duration={500} />}>
              {children}
            </Suspense>
          </main>
          
          <MemoizedAdminFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default memo(DashboardLayout);