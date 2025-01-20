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

  // Show loading only during initial auth check
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If on admin route but not admin, redirect will happen in ProtectedRoute
  if (isAdminRoute && !isAdmin && user) {
    return null;
  }

  // Only use one Suspense boundary at the app level
  return (
    <Suspense fallback={<LoadingScreen />}>
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