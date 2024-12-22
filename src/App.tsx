import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";

// Page imports
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import StaffDashboard from "@/pages/StaffDashboard";
import MemberDashboard from "@/pages/MemberDashboard";
import Community from "@/pages/Community";
import Pizza from "@/pages/Pizza";
import PizzaStyle from "@/pages/PizzaStyle";
import Reviews from "@/pages/Reviews";
import ArticleDetail from "@/components/ArticleDetail";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/member" element={<MemberDashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/pizza" element={<Pizza />} />
            <Route path="/pizza-style" element={<PizzaStyle />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;