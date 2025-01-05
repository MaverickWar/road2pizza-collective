import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingScreen from "@/components/LoadingScreen";
import { Suspense } from "react";
import MainNav from "@/components/MainNav";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import UserManagement from "@/pages/UserManagement";
import StaffDashboard from "@/pages/StaffDashboard";
import Community from "@/pages/Community";
import Pizza from "@/pages/Pizza";
import PizzaStyle from "@/pages/PizzaStyle";
import Reviews from "@/pages/Reviews";
import ArticleDetail from "@/components/article/ArticleDetail";
import EquipmentReviewDetail from "@/components/reviews/EquipmentReviewDetail";
import ReviewsDashboard from "@/components/reviews/ReviewsDashboard";
import ForumManagement from "@/components/forum/ForumManagement";
import CategoryManagement from "@/components/forum/CategoryManagement";
import ForumSettings from "@/components/forum/ForumSettings";
import ThreadManagement from "@/components/forum/ThreadManagement";
import CategoryView from "@/components/forum/CategoryView";
import ThreadView from "@/components/forum/ThreadView";
import MediaGallery from "@/pages/admin/MediaGallery";
import ThemeSettings from "@/pages/admin/ThemeSettings";
import NotificationManagement from "@/pages/admin/NotificationManagement";
import RewardsManagement from "@/pages/admin/RewardsManagement";
import PizzaTypeManagement from "@/pages/admin/PizzaTypeManagement";
import RecipeManagementPage from "@/pages/admin/RecipeManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  console.log("Current route:", location.pathname);

  return (
    <div
      key={location.pathname}
      className="w-full animate-fade-in"
    >
      {children}
    </div>
  );
}

function AppContent() {
  return (
    <>
      <MainNav />
      <PageTransitionWrapper>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboard/admin/*"
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
              path="/dashboard/admin/recipes"
              element={
                <ProtectedRoute requireAdmin>
                  <RecipeManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/forum/*"
              element={
                <ProtectedRoute requireAdmin>
                  <ForumManagement />
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
              path="/dashboard/admin/theme"
              element={
                <ProtectedRoute requireAdmin>
                  <ThemeSettings />
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
              path="/dashboard/reviews"
              element={
                <ProtectedRoute requireStaff>
                  <ReviewsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/staff"
              element={
                <ProtectedRoute requireStaff>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />

            {/* Community Routes */}
            <Route path="/community" element={<Community />} />
            <Route path="/community/forum/category/:id" element={<CategoryView />} />
            <Route path="/community/forum/thread/:id" element={<ThreadView />} />

            {/* Pizza Routes */}
            <Route path="/pizza" element={<Pizza />} />
            <Route path="/pizza/:style" element={<PizzaStyle />} />
            <Route path="/pizza-style" element={<PizzaStyle />} />

            {/* Article and Review Routes */}
            <Route path="/reviews" element={<Reviews />} />
            <Route 
              path="/article/:id" 
              element={<ArticleDetail />} 
            />
            <Route 
              path="/equipment/:id" 
              element={<EquipmentReviewDetail />} 
            />
          </Routes>
        </Suspense>
      </PageTransitionWrapper>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;