import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { AppRoutes } from "@/routes/AppRoutes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/LoadingScreen";
import MainLayout from "@/components/MainLayout";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "react-router-dom";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/dashboard/admin');

  // If it's an admin route, don't wrap with MainLayout
  if (isAdminRoute) {
    return <AppRoutes />;
  }

  // For all other routes, use MainLayout
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <AppContent />
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;