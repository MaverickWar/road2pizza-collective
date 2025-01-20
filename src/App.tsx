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
              <Suspense fallback={<LoadingScreen />}>
                <AppContent />
              </Suspense>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;