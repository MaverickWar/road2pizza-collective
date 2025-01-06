import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const UserTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="bg-muted/50">
        <TableHead className="w-[250px]">User</TableHead>
        <TableHead className="w-[150px]">Roles</TableHead>
        <TableHead className="w-[200px]">Stats</TableHead>
        <TableHead className="w-[120px]">Status</TableHead>
        <TableHead className="w-[180px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UserTableHeader;