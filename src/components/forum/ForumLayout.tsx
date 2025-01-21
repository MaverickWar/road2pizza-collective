import Navigation from "@/components/Navigation";

interface ForumLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ForumLayout = ({ children, className = "" }: ForumLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-[120px]">
        <div className={`container mx-auto animate-fade-up ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ForumLayout;