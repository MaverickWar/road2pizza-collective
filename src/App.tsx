import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { AppRoutes } from "@/routes/AppRoutes";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingScreen from "@/components/LoadingScreen";
import MainLayout from "@/components/MainLayout";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect, memo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

const MemoizedMainLayout = memo(MainLayout);
const MemoizedDashboardLayout = memo(DashboardLayout);

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();
  const [isRouteReady, setIsRouteReady] = useState(false);
  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');

  // Handle initial mount
  useEffect(() => {
    console.log("AppContent mounted", {
      path: location.pathname,
      isAdminRoute,
      user: !!user,
      isAdmin,
      isLoading
    });

    // Set route as ready after initial auth check
    if (!isLoading) {
      setIsRouteReady(true);
    }

    return () => {
      console.log("AppContent unmounted");
    };
  }, [isLoading]);

  // Handle route changes and access control
  useEffect(() => {
    console.log("Route change detected:", {
      path: location.pathname,
      isAdminRoute,
      user: !!user,
      isAdmin,
      isLoading,
      isRouteReady
    });

    if (!isLoading && isRouteReady && isAdminRoute) {
      if (!user) {
        console.log("No user found on admin route, redirecting to login");
        toast.error("Please login to access the admin dashboard");
        navigate('/login', { replace: true });
        return;
      }

      if (!isAdmin) {
        console.log("Non-admin user on admin route, redirecting to home");
        toast.error("Admin access required");
        navigate('/', { replace: true });
        return;
      }
    }
  }, [location.pathname, isAdminRoute, user, isAdmin, isLoading, isRouteReady, navigate]);

  // Show loading screen during initial load
  if (isLoading || !isRouteReady) {
    console.log("Initial loading state:", { isLoading, isRouteReady });
    return <LoadingScreen showWelcome={false} />;
  }

  return (
    <Suspense fallback={<LoadingScreen showWelcome={!!user} />}>
      {isAdminRoute ? (
        <MemoizedDashboardLayout>
          <AppRoutes />
        </MemoizedDashboardLayout>
      ) : (
        <MemoizedMainLayout>
          <AppRoutes />
        </MemoizedMainLayout>
      )}
    </Suspense>
  );
}

const MemoizedAppContent = memo(AppContent);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <MemoizedAppContent />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;