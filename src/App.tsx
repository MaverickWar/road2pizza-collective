import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import StaffDashboard from "@/pages/StaffDashboard";
import ReviewsDashboard from "@/pages/ReviewsDashboard";
import EquipmentReviewManagementPage from "@/pages/admin/EquipmentReviewManagement";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminRecipesPage from "@/pages/admin/AdminRecipesPage";
import AdminRewardsPage from "@/pages/admin/AdminRewardsPage";
import AdminPizzaTypesPage from "@/pages/admin/AdminPizzaTypesPage";
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import AdminThemePage from "@/pages/admin/AdminThemePage";
import AdminMediaPage from "@/pages/admin/AdminMediaPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dashboard/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/dashboard/staff",
    element: <StaffDashboard />,
  },
  {
    path: "/dashboard/reviews",
    element: <ReviewsDashboard />,
  },
  {
    path: "/dashboard/admin/equipment-reviews",
    element: <EquipmentReviewManagementPage />,
  },
  {
    path: "/dashboard/admin/users",
    element: <AdminUsersPage />,
  },
  {
    path: "/dashboard/admin/recipes",
    element: <AdminRecipesPage />,
  },
  {
    path: "/dashboard/admin/rewards",
    element: <AdminRewardsPage />,
  },
  {
    path: "/dashboard/admin/pizza-types",
    element: <AdminPizzaTypesPage />,
  },
  {
    path: "/dashboard/admin/notifications",
    element: <AdminNotificationsPage />,
  },
  {
    path: "/dashboard/admin/settings",
    element: <AdminSettingsPage />,
  },
  {
    path: "/dashboard/admin/theme",
    element: <AdminThemePage />,
  },
  {
    path: "/dashboard/admin/media",
    element: <AdminMediaPage />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;