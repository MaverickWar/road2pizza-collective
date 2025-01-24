import { Suspense, useEffect, useState, memo } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Footer from "@/components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar/SidebarContext";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "./AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const MemoizedAdminHeader = memo(AdminHeader);
const MemoizedAdminSidebar = memo(AdminSidebar);

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [sessionValidated, setSessionValidated] = useState(false);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Debug mount/unmount
  useEffect(() => {
    console.log("DashboardLayout mounted", {
      path: location.pathname,
      user: !!user,
      isAdmin,
      isLoading,
      isTransitioning,
      sessionValidated,
      isMobile,
      sidebarOpen
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

  // Handle mobile menu toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on mobile when clicking outside
  const handleContentClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Show loading states
  if (isLoading || isTransitioning || !user || !isAdmin || !sessionValidated) {
    return <LoadingScreen showWelcome={false} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-admin-background flex flex-col">
        <div className="flex flex-1">
          <MemoizedAdminSidebar 
            isOpen={sidebarOpen} 
            onToggle={toggleSidebar} 
            isMobile={isMobile} 
          />
          
          <div 
            className={`flex-1 transition-all duration-300 ${
              sidebarOpen && !isMobile ? 'md:ml-64' : 'md:ml-20'
            }`}
          >
            <MemoizedAdminHeader onMenuClick={toggleSidebar} />
            
            <main 
              className="p-4 md:p-6 pt-20"
              onClick={handleContentClick}
            >
              <div className="max-w-7xl mx-auto">
                <Suspense fallback={<LoadingScreen duration={500} />}>
                  {children}
                </Suspense>
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

export default memo(DashboardLayout);