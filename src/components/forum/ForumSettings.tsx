import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const ForumSettings = () => {
  const [allowGuestViewing, setAllowGuestViewing] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [autoLockInactive, setAutoLockInactive] = useState(false);

  const handleSaveSettings = async () => {
    try {
      // TODO: Implement settings persistence when needed
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Forum Settings</h1>
      
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="guest-viewing">Guest Viewing</Label>
              <p className="text-sm text-muted-foreground">
                Allow non-registered users to view forum content
              </p>
            </div>
            <Switch
              id="guest-viewing"
              checked={allowGuestViewing}
              onCheckedChange={setAllowGuestViewing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-approval">Require Post Approval</Label>
              <p className="text-sm text-muted-foreground">
                New posts require moderator approval before being visible
              </p>
            </div>
            <Switch
              id="require-approval"
              checked={requireApproval}
              onCheckedChange={setRequireApproval}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-lock">Auto-lock Inactive Threads</Label>
              <p className="text-sm text-muted-foreground">
                Automatically lock threads after 30 days of inactivity
              </p>
            </div>
            <Switch
              id="auto-lock"
              checked={autoLockInactive}
              onCheckedChange={setAutoLockInactive}
            />
          </div>
        </div>

        <Button onClick={handleSaveSettings} className="w-full">
          Save Settings
        </Button>
      </Card>
    </div>
  );
};

export default ForumSettings;