import Navigation from "@/components/Navigation";

interface ForumLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ForumLayout = ({ children, className = "" }: ForumLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-36 md:pt-32">
        <div className={`container mx-auto px-4 animate-fade-up ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ForumLayout;