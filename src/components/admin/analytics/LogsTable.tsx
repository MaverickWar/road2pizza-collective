import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface Log {
  id: string;
  type: string;
  message: string;
  severity: string;
  status: string;
  created_at: string;
}

interface LogsTableProps {
  logs: Log[];
  isLoading: boolean;
}

const LogsTable = ({ logs, isLoading }: LogsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-500';
      case 'investigating':
        return 'bg-yellow-500';
      case 'open':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
              </TableCell>
              <TableCell className="capitalize">{log.type}</TableCell>
              <TableCell>{log.message}</TableCell>
              <TableCell>
                <Badge className={`${getSeverityColor(log.severity)} text-white`}>
                  {log.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(log.status)} text-white`}>
                  {log.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogsTable;