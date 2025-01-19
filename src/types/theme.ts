import { Json } from '@/integrations/supabase/types';

export interface AdminColors {
  admin: {
    DEFAULT: string;
    secondary: string;
    accent: string;
    muted: string;
    background: string;
    foreground: string;
    border: string;
    hover: {
      DEFAULT: string;
      secondary: string;
    };
  };
}

export interface ThemeData {
  id: string;
  name: string;
  is_active: boolean;
  colors: Record<string, string>;
  typography: Record<string, string>;
  spacing: Record<string, string>;
  images: Record<string, string>;
  menu_style: Record<string, any>;
  animations: Record<string, any>;
  admin_colors?: AdminColors;
  admin_menu?: Record<string, any>;
  is_admin_theme: boolean;
}

export interface RawThemeData {
  id: string;
  name: string;
  is_active: boolean;
  colors: Json;
  typography: Json;
  spacing: Json;
  images: Json;
  menu_style: Json;
  animations: Json;
  admin_colors?: Json;
  admin_menu?: Json;
  is_admin_theme: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

const isAdminColors = (json: Json): json is AdminColors => {
  if (typeof json !== 'object' || !json || Array.isArray(json)) return false;
  
  const adminData = (json as any).admin;
  if (!adminData || typeof adminData !== 'object') return false;

  const requiredFields = [
    'DEFAULT', 'secondary', 'accent', 'muted', 
    'background', 'foreground', 'border', 'hover'
  ];

  return requiredFields.every(field => field in adminData) &&
         typeof adminData.hover === 'object' &&
         'DEFAULT' in adminData.hover &&
         'secondary' in adminData.hover;
};

export const transformThemeData = (raw: RawThemeData): ThemeData => {
  return {
    id: raw.id,
    name: raw.name,
    is_active: raw.is_active,
    colors: raw.colors as Record<string, string>,
    typography: raw.typography as Record<string, string>,
    spacing: raw.spacing as Record<string, string>,
    images: raw.images as Record<string, string>,
    menu_style: raw.menu_style as Record<string, any>,
    animations: raw.animations as Record<string, any>,
    admin_colors: raw.admin_colors && isAdminColors(raw.admin_colors) 
      ? raw.admin_colors 
      : undefined,
    admin_menu: raw.admin_menu as Record<string, any>,
    is_admin_theme: raw.is_admin_theme
  };
};