import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, ListPlus, Star } from "lucide-react";

interface FormNavigationProps {
  activeTab: string;
}

const FormNavigation = ({ activeTab }: FormNavigationProps) => {
  return (
    <div className="px-6 sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 bg-muted/50 p-1 gap-1 rounded-lg my-2">
        <TabsTrigger 
          value="basic"
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Basic Info</span>
        </TabsTrigger>
        <TabsTrigger 
          value="media"
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
        >
          <Image className="w-4 h-4" />
          <span className="hidden sm:inline">Media</span>
        </TabsTrigger>
        <TabsTrigger 
          value="proscons"
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
        >
          <ListPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Pros & Cons</span>
        </TabsTrigger>
        <TabsTrigger 
          value="ratings"
          className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
        >
          <Star className="w-4 h-4" />
          <span className="hidden sm:inline">Ratings</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default FormNavigation;