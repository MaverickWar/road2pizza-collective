import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ThemeContextType {
  currentTheme: any;
  setTheme: (themeId: string) => Promise<void>;
  resetToDefault: () => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME = {
  colors: {},
  typography: {
    primaryFont: 'system-ui, sans-serif',
    baseFontSize: '16px',
    lineHeight: '1.5'
  },
  spacing: {
    containerPadding: {
      sm: '1rem',
      md: '2rem',
      lg: '4rem'
    }
  },
  animations: {
    enabled: true,
    duration: 200
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActiveTheme();
  }, []);

  const loadActiveTheme = async () => {
    try {
      console.log('Loading active theme...');
      const { data: theme, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error loading theme:', error);
        throw error;
      }
      
      if (theme) {
        console.log('Active theme found:', theme);
        setCurrentTheme(theme);
        applyTheme(theme);
      } else {
        console.log('No active theme found, using default theme');
        setCurrentTheme(DEFAULT_THEME);
        applyTheme(DEFAULT_THEME);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      toast.error('Failed to load theme settings');
      // Apply default theme on error
      setCurrentTheme(DEFAULT_THEME);
      applyTheme(DEFAULT_THEME);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = (theme: any) => {
    const root = document.documentElement;
    
    // Apply colors
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]: [string, any]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            root.style.setProperty(`--${key}-${subKey}`, subValue as string);
          });
        } else {
          root.style.setProperty(`--${key}`, value as string);
        }
      });
    }

    // Apply typography
    if (theme.typography) {
      root.style.setProperty('--font-family', theme.typography.primaryFont);
      root.style.setProperty('--base-font-size', theme.typography.baseFontSize);
      root.style.setProperty('--line-height', theme.typography.lineHeight);
    }

    // Apply spacing
    if (theme.spacing) {
      Object.entries(theme.spacing.containerPadding).forEach(([key, value]) => {
        root.style.setProperty(`--container-padding-${key}`, value as string);
      });
    }

    // Apply animations
    if (theme.animations?.enabled) {
      root.style.setProperty('--animation-duration', `${theme.animations.duration}ms`);
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