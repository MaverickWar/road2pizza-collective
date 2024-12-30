import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";
import AdminNav from "./AdminNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Loader2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAdmin, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 p-4 bg-background z-50 border-b">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full pt-5">
              <AdminNav />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
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
            <div className={cn(
              "container py-6",
              "lg:py-6",
              "mt-16 lg:mt-0" // Account for mobile header
            )}>
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;