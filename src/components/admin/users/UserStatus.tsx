import { Badge } from "@/components/ui/badge";

interface UserStatusProps {
  isSuspended: boolean;
  isVerified: boolean;
}

const UserStatus = ({ isSuspended, isVerified }: UserStatusProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {isSuspended && (
        <Badge variant="destructive" className="w-fit animate-fade-up">
          Suspended
        </Badge>
      )}
      {!isVerified && (
        <Badge variant="secondary" className="w-fit animate-fade-up">
          Unverified
        </Badge>
      )}
      {!isSuspended && isVerified && (
        <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 w-fit">
          Active
        </Badge>
      )}
    </div>
  );
};

export default UserStatus;