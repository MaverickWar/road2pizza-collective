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
import LogsPage from "@/pages/LogsPage";
import Analytics from "@/pages/admin/Analytics";
import UserManagement from "@/pages/admin/AdminUsersPage";
import RecipeManagement from "@/pages/admin/RecipeManagement";
import ReviewManagementPage from "@/pages/admin/ReviewManagement";
import RewardsManagement from "@/pages/admin/RewardsManagement";
import PizzaTypeManagement from "@/pages/admin/PizzaTypeManagement";
import NotificationManagement from "@/pages/admin/NotificationManagement";
import SiteSettings from "@/pages/admin/SiteSettings";
import ThemeSettings from "@/pages/admin/ThemeSettings";
import MediaGallery from "@/pages/admin/MediaGallery";
import MenuManagement from "@/pages/admin/MenuManagement";
import ForumManagement from "@/pages/admin/ForumManagement";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import ArticleDetail from "@/components/article/ArticleDetail";
import EquipmentReviewDetail from "@/components/reviews/EquipmentReviewDetail";
import ThreadView from "@/components/forum/ThreadView";
import MainLayout from "@/components/MainLayout";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pizza" element={<MainLayout><Pizza /></MainLayout>} />
      <Route path="/pizza/:style" element={<MainLayout><PizzaStyle /></MainLayout>} />
      <Route path="/community" element={<MainLayout><Community /></MainLayout>} />
      <Route path="/community/forum/thread/:id" element={<MainLayout><ThreadView /></MainLayout>} />
      <Route path="/reviews" element={<MainLayout><Reviews /></MainLayout>} />
      <Route path="/logs" element={<MainLayout><LogsPage /></MainLayout>} />
      
      {/* Article and Review routes */}
      <Route path="/article/:id" element={<MainLayout><ArticleDetail /></MainLayout>} />
      <Route path="/reviews/:id" element={<MainLayout><EquipmentReviewDetail /></MainLayout>} />
      
      {/* Protected routes */}
      <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
      <Route path="/reviews/dashboard" element={<ProtectedRoute><MainLayout><ReviewsDashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/dashboard/member" element={<ProtectedRoute><MainLayout><MemberDashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/dashboard/staff" element={<ProtectedRoute requireStaff><MainLayout><StaffDashboard /></MainLayout></ProtectedRoute>} />
      
      {/* Admin routes - Wrapped in DashboardLayout */}
      <Route path="/dashboard/admin/*" element={
        <ProtectedRoute requireAdmin>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/recipes" element={<RecipeManagement />} />
              <Route path="/review-management" element={<ReviewManagementPage />} />
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
      <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
    </Routes>
  );
}