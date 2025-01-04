import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

const MediaGallery = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Media Gallery</h1>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              Media gallery management coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MediaGallery;