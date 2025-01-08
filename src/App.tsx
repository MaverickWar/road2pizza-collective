import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryProvider } from "./providers/QueryProvider";
import AuthProvider from "./components/AuthProvider";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <Router>
          <AuthProvider>
            <AppRoutes />
            <Toaster position="top-right" expand={true} richColors />
          </AuthProvider>
        </Router>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;