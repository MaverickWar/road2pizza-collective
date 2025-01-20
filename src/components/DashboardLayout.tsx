import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { SidebarProvider } from "@/components/ui/sidebar/SidebarContext";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("DashboardLayout auth state:", { user, isAdmin });
    
    // If we have a user but they're not an admin, redirect to home
    if (user && !isAdmin) {
      console.log("Non-admin user attempting to access admin area, redirecting...");
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  // Show loading screen while checking auth
  if (!user || !isAdmin) {
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