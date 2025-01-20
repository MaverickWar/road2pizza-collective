import Navigation from "./Navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16 px-4 md:px-8 lg:px-12 py-6 md:py-8 lg:py-10">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;