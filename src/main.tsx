import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const renderApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Failed to find root element");
    return;
  }

  // Ensure the root element is empty before rendering
  while (rootElement.firstChild) {
    rootElement.removeChild(rootElement.firstChild);
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      process.env.NODE_ENV === 'development' ? (
        <React.StrictMode>
          <App />
        </React.StrictMode>
      ) : (
        <App />
      )
    );
  } catch (error) {
    console.error("Error rendering app:", error);
  }
};

// Wait for DOM to be fully loaded before initializing
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderApp);
} else {
  renderApp();
}