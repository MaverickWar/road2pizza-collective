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
        <AdminSidebar />
        
        {/* Main content wrapper */}
        <div className="flex-1 min-h-screen md:pl-64 transition-all duration-300">
          <AdminHeader />
          
          {/* Main content */}
          <main className="p-3 md:p-6 pt-16 md:pt-20">
            {children}
          </main>
          
          <AdminFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}