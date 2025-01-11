import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
      case 'open':
        return 'bg-red-500';
      case 'investigating':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div>Loading logs...</div>;
  }

  return (
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
              {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
            </TableCell>
            <TableCell>{log.type}</TableCell>
            <TableCell>{log.message}</TableCell>
            <TableCell>
              <Badge className={getSeverityColor(log.severity)}>
                {log.severity}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(log.status)}>
                {log.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LogsTable;