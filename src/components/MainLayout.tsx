import { memo } from "react";
import Navigation from "./Navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-[120px] container">
        {children}
      </main>
    </div>
  );
};

export default memo(MainLayout);