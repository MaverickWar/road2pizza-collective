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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActiveTheme();
  }, []);

  const loadActiveTheme = async () => {
    try {
      const { data: theme, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      if (theme) {
        setCurrentTheme(theme);
        applyTheme(theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      toast.error('Failed to load theme settings');
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
      root.style.setProperty('--base-font-size', `${theme.typography.baseFontSize}px`);
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
        .single();

      if (error) throw error;

      setCurrentTheme(newTheme);
      applyTheme(newTheme);
      toast.success('Theme applied successfully');
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
      
      const { data: defaultTheme, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('name', 'Default Theme')
        .single();

      if (error) throw error;

      await setTheme(defaultTheme.id);
      toast.success('Reset to default theme');
    } catch (error) {
      console.error('Error resetting theme:', error);
      toast.error('Failed to reset theme');
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