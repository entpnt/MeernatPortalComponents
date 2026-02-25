import React, { createContext, useContext, useState, ReactNode } from 'react';

// Theme type definition
export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  sidebar?: string; // Optional darker sidebar color for depth
}

export interface Theme {
  name: string;
  description: string;
  colors: ThemeColors;
}

interface ThemePreviewContextType {
  activeTheme: Theme | null;
  isPreviewMode: boolean;
  setActiveTheme: (theme: Theme | null) => void;
  setPreviewMode: (isPreview: boolean) => void;
  resetTheme: () => void;
}

const ThemePreviewContext = createContext<ThemePreviewContextType | undefined>(undefined);

export function ThemePreviewProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [isPreviewMode, setPreviewMode] = useState(false);

  const resetTheme = () => {
    setActiveTheme(null);
    setPreviewMode(false);
  };

  return (
    <ThemePreviewContext.Provider
      value={{
        activeTheme,
        isPreviewMode,
        setActiveTheme,
        setPreviewMode,
        resetTheme,
      }}
    >
      {children}
    </ThemePreviewContext.Provider>
  );
}

export function useThemePreview() {
  const context = useContext(ThemePreviewContext);
  if (context === undefined) {
    throw new Error('useThemePreview must be used within a ThemePreviewProvider');
  }
  return context;
}