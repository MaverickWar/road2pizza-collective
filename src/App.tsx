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
                    <AdminOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/*"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminOverview />
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