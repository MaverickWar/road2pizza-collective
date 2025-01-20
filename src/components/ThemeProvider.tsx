import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { themeMonitor } from '@/services/ThemeMonitoringService';

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
  },
  admin_colors: {
    admin: {
      DEFAULT: '249 115 22',
      secondary: '234 88 12',
      accent: '249 115 22',
      muted: '120 113 108',
      background: '249 250 251',
      foreground: '41 37 36',
      border: '229 231 235',
      hover: {
        DEFAULT: '234 88 12',
        secondary: '217 70 0'
      }
    }
  },
  admin_menu: {
    type: 'vertical',
    position: 'left',
    itemSpacing: 16,
    showIcons: true,
    items: []
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    loadActiveTheme();
  }, []);

  const loadActiveTheme = async () => {
    try {
      console.log('Loading active theme...');
      const startTime = performance.now();
      
      const { data: theme, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      const duration = performance.now() - startTime;

      if (error) {
        console.error('Error loading theme:', error);
        await themeMonitor.logThemeError({
          ...error,
          method: 'GET',
          url: `${supabase.supabaseUrl}/rest/v1/theme_settings`,
          error_type: 'theme_fetch_error'
        });

        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(loadActiveTheme, 1000 * (retryCount + 1));
          return;
        }
        
        throw error;
      }
      
      // Log successful theme load
      await supabase.from('analytics_metrics').insert({
        metric_name: 'theme_load_success',
        metric_value: duration,
        response_time: duration,
        endpoint_path: '/rest/v1/theme_settings',
        http_status: 200
      });
      
      if (theme) {
        console.log('Active theme found:', theme);
        setCurrentTheme(theme);
        applyTheme(theme);
      } else {
        console.log('No active theme found, using default theme');
        setCurrentTheme(DEFAULT_THEME);
        applyTheme(DEFAULT_THEME);
      }
    } catch (error: any) {
      console.error('Error loading theme:', error);
      await themeMonitor.logThemeError(error);
      toast.error('Failed to load theme settings');
      setCurrentTheme(DEFAULT_THEME);
      applyTheme(DEFAULT_THEME);
    } finally {
      setIsLoading(false);
      setRetryCount(0);
    }
  };

  const applyTheme = (theme: any) => {
    const root = document.documentElement;
    
    // Apply colors
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]: [string, any]) => {
        root.style.setProperty(`--${key}`, value as string);
      });
    }

    // Apply admin colors if present
    if (theme.admin_colors?.admin) {
      Object.entries(theme.admin_colors.admin).forEach(([key, value]: [string, any]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            root.style.setProperty(`--admin-${key}-${subKey}`, subValue as string);
          });
        } else {
          root.style.setProperty(`--admin-${key}`, value as string);
        }
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

    // Apply admin menu styles
    if (theme.admin_menu) {
      Object.entries(theme.admin_menu).forEach(([key, value]) => {
        if (key !== 'items') {
          root.style.setProperty(`--admin-menu-${key}`, value as string);
        }
      });
    }

    // Apply image styles and logos
    if (theme.images) {
      Object.entries(theme.images).forEach(([key, value]) => {
        root.style.setProperty(`--image-${key}`, value as string);
      });
    }

    // Apply logos
    if (theme.site_logo_url) {
      root.style.setProperty('--site-logo', `url(${theme.site_logo_url})`);
    }
    if (theme.admin_logo_url) {
      root.style.setProperty('--admin-logo', `url(${theme.admin_logo_url})`);
    }
  };

  const setTheme = async (themeId: string) => {
    try {
      setIsLoading(true);
      console.log('Setting new theme:', themeId);
      
      // Deactivate current theme
      await supabase
        .from('theme_settings')
        .update({ is_active: false })
        .eq('is_active', true);

      // Activate new theme
      const { data: newTheme, error } = await supabase
        .from('theme_settings')
        .update({ is_active: true })
        .eq('id', themeId)
        .select()
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
    try {
      setIsLoading(true);
      console.log('Resetting to default theme');
      
      const { data: defaultTheme, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('name', 'Default Theme')
        .maybeSingle();

      if (error) throw error;

      if (defaultTheme) {
        await setTheme(defaultTheme.id);
        toast.success('Reset to default theme');
      } else {
        console.log('Default theme not found, using fallback');
        setCurrentTheme(DEFAULT_THEME);
        applyTheme(DEFAULT_THEME);
        toast.info('Using system default theme');
      }
    } catch (error) {
      console.error('Error resetting theme:', error);
      toast.error('Failed to reset theme');
    } finally {
      setIsLoading(false);
    }
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
