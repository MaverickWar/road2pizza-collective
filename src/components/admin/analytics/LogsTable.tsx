import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  console.log('LogsTable rendering with:', { logsCount: logs.length, isLoading });

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
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderErrorDetails = (log: Log) => {
    if (!log.error_details) return null;

    try {
      // Try to parse if it's a JSON string
      const errorObj = typeof log.error_details === 'string' ? 
        JSON.parse(log.error_details) : log.error_details;
      
      return (
        <div className="space-y-2 text-sm">
          {Object.entries(errorObj).map(([key, value]) => (
            <div key={key} className="grid grid-cols-[100px,1fr] gap-2">
              <span className="font-semibold text-gray-600">{key}:</span>
              <span className="text-gray-800">{
                typeof value === 'object' ? 
                  JSON.stringify(value, null, 2) : 
                  String(value)
              }</span>
            </div>
          ))}
        </div>
      );
    } catch {
      // If not JSON, display as formatted text
      return (
        <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
          {log.error_details}
        </pre>
      );
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Response</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No logs found
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <Collapsible
                key={log.id}
                open={expandedRows.has(log.id)}
                onOpenChange={() => toggleRow(log.id)}
              >
                <TableRow className="group">
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
                  <TableCell>
                    <CollapsibleTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      {expandedRows.has(log.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                  </TableCell>
                </TableRow>
                <CollapsibleContent>
                  <TableRow>
                    <TableCell colSpan={8} className="bg-gray-50">
                      <div className="p-4 space-y-4">
                        <h4 className="font-semibold text-sm">Error Details</h4>
                        <ScrollArea className="h-[200px] rounded-md border p-4">
                          {renderErrorDetails(log)}
                        </ScrollArea>
                        {log.url && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Request Details</h4>
                            <div className="grid grid-cols-[100px,1fr] gap-2 text-sm">
                              <span className="font-semibold text-gray-600">URL:</span>
                              <span className="text-gray-800">{log.url}</span>
                              {log.endpoint && (
                                <>
                                  <span className="font-semibold text-gray-600">Endpoint:</span>
                                  <span className="text-gray-800">{log.endpoint}</span>
                                </>
                              )}
                              {log.http_status && (
                                <>
                                  <span className="font-semibold text-gray-600">Status:</span>
                                  <span className="text-gray-800">{log.http_status}</span>
                                </>
                              )}
                              {log.response_time && (
                                <>
                                  <span className="font-semibold text-gray-600">Response Time:</span>
                                  <span className="text-gray-800">{log.response_time}ms</span>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogsTable;