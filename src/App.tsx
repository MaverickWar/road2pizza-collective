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
import { Suspense } from "react";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');

  // If it's an admin route, don't wrap with MainLayout
  if (isAdminRoute) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AppRoutes />
      </Suspense>
    );
  }

  // For all other routes, use MainLayout
  return (
    <MainLayout>
      <Suspense fallback={<LoadingScreen />}>
        <AppRoutes />
      </Suspense>
    </MainLayout>
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