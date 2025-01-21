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
import { useLocation } from "react-router-dom";
import { Suspense, useEffect, memo } from "react";
import { useAuth } from "@/components/AuthProvider";

const MemoizedMainLayout = memo(MainLayout);
const MemoizedDashboardLayout = memo(DashboardLayout);

function AppContent() {
  const location = useLocation();
  const { user, isAdmin, isLoading } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');

  useEffect(() => {
    console.log("AppContent state:", { 
      user, 
      isAdmin, 
      path: location.pathname,
      isLoading,
      isAdminRoute 
    });
  }, [user, isAdmin, location.pathname, isLoading, isAdminRoute]);

  // Always show loading during initial auth check
  if (isLoading) {
    console.log("Showing loading screen - auth check in progress");
    return <LoadingScreen showWelcome={false} />;
  }

  // Show loading during admin route transitions
  if (isAdminRoute) {
    if (!user) {
      console.log("No user found on admin route, redirecting...");
      return <LoadingScreen showWelcome={false} />;
    }
    
    if (!isAdmin) {
      console.log("Non-admin user on admin route, redirecting...");
      return <LoadingScreen showWelcome={false} />;
    }
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