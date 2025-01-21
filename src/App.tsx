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
import { Suspense, useEffect, memo, useState, useCallback } from "react";
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

  // Memoize route check to prevent unnecessary re-renders
  const checkRouteAccess = useCallback(() => {
    console.log("Checking route access:", {
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
        return false;
      }

      if (!isAdmin) {
        console.log("Non-admin user on admin route, redirecting to home");
        toast.error("Admin access required");
        navigate('/', { replace: true });
        return false;
      }
    }
    return true;
  }, [location.pathname, isAdminRoute, user, isAdmin, isLoading, isRouteReady, navigate]);

  // Handle initial mount and auth state
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
  }, [isLoading, location.pathname, isAdminRoute, user, isAdmin]);

  // Handle route changes and access control
  useEffect(() => {
    if (!isLoading && isRouteReady) {
      checkRouteAccess();
    }
  }, [checkRouteAccess, isLoading, isRouteReady]);

  // Show loading screen during initial load
  if (isLoading || !isRouteReady) {
    console.log("Initial loading state:", { isLoading, isRouteReady });
    return <LoadingScreen showWelcome={false} />;
  }

  const Layout = isAdminRoute ? MemoizedDashboardLayout : MemoizedMainLayout;

  return (
    <Suspense fallback={<LoadingScreen showWelcome={!!user} />}>
      <Layout>
        <AppRoutes />
      </Layout>
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