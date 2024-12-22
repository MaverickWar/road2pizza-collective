import { Shield, UserCog } from "lucide-react";

interface UserRoleBadgesProps {
  isAdmin: boolean;
  isStaff: boolean;
}

const UserRoleBadges = ({ isAdmin, isStaff }: UserRoleBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {isAdmin && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </span>
      )}
      {isStaff && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
          <UserCog className="w-3 h-3 mr-1" />
          Staff
        </span>
      )}
      {!isAdmin && !isStaff && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
          Member
        </span>
      )}
    </div>
  );
};

export default UserRoleBadges;