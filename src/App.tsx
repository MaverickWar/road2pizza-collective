import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { AuthProvider } from "./components/AuthProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;