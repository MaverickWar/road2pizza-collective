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

export type RawThemeData = {
  id: string;
  name: string;
  is_active: boolean;
  colors: JSON;
  typography: JSON;
  spacing: JSON;
  images: JSON;
  menu_style: JSON;
  animations: JSON;
  admin_colors?: JSON;
  admin_menu?: JSON;
  is_admin_theme: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
};