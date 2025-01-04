import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star } from "lucide-react";

const UserPointsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users-points"],
    queryFn: async () => {
      console.log("Fetching users for points management...");
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, points, email")
        .order("points", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      return data;
    },
  });

  const updatePointsMutation = useMutation({
    mutationFn: async ({ userId, points }: { userId: string; points: number }) => {
      console.log("Updating points for user:", userId, points);
      const { error } = await supabase
        .from("profiles")
        .update({ points })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-points"] });
      toast.success("Points updated successfully");
    },
    onError: (error) => {
      console.error("Error updating points:", error);
      toast.error("Failed to update points");
    },
  });

  const filteredUsers = users?.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className="flex items-center text-yellow-600">
                  <Star className="w-4 h-4 mr-1" />
                  {user.points}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    defaultValue={user.points}
                    className="w-24"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const points = parseInt((e.target as HTMLInputElement).value);
                        if (!isNaN(points)) {
                          updatePointsMutation.mutate({ userId: user.id, points });
                        }
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      const points = parseInt(input.value);
                      if (!isNaN(points)) {
                        updatePointsMutation.mutate({ userId: user.id, points });
                      }
                    }}
                  >
                    Update
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserPointsManagement;