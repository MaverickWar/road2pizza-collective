import { Shield, UserCog } from "lucide-react";

interface UserRoleBadgesProps {
  isAdmin: boolean;
  isStaff: boolean;
}

const UserRoleBadges = ({ isAdmin, isStaff }: UserRoleBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {isAdmin && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </span>
      )}
      {isStaff && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-500 rounded-full">
          <UserCog className="w-3 h-3 mr-1" />
          Staff
        </span>
      )}
      {!isAdmin && !isStaff && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
          Member
        </span>
      )}
    </div>
  );
};

export default UserRoleBadges;