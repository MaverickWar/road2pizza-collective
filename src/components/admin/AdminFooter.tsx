import { memo } from "react";

export const AdminFooter = memo(() => {
  return (
    <footer className="mt-auto py-4 px-6 bg-white border-t border-dashboard-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-sm text-dashboard-muted">
          © {new Date().getFullYear()} Road2Pizza.com
        </p>
        <div className="flex items-center gap-4">
          <a 
            href="/terms" 
            className="text-sm text-dashboard-muted hover:text-dashboard-primary transition-colors"
          >
            Terms
          </a>
          <a 
            href="/privacy" 
            className="text-sm text-dashboard-muted hover:text-dashboard-primary transition-colors"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
});

AdminFooter.displayName = "AdminFooter";