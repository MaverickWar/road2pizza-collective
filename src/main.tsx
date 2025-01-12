import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import App from "./App";
import { networkMonitor } from "@/services/NetworkMonitoringService"; // Import the network monitor
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// Add global network monitoring and cleanup
useEffect(() => {
  // Initialize monitoring when the app is loaded
  networkMonitor.cleanup(); // Clean up any active requests when the app starts

  // Cleanup when the app unmounts
  return () => {
    networkMonitor.cleanup();
  };
}, []);