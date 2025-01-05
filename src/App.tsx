import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/AuthProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MenuManagement from "./pages/admin/MenuManagement";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import { Toaster as Sonner } from "sonner";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import RecipeManagement from "./pages/admin/RecipeManagement";
import ReviewManagement from "./pages/admin/ReviewManagement";
import RewardsManagement from "./pages/admin/RewardsManagement";
import PizzaTypeManagement from "./pages/admin/PizzaTypeManagement";
import NotificationManagement from "./pages/admin/NotificationManagement";
import SiteSettings from "./pages/admin/SiteSettings";
import ThemeSettings from "./pages/admin/ThemeSettings";
import MediaGallery from "./pages/admin/MediaGallery";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/menus"
                element={
                  <ProtectedRoute requireAdmin>
                    <MenuManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/recipes"
                element={
                  <ProtectedRoute requireAdmin>
                    <RecipeManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/reviews"
                element={
                  <ProtectedRoute requireAdmin>
                    <ReviewManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/rewards"
                element={
                  <ProtectedRoute requireAdmin>
                    <RewardsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/pizza-types"
                element={
                  <ProtectedRoute requireAdmin>
                    <PizzaTypeManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/notifications"
                element={
                  <ProtectedRoute requireAdmin>
                    <NotificationManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/settings"
                element={
                  <ProtectedRoute requireAdmin>
                    <SiteSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/theme"
                element={
                  <ProtectedRoute requireAdmin>
                    <ThemeSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/media"
                element={
                  <ProtectedRoute requireAdmin>
                    <MediaGallery />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner position="top-right" />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;