import { Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ResetPassword from "../pages/ResetPassword";
import NotFound from "../pages/NotFound";
import Pizza from "../pages/Pizza";
import PizzaStyle from "../pages/PizzaStyle";
import Community from "../pages/Community";
import Reviews from "../pages/Reviews";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import MemberDashboard from "../pages/MemberDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import UserManagement from "../pages/UserManagement";
import ReviewsDashboard from "../pages/ReviewsDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import ArticleDetail from "../components/article/ArticleDetail";
import CategoryManagement from "../components/forum/CategoryManagement";
import ThreadManagement from "../components/forum/ThreadManagement";
import ForumSettings from "../components/forum/ForumSettings";
import EquipmentReviewDetail from "../components/reviews/EquipmentReviewDetail";
import ReviewManagement from "../components/admin/ReviewManagement";
import RecipeManagement from "../pages/admin/RecipeManagement";
import RewardsManagement from "../pages/admin/RewardsManagement";
import PizzaTypeManagement from "../pages/admin/PizzaTypeManagement";
import NotificationManagement from "../pages/admin/NotificationManagement";
import ThemeSettings from "../pages/admin/ThemeSettings";
import MediaGallery from "../pages/admin/MediaGallery";
import ForumThreadDetail from "../components/forum/ForumThreadDetail";
import Analytics from "../pages/admin/Analytics";
import SiteSettings from "../pages/admin/SiteSettings";

function AppRoutes() {
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
      <Route path="/article/:id" element={<ArticleDetail />} />
      
      {/* Forum routes */}
      <Route path="/forum/thread/:id" element={<ForumThreadDetail />} />
      <Route path="/community/forum/thread/:id" element={<ForumThreadDetail />} />
      <Route path="/forum/category/:categoryId/thread/:threadId" element={<ForumThreadDetail />} />
      <Route path="/community/forum/category/:categoryId/thread/:threadId" element={<ForumThreadDetail />} />
      
      {/* Review routes */}
      <Route path="/equipment-reviews/:id" element={<EquipmentReviewDetail />} />
      <Route path="/review/:id" element={<EquipmentReviewDetail />} />
      <Route path="/reviews/:id" element={<EquipmentReviewDetail />} />
      
      {/* Protected routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      {/* Dashboard routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/member" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/staff" element={<ProtectedRoute requireStaff><StaffDashboard /></ProtectedRoute>} />
      
      {/* Admin routes */}
      <Route path="/dashboard/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/admin/analytics" element={<ProtectedRoute requireAdmin><Analytics /></ProtectedRoute>} />
      <Route path="/dashboard/admin/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
      <Route path="/dashboard/admin/review-management" element={<ProtectedRoute requireAdmin><ReviewManagement /></ProtectedRoute>} />
      <Route path="/dashboard/admin/forum/categories" element={<ProtectedRoute requireAdmin><CategoryManagement /></ProtectedRoute>} />
      <Route path="/dashboard/admin/forum/threads" element={<ProtectedRoute requireAdmin><ThreadManagement /></ProtectedRoute>} />
      <Route path="/dashboard/admin/forum/settings" element={<ProtectedRoute requireAdmin><ForumSettings /></ProtectedRoute>} />
      <Route path="/dashboard/admin/recipes" element={<ProtectedRoute requireAdmin><RecipeManagement /></ProtectedRoute>} />
      <Route path="/dashboard/admin/rewards" element={<ProtectedRoute requireAdmin><RewardsManagement /></ProtectedRoute>} />
      <Route path="/dashboard/admin/pizza-types" element={<ProtectedRoute requireAdmin><PizzaTypeManagement /></ProtectedRoute>} />
      <Route path="/dashboard/admin/notifications" element={<ProtectedRoute requireAdmin><NotificationManagement /></ProtectedRoute>} />
      <Route path="/dashboard/admin/settings" element={<ProtectedRoute requireAdmin><SiteSettings /></ProtectedRoute>} />
      <Route path="/dashboard/admin/theme" element={<ProtectedRoute requireAdmin><ThemeSettings /></ProtectedRoute>} />
      <Route path="/dashboard/admin/media" element={<ProtectedRoute requireAdmin><MediaGallery /></ProtectedRoute>} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;