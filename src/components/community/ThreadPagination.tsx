import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThreadPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ThreadPagination = ({ currentPage, totalPages, onPageChange }: ThreadPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="p-4 flex justify-center items-center gap-4">
      <Select
        value={currentPage.toString()}
        onValueChange={(value) => onPageChange(parseInt(value))}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Page" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <SelectItem key={page} value={page.toString()}>
              Page {page}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default ThreadPagination;