import { Suspense } from "react";
import Navigation from "./Navigation";
import LoadingScreen from "./LoadingScreen";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Suspense fallback={<LoadingScreen />}>
        <main className="pt-[120px]">
          {children}
        </main>
      </Suspense>
    </div>
  );
};

export default MainLayout;