import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import StaffDashboard from "@/pages/StaffDashboard";
import MemberDashboard from "@/pages/MemberDashboard";
import Reviews from "@/pages/Reviews";
import ReviewsDashboard from "@/pages/ReviewsDashboard";
import EquipmentReviewDetail from "@/components/reviews/EquipmentReviewDetail";
import Pizza from "@/pages/Pizza";
import PizzaStyle from "@/pages/PizzaStyle";
import Community from "@/pages/Community";
import UserManagement from "@/pages/UserManagement";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute staffOnly>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member"
            element={
              <ProtectedRoute>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/:id" element={<EquipmentReviewDetail />} />
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
          <Route
            path="/users"
            element={
              <ProtectedRoute adminOnly>
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
        <Sonner />
      </AuthProvider>
    </Router>
  );
};

export default App;