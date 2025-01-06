import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import MenuManagement from "./pages/admin/MenuManagement";
import UserManagement from "./pages/UserManagement";
import RecipeManagementPage from "./pages/admin/RecipeManagement";
import ReviewsDashboard from "./pages/ReviewsDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pizza" element={<Pizza />} />
          <Route path="/pizza/:style" element={<PizzaStyle />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;