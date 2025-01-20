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
          <AdminSidebar />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col min-h-screen">
            <AdminHeader />
            
            {/* Main content */}
            <main className="flex-1 p-4 md:p-6 pt-20 md:pt-24 md:pl-64 transition-all duration-300">
              {children}
            </main>
            
            <AdminFooter />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}