import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Log {
  id: string;
  type: string;
  message: string;
  severity: string;
  status: string;
  created_at: string;
  url?: string;
  user_id?: string;
  http_status?: number;
  response_time?: number;
  endpoint?: string;
  error_details?: string;
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
        return 'bg-red-600';
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
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
            <TableHead>Endpoint</TableHead>
            <TableHead>Response</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No logs found
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                </TableCell>
                <TableCell className="capitalize">{log.type}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="max-w-[300px] truncate">
                          {log.message}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{log.message}</p>
                        {log.error_details && (
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                            {log.error_details}
                          </pre>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  {log.url && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm truncate max-w-[200px]">
                        {log.endpoint || new URL(log.url).pathname}
                      </span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {log.http_status && (
                    <Badge variant={log.http_status >= 400 ? "destructive" : "secondary"}>
                      {log.http_status}
                    </Badge>
                  )}
                  {log.response_time && (
                    <span className="ml-2 text-sm text-gray-500">
                      {log.response_time.toFixed(0)}ms
                    </span>
                  )}
                </TableCell>
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogsTable;