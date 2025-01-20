import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormNavigationProps {
  activeTab: string;
}

const FormNavigation = ({ activeTab }: FormNavigationProps) => {
  return (
    <div className="px-6 sticky top-0 z-10 bg-background border-b">
      <TabsList className="w-full grid grid-cols-4 bg-muted/50 p-1 gap-1 rounded-lg my-2">
        <TabsTrigger 
          value="basic"
          className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          Basic Info
        </TabsTrigger>
        <TabsTrigger 
          value="media"
          className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          Media
        </TabsTrigger>
        <TabsTrigger 
          value="proscons"
          className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          Pros & Cons
        </TabsTrigger>
        <TabsTrigger 
          value="ratings"
          className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
        >
          Ratings
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default FormNavigation;