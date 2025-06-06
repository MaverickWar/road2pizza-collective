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
  const [isMounted, setIsMounted] = useState(false);
  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');

  // Handle client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const checkRouteAccess = useCallback(() => {
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
  }, [isAdminRoute, user, isAdmin, isLoading, isRouteReady, navigate]);

  useEffect(() => {
    if (!isLoading) {
      setIsRouteReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && isRouteReady) {
      checkRouteAccess();
    }
  }, [checkRouteAccess, isLoading, isRouteReady]);

  if (!isMounted) {
    return null;
  }

  if (isLoading || !isRouteReady) {
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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

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