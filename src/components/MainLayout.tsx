import Navigation from "./Navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;