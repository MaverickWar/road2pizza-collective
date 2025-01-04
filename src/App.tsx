import { useQuery } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/AuthProvider";
import queryClient from "@/lib/queryClient";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import AdminDashboard from "@/pages/AdminDashboard";
import PizzaTypeManagement from "@/pages/admin/PizzaTypeManagement";
import NotificationManagement from "@/pages/admin/NotificationManagement";
import SiteSettings from "@/pages/admin/SiteSettings";
import ThemeSettings from "@/pages/admin/ThemeSettings";
import MediaGallery from "@/pages/admin/MediaGallery";
import Index from "@/pages/Index";

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={createBrowserRouter([
          {
            path: "/",
            element: <Index />
          },
          {
            path: "/dashboard/admin",
            element: (
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "/dashboard/admin/pizza-types",
            element: (
              <ProtectedRoute requireAdmin>
                <PizzaTypeManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "/dashboard/admin/notifications",
            element: (
              <ProtectedRoute requireAdmin>
                <NotificationManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: "/dashboard/admin/settings",
            element: (
              <ProtectedRoute requireAdmin>
                <SiteSettings />
              </ProtectedRoute>
            ),
          },
          {
            path: "/dashboard/admin/theme",
            element: (
              <ProtectedRoute requireAdmin>
                <ThemeSettings />
              </ProtectedRoute>
            ),
          },
          {
            path: "/dashboard/admin/media",
            element: (
              <ProtectedRoute requireAdmin>
                <MediaGallery />
              </ProtectedRoute>
            ),
          },
        ])} />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;