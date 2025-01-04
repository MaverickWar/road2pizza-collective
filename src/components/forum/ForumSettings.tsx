import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import type { ForumSettings as ForumSettingsType } from './types';

const ForumSettings = () => {
  const [allowGuestViewing, setAllowGuestViewing] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [autoLockInactive, setAutoLockInactive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('forum_settings')
          .select('*')
          .single();

        if (error) throw error;

        if (data) {
          setAllowGuestViewing(data.allow_guest_viewing);
          setRequireApproval(data.require_approval);
          setAutoLockInactive(data.auto_lock_inactive);
        }
      } catch (error) {
        console.error('Error loading forum settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('forum_settings')
        .upsert({
          id: 1,
          allow_guest_viewing: allowGuestViewing,
          require_approval: requireApproval,
          auto_lock_inactive: autoLockInactive,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
        </div>

        <Button 
          onClick={handleSaveSettings} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </Card>
    </div>
  );
};

export default ForumSettings;