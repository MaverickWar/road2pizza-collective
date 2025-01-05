import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import StaffDashboard from "@/pages/StaffDashboard";
import MemberDashboard from "@/pages/MemberDashboard";
import UserManagement from "@/pages/UserManagement";
import Reviews from "@/pages/Reviews";
import ReviewsDashboard from "@/pages/ReviewsDashboard";
import Pizza from "@/pages/Pizza";
import PizzaStyle from "@/pages/PizzaStyle";
import Community from "@/pages/Community";

// Admin pages
import MenuManagement from "@/pages/admin/MenuManagement";
import MediaGallery from "@/pages/admin/MediaGallery";
import NotificationManagement from "@/pages/admin/NotificationManagement";
import PizzaTypeManagement from "@/pages/admin/PizzaTypeManagement";
import RewardsManagement from "@/pages/admin/RewardsManagement";
import SiteSettings from "@/pages/admin/SiteSettings";
import ThemeSettings from "@/pages/admin/ThemeSettings";
import ForumManagement from "@/pages/admin/ForumManagement";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";

// Create a new QueryClient instance with configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
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
                path="/dashboard/admin/menu"
                element={
                  <ProtectedRoute requireAdmin>
                    <MenuManagement />
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
              <Route
                path="/dashboard/admin/notifications"
                element={
                  <ProtectedRoute requireAdmin>
                    <NotificationManagement />
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
                path="/dashboard/admin/rewards"
                element={
                  <ProtectedRoute requireAdmin>
                    <RewardsManagement />
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
                path="/dashboard/admin/forum"
                element={
                  <ProtectedRoute requireAdmin>
                    <ForumManagement />
                  </ProtectedRoute>
                }
              />
              
              {/* Staff Routes */}
              <Route
                path="/dashboard/staff"
                element={
                  <ProtectedRoute requireStaff>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Member Routes */}
              <Route
                path="/dashboard/member"
                element={
                  <ProtectedRoute>
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Other Routes */}
              <Route path="/reviews" element={<Reviews />} />
              <Route
                path="/dashboard/reviews"
                element={
                  <ProtectedRoute>
                    <ReviewsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/pizza" element={<Pizza />} />
              <Route path="/pizza/:style" element={<PizzaStyle />} />
              <Route path="/community" element={<Community />} />
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
