import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserApprovalToggleProps {
  userId: string;
  requiresApproval: boolean;
  onUpdate: () => void;
}

const UserApprovalToggle = ({ userId, requiresApproval, onUpdate }: UserApprovalToggleProps) => {
  const handleToggle = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ requires_recipe_approval: !requiresApproval })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Recipe approval setting updated');
      onUpdate();
    } catch (error) {
      console.error('Error updating approval setting:', error);
      toast.error('Failed to update approval setting');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={requiresApproval}
        onCheckedChange={handleToggle}
      />
      <Label>Requires Recipe Approval</Label>
    </div>
  );
};

export default UserApprovalToggle;