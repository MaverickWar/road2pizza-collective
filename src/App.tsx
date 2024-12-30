import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingScreen from "@/components/LoadingScreen";
import { Suspense, lazy } from "react";

// Import existing pages
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Community = lazy(() => import("@/pages/Community"));
const Pizza = lazy(() => import("@/pages/Pizza"));
const PizzaStyle = lazy(() => import("@/pages/PizzaStyle"));
const Reviews = lazy(() => import("@/pages/Reviews"));

// Import admin pages
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const UserManagement = lazy(() => import("@/pages/UserManagement"));
const ReviewsDashboard = lazy(() => import("@/components/reviews/ReviewsDashboard"));
const ForumManagement = lazy(() => import("@/components/forum/ForumManagement"));
const BadgeManagement = lazy(() => import("@/components/admin/rewards/BadgeManagement"));
const PageManagement = lazy(() => import("@/components/admin/pages/PageManagement"));
const AppearanceSettings = lazy(() => import("@/pages/admin/AppearanceSettings"));
const TypographySettings = lazy(() => import("@/pages/admin/TypographySettings"));
const LayoutSettings = lazy(() => import("@/pages/admin/LayoutSettings"));
const ModerationDashboard = lazy(() => import("@/pages/admin/ModerationDashboard"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/community" element={<Community />} />
              <Route path="/pizza" element={<Pizza />} />
              <Route path="/pizza/:style" element={<PizzaStyle />} />
              <Route path="/reviews" element={<Reviews />} />

              {/* Admin routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requireAdmin>
                    <Routes>
                      <Route path="/" element={<AdminOverview />} />
                      <Route path="/users" element={<UserManagement />} />
                      <Route path="/reviews" element={<ReviewsDashboard />} />
                      <Route path="/forum/*" element={<ForumManagement />} />
                      <Route path="/rewards" element={<BadgeManagement />} />
                      <Route path="/pages" element={<PageManagement />} />
                      <Route path="/appearance" element={<AppearanceSettings />} />
                      <Route path="/typography" element={<TypographySettings />} />
                      <Route path="/layout" element={<LayoutSettings />} />
                      <Route path="/moderation" element={<ModerationDashboard />} />
                      <Route path="/settings" element={<AdminSettings />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;