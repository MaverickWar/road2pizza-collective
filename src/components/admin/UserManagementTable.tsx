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
import { format } from "date-fns";
import { Ban, Eye, Shield, UserCog, Award } from "lucide-react";
import { useState } from "react";
import UserStatsDialog from "./UserStatsDialog";
import UserRoleBadges from "./UserRoleBadges";
import UserStats from "./UserStats";

interface UserManagementTableProps {
  users: any[];
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
}

const UserManagementTable = ({ users, onToggleUserRole, onToggleSuspend }: UserManagementTableProps) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);

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
                <UserRoleBadges isAdmin={user.is_admin} isStaff={user.is_staff} />
              </TableCell>
              <TableCell>
                <UserStats 
                  points={user.points} 
                  badgeTitle={user.badge_title} 
                  badgeColor={user.badge_color} 
                />
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setStatsDialogOpen(true);
                    }}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Manage Stats
                  </Button>
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

      <UserStatsDialog
        user={selectedUser}
        open={statsDialogOpen}
        onOpenChange={setStatsDialogOpen}
        onSuccess={() => {
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default UserManagementTable;