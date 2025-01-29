import { memo } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  console.log('Rendering MainLayout');
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default memo(MainLayout);