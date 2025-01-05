export interface MenuGroup {
  id: string;
  name: string;
  description: string | null;
  identifier: string;
  created_at: string;
  created_by: string | null;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  menu_group_id: string;
  label: string;
  path: string;
  icon: string | null;
  description: string | null;
  parent_id: string | null;
  requires_admin: boolean;
  requires_staff: boolean;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  created_by: string | null;
  updated_at: string;
}