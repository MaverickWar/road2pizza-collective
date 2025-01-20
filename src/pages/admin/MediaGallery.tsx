import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const MediaGallery = () => {
  return (
    <DashboardLayout>
      <Card className="shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Image className="w-5 h-5" />
            Media Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Media gallery management coming soon...
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default MediaGallery;