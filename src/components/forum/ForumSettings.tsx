import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ForumSettings as ForumSettingsType } from './types';
import { Card } from '@/components/ui/card';

const ForumSettings = () => {
  const [settings, setSettings] = useState<ForumSettingsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('Fetching forum settings...');
      const { data, error } = await supabase
        .from('forum_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      console.log('Fetched settings:', data);
      setSettings(data as ForumSettingsType);
    } catch (error) {
      console.error('Error in fetchSettings:', error);
      toast.error('Failed to load forum settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof Omit<ForumSettingsType, 'id' | 'created_at' | 'updated_at'>, value: boolean) => {
    try {
      console.log('Updating setting:', key, value);
      const { error } = await supabase
        .from('forum_settings')
        .update({ [key]: value })
        .eq('id', settings?.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, [key]: value } : null);
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-secondary/50 animate-pulse rounded-lg"></div>
        <div className="h-12 bg-secondary/50 animate-pulse rounded-lg"></div>
        <div className="h-12 bg-secondary/50 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">Allow Guest Viewing</h3>
          <p className="text-sm text-muted-foreground">
            Allow non-registered users to view forum content
          </p>
        </div>
        <Switch
          checked={settings?.allow_guest_viewing || false}
          onCheckedChange={(checked) => updateSetting('allow_guest_viewing', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">Require Approval</h3>
          <p className="text-sm text-muted-foreground">
            Require moderator approval for new threads
          </p>
        </div>
        <Switch
          checked={settings?.require_approval || false}
          onCheckedChange={(checked) => updateSetting('require_approval', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-medium">Auto-lock Inactive Threads</h3>
          <p className="text-sm text-muted-foreground">
            Automatically lock threads after 30 days of inactivity
          </p>
        </div>
        <Switch
          checked={settings?.auto_lock_inactive || false}
          onCheckedChange={(checked) => updateSetting('auto_lock_inactive', checked)}
        />
      </div>
    </Card>
  );
};

export default ForumSettings;