import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import UserManagementTable from "../UserManagementTable";
import ProfileChangeRequestsTable from "../ProfileChangeRequestsTable";
import type { ProfileChangeRequest } from "@/types/profile";

interface UserTabsProps {
  users: any[];
  activeUsers: any[];
  staffUsers: any[];
  suspendedUsers: any[];
  changeRequests: ProfileChangeRequest[];
  pendingRequestsCount: number;
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
  loadingRequests: boolean;
  onRequestStatusUpdate: () => void;
}

const UserTabs = ({
  users,
  activeUsers,
  staffUsers,
  suspendedUsers,
  changeRequests,
  pendingRequestsCount,
  onToggleUserRole,
  onToggleSuspend,
  loadingRequests,
  onRequestStatusUpdate
}: UserTabsProps) => {
  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">All Users</TabsTrigger>
        <TabsTrigger value="active">Active Users</TabsTrigger>
        <TabsTrigger value="staff">Staff Members</TabsTrigger>
        <TabsTrigger value="suspended">Suspended Users</TabsTrigger>
        <TabsTrigger value="requests" className="relative">
          Profile Requests
          {pendingRequestsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {pendingRequestsCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <Card>
          <CardContent className="pt-6">
            <UserManagementTable
              users={users}
              onToggleUserRole={onToggleUserRole}
              onToggleSuspend={onToggleSuspend}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="active">
        <Card>
          <CardContent className="pt-6">
            <UserManagementTable
              users={activeUsers}
              onToggleUserRole={onToggleUserRole}
              onToggleSuspend={onToggleSuspend}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="staff">
        <Card>
          <CardContent className="pt-6">
            <UserManagementTable
              users={staffUsers}
              onToggleUserRole={onToggleUserRole}
              onToggleSuspend={onToggleSuspend}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="suspended">
        <Card>
          <CardContent className="pt-6">
            <UserManagementTable
              users={suspendedUsers}
              onToggleUserRole={onToggleUserRole}
              onToggleSuspend={onToggleSuspend}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="requests">
        <Card>
          <CardContent>
            {loadingRequests ? (
              <div className="h-32 flex items-center justify-center">
                <p className="text-muted-foreground">Loading requests...</p>
              </div>
            ) : (
              <ProfileChangeRequestsTable
                requests={changeRequests}
                onStatusUpdate={onRequestStatusUpdate}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserTabs;