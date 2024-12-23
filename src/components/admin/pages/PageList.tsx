import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Lock } from "lucide-react";
import { format } from "date-fns";

interface PageListProps {
  onEdit: (page: any) => void;
}

const PageList = ({ onEdit }: PageListProps) => {
  const { data: pages, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      console.log("Fetching pages...");
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      console.log("Fetched pages:", data);
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Required Role</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages?.map((page) => (
          <TableRow key={page.id}>
            <TableCell>{page.title}</TableCell>
            <TableCell>{page.slug}</TableCell>
            <TableCell className="flex items-center gap-2">
              {page.is_protected && <Lock className="w-4 h-4" />}
              <span>{page.is_protected ? "Protected" : "Public"}</span>
            </TableCell>
            <TableCell>{page.required_role}</TableCell>
            <TableCell>
              {format(new Date(page.updated_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(page)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PageList;