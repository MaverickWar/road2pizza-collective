import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { SidebarProvider } from "@/components/ui/sidebar/SidebarContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-admin-background">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Header */}
            <AdminHeader />
            
            {/* Main content */}
            <main className="flex-1 p-6 pt-24 md:pl-64">
              {children}
            </main>
            
            {/* Footer */}
            <AdminFooter />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}