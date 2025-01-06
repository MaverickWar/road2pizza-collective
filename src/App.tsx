import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import ForumCategories from "./pages/admin/forum/ForumCategories";
import ForumThreads from "./pages/admin/forum/ForumThreads";
import ForumSettings from "./pages/admin/forum/ForumSettings";
import PizzaTypes from "./pages/admin/PizzaTypes";
import Reviews from "./pages/admin/Reviews";
import ReviewManagement from "./pages/admin/ReviewManagement";
import Rewards from "./pages/admin/Rewards";
import Theme from "./pages/admin/Theme";
import Media from "./pages/admin/Media";
import Notifications from "./pages/admin/Notifications";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
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

              <Route
                path="/dashboard/admin/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/admin/forum/categories"
                element={
                  <ProtectedRoute requireAdmin>
                    <ForumCategories />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/admin/forum/threads"
                element={
                  <ProtectedRoute requireAdmin>
                    <ForumThreads />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/admin/forum/settings"
                element={
                  <ProtectedRoute requireAdmin>
                    <ForumSettings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/admin/pizza-types"
                element={
                  <ProtectedRoute requireAdmin>
                    <PizzaTypes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/admin/reviews"
                element={
                  <ProtectedRoute requireAdmin>
                    <Reviews />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/admin/review-management"
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
                    <Rewards />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/admin/theme"
                element={
                  <ProtectedRoute requireAdmin>
                    <Theme />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/admin/media"
                element={
                  <ProtectedRoute requireAdmin>
                    <Media />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/admin/notifications"
                element={
                  <ProtectedRoute requireAdmin>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster position="top-center" />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;