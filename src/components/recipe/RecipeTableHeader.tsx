import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RecipeTableHeader = () => {
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