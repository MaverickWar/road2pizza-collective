import Navigation from "./Navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;