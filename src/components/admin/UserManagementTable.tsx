import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Ban, Eye, Shield, UserCog, Award, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UserManagementTableProps {
  users: any[];
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
}

const UserManagementTable = ({ users, onToggleUserRole, onToggleSuspend }: UserManagementTableProps) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [points, setPoints] = useState("");
  const [badgeTitle, setBadgeTitle] = useState("");
  const [badgeColor, setBadgeColor] = useState("");

  const handleUpdateUserStats = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          points: parseInt(points) || 0,
          badge_title: badgeTitle || null,
          badge_color: badgeColor || null,
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success("User stats updated successfully");
      setSelectedUser(null);
      setPoints("");
      setBadgeTitle("");
      setBadgeColor("");
    } catch (error) {
      console.error("Error updating user stats:", error);
      toast.error("Failed to update user stats");
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id} className="group hover:bg-secondary/50">
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="flex items-center space-x-2">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{user.username}</span>
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{user.username}</h4>
                      <p className="text-sm text-muted-foreground">
                        Joined {format(new Date(user.created_at), "MMMM yyyy")}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {user.is_admin && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </span>
                  )}
                  {user.is_staff && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      <UserCog className="w-3 h-3 mr-1" />
                      Staff
                    </span>
                  )}
                  {!user.is_admin && !user.is_staff && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      Member
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{user.points || 0} points</span>
                  </div>
                  {user.badge_title && (
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4" style={{ color: user.badge_color || 'currentColor' }} />
                      <span>{user.badge_title}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    user.is_suspended
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.is_suspended ? "Suspended" : "Active"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Manage Stats
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update User Stats</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="points">Points</Label>
                          <Input
                            id="points"
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            placeholder={user?.points?.toString() || "0"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="badgeTitle">Badge Title</Label>
                          <Input
                            id="badgeTitle"
                            value={badgeTitle}
                            onChange={(e) => setBadgeTitle(e.target.value)}
                            placeholder={user?.badge_title || "Enter badge title"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="badgeColor">Badge Color</Label>
                          <div className="flex space-x-2">
                            <Input
                              id="badgeColor"
                              value={badgeColor}
                              onChange={(e) => setBadgeColor(e.target.value)}
                              placeholder={user?.badge_color || "#000000"}
                            />
                            <div
                              className="w-10 h-10 rounded border"
                              style={{ backgroundColor: badgeColor || user?.badge_color || '#000000' }}
                            />
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleUpdateUserStats(user.id)}
                        >
                          Update Stats
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleUserRole(user.id, 'admin', user.is_admin)}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {user.is_admin ? "Remove Admin" : "Make Admin"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleUserRole(user.id, 'staff', user.is_staff)}
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    {user.is_staff ? "Remove Staff" : "Make Staff"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleSuspend(user.id, user.is_suspended)}
                  >
                    {user.is_suspended ? (
                      <Eye className="w-4 h-4 mr-2" />
                    ) : (
                      <Ban className="w-4 h-4 mr-2" />
                    )}
                    {user.is_suspended ? "Activate" : "Suspend"}
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

export default UserManagementTable;