import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Pizza from "@/pages/Pizza";
import PizzaStyle from "@/pages/PizzaStyle";
import Community from "@/pages/Community";
import Reviews from "@/pages/Reviews";
import ReviewsDashboard from "@/pages/ReviewsDashboard";
import Dashboard from "@/pages/Dashboard";
import MemberDashboard from "@/pages/MemberDashboard";
import StaffDashboard from "@/pages/StaffDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Analytics from "@/pages/admin/Analytics";
import UserManagement from "@/pages/admin/AdminUsersPage";
import RecipeManagement from "@/pages/admin/RecipeManagement";
import ReviewManagement from "@/pages/admin/ReviewManagement"; // Fixed import path
import RewardsManagement from "@/pages/admin/RewardsManagement";
import PizzaTypeManagement from "@/pages/admin/PizzaTypeManagement";
import NotificationManagement from "@/pages/admin/NotificationManagement";
import SiteSettings from "@/pages/admin/SiteSettings";
import ThemeSettings from "@/pages/admin/ThemeSettings";
import MediaGallery from "@/pages/admin/MediaGallery";
import MenuManagement from "@/pages/admin/MenuManagement";
import ForumManagement from "@/pages/admin/ForumManagement";
import ProtectedRoute from "@/components/ProtectedRoute"; // Fixed import
import DashboardLayout from "@/components/DashboardLayout";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pizza" element={<Pizza />} />
      <Route path="/pizza/:style" element={<PizzaStyle />} />
      <Route path="/community" element={<Community />} />
      <Route path="/reviews" element={<Reviews />} />
      
      {/* Protected routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/reviews/dashboard" element={<ProtectedRoute><ReviewsDashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/member" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/staff" element={<ProtectedRoute requireStaff><StaffDashboard /></ProtectedRoute>} />
      
      {/* Admin routes - Wrapped in DashboardLayout */}
      <Route path="/dashboard/admin/*" element={
        <ProtectedRoute requireAdmin>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/recipes" element={<RecipeManagement />} />
              <Route path="/review-management" element={<ReviewManagement />} />
              <Route path="/rewards" element={<RewardsManagement />} />
              <Route path="/pizza-types" element={<PizzaTypeManagement />} />
              <Route path="/notifications" element={<NotificationManagement />} />
              <Route path="/settings" element={<SiteSettings />} />
              <Route path="/theme" element={<ThemeSettings />} />
              <Route path="/media" element={<MediaGallery />} />
              <Route path="/menu" element={<MenuManagement />} />
              <Route path="/forum" element={<ForumManagement />} />
            </Routes>
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}