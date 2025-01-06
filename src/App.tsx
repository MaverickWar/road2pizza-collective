import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Pizza from "./pages/Pizza";
import PizzaStyle from "./pages/PizzaStyle";
import ArticleDetail from "./components/article/ArticleDetail";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MenuManagement from "./pages/admin/MenuManagement";
import UserManagement from "./pages/UserManagement";
import RecipeManagementPage from "./pages/admin/RecipeManagement";
import ReviewsDashboard from "./pages/ReviewsDashboard";
import ForumManagement from "./pages/admin/ForumManagement";
import RewardsManagement from "./pages/admin/RewardsManagement";
import PizzaTypeManagement from "./pages/admin/PizzaTypeManagement";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pizza" element={<Pizza />} />
            <Route path="/pizza/:style" element={<PizzaStyle />} />
            <Route path="/article/:id" element={<ArticleDetail />} />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* User dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/menu"
              element={
                <ProtectedRoute requireAdmin>
                  <MenuManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute requireAdmin>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/recipes"
              element={
                <ProtectedRoute requireAdmin>
                  <RecipeManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/reviews"
              element={
                <ProtectedRoute requireAdmin>
                  <ReviewsDashboard />
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

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;