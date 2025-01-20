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
import { Suspense, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

function AppContent() {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');

  useEffect(() => {
    console.log("AppContent auth state:", { user, isAdmin, path: location.pathname });
  }, [user, isAdmin, location.pathname]);

  // If on admin route but not admin, show loading while auth check completes
  if (isAdminRoute && !isAdmin && user) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      {isAdminRoute ? (
        <DashboardLayout>
          <AppRoutes />
        </DashboardLayout>
      ) : (
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      )}
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;