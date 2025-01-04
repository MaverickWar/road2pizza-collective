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
      <div className="overflow-x-auto">
        <TabsList className="inline-flex w-auto min-w-full md:w-full">
          <TabsTrigger value="all" className="flex-1">All Users</TabsTrigger>
          <TabsTrigger value="active" className="flex-1">Active Users</TabsTrigger>
          <TabsTrigger value="staff" className="flex-1">Staff Members</TabsTrigger>
          <TabsTrigger value="suspended" className="flex-1">Suspended Users</TabsTrigger>
          <TabsTrigger value="requests" className="flex-1 relative">
            Profile Requests
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {pendingRequestsCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all">
        <Card>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <UserManagementTable
                users={users}
                onToggleUserRole={onToggleUserRole}
                onToggleSuspend={onToggleSuspend}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="active">
        <Card>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <UserManagementTable
                users={activeUsers}
                onToggleUserRole={onToggleUserRole}
                onToggleSuspend={onToggleSuspend}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="staff">
        <Card>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <UserManagementTable
                users={staffUsers}
                onToggleUserRole={onToggleUserRole}
                onToggleSuspend={onToggleSuspend}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="suspended">
        <Card>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <UserManagementTable
                users={suspendedUsers}
                onToggleUserRole={onToggleUserRole}
                onToggleSuspend={onToggleSuspend}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="requests">
        <Card>
          <CardContent className="p-0 sm:p-6">
            {loadingRequests ? (
              <div className="h-32 flex items-center justify-center">
                <p className="text-muted-foreground">Loading requests...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <ProfileChangeRequestsTable
                  requests={changeRequests}
                  onStatusUpdate={onRequestStatusUpdate}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserTabs;