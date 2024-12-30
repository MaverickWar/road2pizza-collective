import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";
import AdminNav from "./AdminNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    console.log("AdminLayout mounted", { isAdmin, userId: user?.id });
  }, [isAdmin, user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Access denied</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r border-border bg-card">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <AdminNav />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <ScrollArea className="h-full">
            <div className="container py-6">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;