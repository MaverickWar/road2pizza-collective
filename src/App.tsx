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

// Memoize the layouts to prevent unnecessary re-renders
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
      isLoading 
    });
  }, [user, isAdmin, location.pathname, isLoading]);

  // Show loading screen during initial auth check and route transitions
  if (isLoading) {
    return <LoadingScreen showWelcome={!!user} />;
  }

  // If on admin route but not admin, show loading while redirect happens
  if (isAdminRoute && !isAdmin && user) {
    console.log("Non-admin attempting to access admin route, redirecting...");
    return <LoadingScreen showWelcome={false} />;
  }

  // Use a single Suspense boundary for code splitting
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

// Memoize AppContent to prevent unnecessary re-renders
const MemoizedAppContent = memo(AppContent);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <MemoizedAppContent />
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;