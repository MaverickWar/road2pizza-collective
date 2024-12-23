import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ProfileChangeRequest } from "@/types/profile";

interface ProfileChangeRequestsTableProps {
  requests: ProfileChangeRequest[];
  onStatusUpdate: () => void;
}

const ProfileChangeRequestsTable = ({ requests, onStatusUpdate }: ProfileChangeRequestsTableProps) => {
  const handleUpdateStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profile_change_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      if (status === 'approved') {
        // Update the user's profile with the requested changes
        const request = requests.find(r => r.id === requestId);
        if (request) {
          const updates: { username?: string } = {};
          if (request.requested_username) {
            updates.username = request.requested_username;
          }
          
          const { error: profileError } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', request.user_id);

          if (profileError) throw profileError;
        }
      }

      toast.success(`Request ${status}`);
      onStatusUpdate();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Current Username</TableHead>
            <TableHead>Requested Changes</TableHead>
            <TableHead>Requested On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.profiles?.username || 'Unknown'}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {request.requested_username && (
                    <div>
                      <span className="font-medium">Username:</span>{" "}
                      {request.requested_username}
                    </div>
                  )}
                  {request.requested_email && (
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {request.requested_email}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(request.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : request.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                {request.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(request.id, 'approved')}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(request.id, 'rejected')}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfileChangeRequestsTable;