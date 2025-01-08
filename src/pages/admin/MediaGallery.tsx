import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const MediaGallery = () => {
  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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