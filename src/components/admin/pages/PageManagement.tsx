import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PageList from "./PageList";
import PageForm from "./PageForm";

const PageManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Pages Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Page
        </Button>
      </div>

      {(isCreating || editingPage) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? "Create New Page" : "Edit Page"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PageForm
              onClose={() => {
                setIsCreating(false);
                setEditingPage(null);
              }}
              page={editingPage}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <PageList onEdit={setEditingPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PageManagement;