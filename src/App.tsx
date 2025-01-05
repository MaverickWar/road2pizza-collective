import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Reviews from "@/pages/Reviews";
import StaffDashboard from "@/pages/StaffDashboard";
import ReviewsDashboard from "@/pages/admin/ReviewsDashboard"; // Updated import
import ProtectedRoute from "@/components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dashboard/admin/reviews", // Updated path
    element: (
      <ProtectedRoute requireAdmin>
        <ReviewsDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/staff",
    element: <StaffDashboard />,
  },
  {
    path: "/reviews",
    element: <Reviews />,
  },
]);

export default router;
