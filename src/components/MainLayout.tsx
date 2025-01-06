import { Navigation } from "./Navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex flex-col pt-16">
        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 lg:px-12 py-6 md:py-8 lg:py-10 w-full max-w-full">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;