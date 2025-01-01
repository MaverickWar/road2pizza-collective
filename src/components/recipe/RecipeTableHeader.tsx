import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RecipeTableHeaderProps {
  showApprovalActions?: boolean;
}

const RecipeTableHeader = ({ showApprovalActions }: RecipeTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Recipe</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Stats</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default RecipeTableHeader;