import React, { createContext, useContext, useEffect, useState } from 'react';

export type PrimaryColorOption = 'indigo' | 'golden' | 'maroon' | 'slate' | 'blue' | 'orange' | 'green';

interface PrimaryColor {
  id: PrimaryColorOption;
  name: string;
  description: string;
  lightValue: string;
  darkValue: string;
  lightHover: string;
  darkHover: string;
  lightForeground: string;
  darkForeground: string;
}

/**
 * Calculate relative luminance of a hex color
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determine if a color needs dark or light text for accessibility
 * Returns dark text for bright backgrounds, light text for dark backgrounds
 */
function getContrastingTextColor(hexColor: string): string {
  const luminance = getLuminance(hexColor);
  // WCAG recommends 0.5 as the threshold for determining contrast
  // Bright colors (luminance > 0.5) need dark text
  // Dark colors (luminance <= 0.5) need light text
  return luminance > 0.5 ? '#0F172A' : '#FFFFFF';
}

export const primaryColorOptions: Record<PrimaryColorOption, PrimaryColor> = {
  indigo: {
    id: 'indigo',
    name: 'Deep Indigo',
    description: 'Professional indigo blue (Default)',
    lightValue: '#6366f1',
    darkValue: '#6366f1',
    lightHover: '#818cf8',
    darkHover: '#818cf8',
    lightForeground: '#FFFFFF',
    darkForeground: '#FFFFFF',
  },
  golden: {
    id: 'golden',
    name: 'Golden Amber',
    description: 'Warm golden yellow with excellent contrast',
    lightValue: '#d97706',
    darkValue: '#f59e0b',
    lightHover: '#b45309',
    darkHover: '#fbbf24',
    lightForeground: '#FFFFFF',
    darkForeground: '#0F172A', // Bright yellow needs dark text in dark mode
  },
  maroon: {
    id: 'maroon',
    name: 'Deep Maroon',
    description: 'Rich wine tone, distinct from error states',
    lightValue: '#881337',
    darkValue: '#be123c',
    lightHover: '#9f1239',
    darkHover: '#e11d48',
    lightForeground: '#FFFFFF',
    darkForeground: '#FFFFFF',
  },
  slate: {
    id: 'slate',
    name: 'Neutral Slate',
    description: 'Professional slate gray',
    lightValue: '#475569',
    darkValue: '#64748b',
    lightHover: '#334155',
    darkHover: '#94a3b8',
    lightForeground: '#FFFFFF',
    darkForeground: '#FFFFFF', // Medium gray needs white text in dark mode for contrast
  },
  blue: {
    id: 'blue',
    name: 'System Blue',
    description: 'Accessible primary blue, modern and professional',
    lightValue: '#0369a1',
    darkValue: '#0ea5e9',
    lightHover: '#0c4a6e',
    darkHover: '#38bdf8',
    lightForeground: '#FFFFFF',
    darkForeground: '#0F172A', // Bright blue needs dark text in dark mode
  },
  orange: {
    id: 'orange',
    name: 'Deep Orange',
    description: 'Vibrant brand orange, distinct from warning states',
    lightValue: '#c2410c',
    darkValue: '#f97316',
    lightHover: '#9a3412',
    darkHover: '#fb923c',
    lightForeground: '#FFFFFF',
    darkForeground: '#0F172A', // Bright orange needs dark text in dark mode
  },
  green: {
    id: 'green',
    name: 'Neutral Green',
    description: 'Professional emerald green, separate from success indicators',
    lightValue: '#047857',
    darkValue: '#10b981',
    lightHover: '#065f46',
    darkHover: '#34d399',
    lightForeground: '#FFFFFF',
    darkForeground: '#0F172A', // Bright green needs dark text in dark mode
  },
};

interface PrimaryColorContextType {
  primaryColor: PrimaryColorOption;
  setPrimaryColor: (color: PrimaryColorOption) => void;
  currentColorValues: PrimaryColor;
}

const PrimaryColorContext = createContext<PrimaryColorContextType | undefined>(undefined);

export function PrimaryColorProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState<PrimaryColorOption>(() => {
    // Check localStorage first
    const savedColor = localStorage.getItem('primaryColor') as PrimaryColorOption | null;
    if (savedColor && savedColor in primaryColorOptions) {
      return savedColor;
    }
    // Default to indigo
    return 'indigo';
  });

  useEffect(() => {
    // Apply primary color to CSS variables
    const root = document.documentElement;
    const colorConfig = primaryColorOptions[primaryColor];
    
    // Set the CSS variables for both light and dark modes
    root.style.setProperty('--primary-light', colorConfig.lightValue);
    root.style.setProperty('--primary-dark', colorConfig.darkValue);
    root.style.setProperty('--primary-light-hover', colorConfig.lightHover);
    root.style.setProperty('--primary-dark-hover', colorConfig.darkHover);
    root.style.setProperty('--primary-light-foreground', colorConfig.lightForeground);
    root.style.setProperty('--primary-dark-foreground', colorConfig.darkForeground);
    
    // Save to localStorage
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  const setPrimaryColor = (newColor: PrimaryColorOption) => {
    setPrimaryColorState(newColor);
  };

  const currentColorValues = primaryColorOptions[primaryColor];

  return (
    <PrimaryColorContext.Provider value={{ primaryColor, setPrimaryColor, currentColorValues }}>
      {children}
    </PrimaryColorContext.Provider>
  );
}

export function usePrimaryColor() {
  const context = useContext(PrimaryColorContext);
  if (context === undefined) {
    throw new Error('usePrimaryColor must be used within a PrimaryColorProvider');
  }
  return context;
}