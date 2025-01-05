import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MenuItem } from "@/types/menu";

interface MenuItemFormProps {
  initialData?: MenuItem | null;
  onSubmit: (data: Partial<MenuItem>) => void;
  onCancel: () => void;
}

export function MenuItemForm({ initialData, onSubmit, onCancel }: MenuItemFormProps) {
  const [label, setLabel] = useState(initialData?.label || '');
  const [path, setPath] = useState(initialData?.path || '');
  const [icon, setIcon] = useState(initialData?.icon || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [requiresAdmin, setRequiresAdmin] = useState(initialData?.requires_admin || false);
  const [requiresStaff, setRequiresStaff] = useState(initialData?.requires_staff || false);
  const [isVisible, setIsVisible] = useState(initialData?.is_visible ?? true);
  const [displayOrder, setDisplayOrder] = useState(initialData?.display_order || 0);

  const handleBrowse = () => {
    const routes = [
      '/dashboard',
      '/dashboard/admin',
      '/dashboard/admin/menus',
      '/dashboard/admin/users',
      '/dashboard/profile',
    ];

    const route = window.prompt('Select or enter a route:', path);
    if (route) {
      setPath(route);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      label,
      path,
      icon,
      description,
      requires_admin: requiresAdmin,
      requires_staff: requiresStaff,
      is_visible: isVisible,
      display_order: displayOrder,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="path">Path</Label>
        <div className="flex gap-2">
          <Input
            id="path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            required
          />
          <Button type="button" onClick={handleBrowse}>
            Browse
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>
        <Input
          id="icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="e.g., home, settings, user"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayOrder">Display Order</Label>
        <Input
          id="displayOrder"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="requires-admin">Requires Admin</Label>
        <Switch
          id="requires-admin"
          checked={requiresAdmin}
          onCheckedChange={setRequiresAdmin}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="requires-staff">Requires Staff</Label>
        <Switch
          id="requires-staff"
          checked={requiresStaff}
          onCheckedChange={setRequiresStaff}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is-visible">Visible</Label>
        <Switch
          id="is-visible"
          checked={isVisible}
          onCheckedChange={setIsVisible}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}