import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormNavigationProps {
  activeTab: string;
}

const FormNavigation = ({ activeTab }: FormNavigationProps) => {
  return (
    <div className="px-6 sticky top-0 z-10 bg-card border-b">
      <TabsList className="w-full grid grid-cols-4 bg-background p-1 gap-1 rounded-lg my-2">
        <TabsTrigger 
          value="basic"
          className="px-4 py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-colors rounded-md text-sm font-medium"
        >
          Basic Info
        </TabsTrigger>
        <TabsTrigger 
          value="media"
          className="px-4 py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-colors rounded-md text-sm font-medium"
        >
          Media
        </TabsTrigger>
        <TabsTrigger 
          value="proscons"
          className="px-4 py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-colors rounded-md text-sm font-medium whitespace-nowrap"
        >
          Pros & Cons
        </TabsTrigger>
        <TabsTrigger 
          value="ratings"
          className="px-4 py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-colors rounded-md text-sm font-medium"
        >
          Ratings
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default FormNavigation;