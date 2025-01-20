import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './AuthProvider';

interface ThemeContextType {
  currentTheme: any;
  setTheme: (themeId: string) => Promise<void>;
  resetToDefault: () => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME = {
  colors: {
    primary: '#000000',
    secondary: '#666666',
    accent: '#3b82f6',
    background: '#ffffff',
    text: '#000000'
  },
  typography: {
    primaryFont: 'system-ui, sans-serif',
    baseFontSize: '16px',
    lineHeight: '1.5',
    headingScale: '1.2'
  },
  spacing: {
    baseUnit: '4',
    containerPadding: '16',
    sectionSpacing: '64',
    gridGap: '16'
  },
  animations: {
    enabled: true,
    duration: 200,
    pageTransition: 'fade',
    hoverEffect: 'scale'
  },
  menu_style: {
    type: 'horizontal',
    position: 'top',
    itemSpacing: 16,
    showIcons: true
  },
  images: {
    defaultStyle: 'rounded',
    borderRadius: 8,
    logo: '',
    favicon: ''
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<any>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const loadActiveTheme = async () => {
    try {
      console.log('Loading active theme...', { isAuthenticated: !!user });
      setIsLoading(true);

      // First try to load the public theme
      const { data: publicTheme, error: publicError } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('is_active', true)
        .eq('is_admin_theme', false)
        .maybeSingle();

      if (publicError) {
        console.error('Error loading public theme:', publicError);
        setCurrentTheme(DEFAULT_THEME);
        applyTheme(DEFAULT_THEME);
        return;
      }

      if (publicTheme) {
        console.log('Active public theme found:', publicTheme);
        setCurrentTheme(publicTheme);
        applyTheme(publicTheme);
      } else {
        console.log('No active public theme found, using default theme');
        setCurrentTheme(DEFAULT_THEME);
        applyTheme(DEFAULT_THEME);
      }
    } catch (error: any) {
      console.error('Error in loadActiveTheme:', error);
      setCurrentTheme(DEFAULT_THEME);
      applyTheme(DEFAULT_THEME);
      toast.error('Failed to load theme settings. Using default theme.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActiveTheme();
  }, [user]); // Reload theme when auth state changes

  const applyTheme = (theme: any) => {
    const root = document.documentElement;
    
    // Apply colors
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]: [string, any]) => {
        root.style.setProperty(`--${key}`, value as string);
      });
    }

    // Apply typography
    if (theme.typography) {
      root.style.setProperty('--font-family', theme.typography.primaryFont);
      root.style.setProperty('--base-font-size', theme.typography.baseFontSize);
      root.style.setProperty('--line-height', theme.typography.lineHeight);
      root.style.setProperty('--heading-scale', theme.typography.headingScale);
    }

    // Apply spacing
    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value as string);
      });
    }

    // Apply animations
    if (theme.animations) {
      root.style.setProperty('--animation-enabled', theme.animations.enabled ? '1' : '0');
      root.style.setProperty('--animation-duration', `${theme.animations.duration}ms`);
      root.style.setProperty('--page-transition', theme.animations.pageTransition);
      root.style.setProperty('--hover-effect', theme.animations.hoverEffect);
    }

    // Apply menu styles
    if (theme.menu_style) {
      Object.entries(theme.menu_style).forEach(([key, value]) => {
        root.style.setProperty(`--menu-${key}`, value as string);
      });
    }
  };

  const setTheme = async (themeId: string) => {
    try {
      setIsLoading(true);
      console.log('Setting new theme:', themeId);
      
      const { data: newTheme, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('id', themeId)
        .maybeSingle();

      if (error) throw error;

      if (newTheme) {
        console.log('New theme applied:', newTheme);
        setCurrentTheme(newTheme);
        applyTheme(newTheme);
        toast.success('Theme applied successfully');
      } else {
        console.log('Theme not found, using default');
        setCurrentTheme(DEFAULT_THEME);
        applyTheme(DEFAULT_THEME);
        toast.error('Theme not found, using default');
      }
    } catch (error) {
      console.error('Error setting theme:', error);
      toast.error('Failed to apply theme');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = async () => {
    setCurrentTheme(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
    toast.success('Reset to default theme');
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, resetToDefault, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};