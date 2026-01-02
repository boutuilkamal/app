import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark' | 'system';

type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => Promise<void>;
  colorScheme: Exclude<ColorSchemeName, null>;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const system = (Appearance.getColorScheme() || 'light') as Exclude<ColorSchemeName, null>;
  const colorScheme = theme === 'system' ? system : theme;

  React.useEffect(() => {
    AsyncStorage.getItem('theme').then((v) => {
      if (v === 'light' || v === 'dark' || v === 'system') setThemeState(v);
    });
    const sub = Appearance.addChangeListener(() => {
      // re-render when system theme changes
      setThemeState((t) => (t === 'system' ? 'system' : t));
    });
    return () => sub.remove();
  }, []);

  const setTheme = async (t: Theme) => {
    setThemeState(t);
    await AsyncStorage.setItem('theme', t);
  };

  const value = useMemo(() => ({ theme, setTheme, colorScheme }), [theme, colorScheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

