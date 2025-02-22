
import { memo } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="pt-[120px] flex-grow animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default memo(MainLayout);
