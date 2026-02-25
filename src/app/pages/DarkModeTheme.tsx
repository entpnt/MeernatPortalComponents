import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Palette, Moon, Sun, Sparkles, Check, Zap, CreditCard, RotateCcw, X } from 'lucide-react';
import exampleImage from 'figma:asset/52d84a81fcb3cf772fc41ecb2ff61137a6c2e89b.png';
import asanaImage1 from 'figma:asset/1941df7495f22f9d328b16b7b622f0964a2231bc.png';
import asanaImage2 from 'figma:asset/2bad180500e3f9d17548a8d34e5e7a4db07793be.png';
import analyticsImage from 'figma:asset/1967ba21808d2ec518b6538c45cea4a135fffae9.png';
import { useThemePreview, Theme } from '@/contexts/ThemePreviewContext';

// Theme Variation 1: Charcoal Slate (inspired by Stripe dashboard)
const charcoalTheme: Theme = {
  name: 'Charcoal Slate',
  description: 'Deep charcoal with purple accents',
  colors: {
    background: '#0f1419',
    foreground: '#e3e8ef',
    card: '#1a1f26',
    cardForeground: '#e3e8ef',
    popover: '#1a1f26',
    popoverForeground: '#e3e8ef',
    primary: '#8b5cf6', // Purple
    primaryForeground: '#ffffff',
    secondary: '#252b33',
    secondaryForeground: '#e3e8ef',
    muted: '#1e2329',
    mutedForeground: '#9ca3af',
    accent: '#a78bfa',
    accentForeground: '#ffffff',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#252b33',
    input: '#252b33',
    ring: '#8b5cf6',
    sidebar: '#1a1f26', // Lighter gray than background for contrast
  },
};

// Theme Variation 2: Dark Slate Ember (inspired by Asana)
const emberTheme: Theme = {
  name: 'Dark Slate Ember',
  description: 'Rich dark slate with warm orange/coral accents',
  colors: {
    background: '#1f1f1f',
    foreground: '#ffffff',
    card: '#2e2e2e',
    cardForeground: '#ffffff',
    popover: '#2e2e2e',
    popoverForeground: '#ffffff',
    primary: '#ff6b4a', // Warm orange/coral
    primaryForeground: '#ffffff',
    secondary: '#353535',
    secondaryForeground: '#ffffff',
    muted: '#3a3a3a',
    mutedForeground: '#9ca3af',
    accent: '#f06a4d',
    accentForeground: '#ffffff',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#3a3a3a',
    input: '#3a3a3a',
    ring: '#ff6b4a',
    sidebar: '#2e2e2e', // Lighter gray than background for contrast (same as card)
  },
};

// Theme Variation 3: Midnight Spectrum (inspired by analytics dashboard)
const spectrumTheme: Theme = {
  name: 'Midnight Spectrum',
  description: 'Ultra-dark background with vibrant cyan/blue accents',
  colors: {
    background: '#0f0f0f',
    foreground: '#ffffff',
    card: '#1a1a1a',
    cardForeground: '#ffffff',
    popover: '#1a1a1a',
    popoverForeground: '#ffffff',
    primary: '#00d4ff', // Bright cyan
    primaryForeground: '#0a0a0a', // Near-black for better contrast
    secondary: '#252525',
    secondaryForeground: '#ffffff',
    muted: '#2a2a2a',
    mutedForeground: '#888888',
    accent: '#0ea5e9',
    accentForeground: '#ffffff',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#2a2a2a',
    input: '#2a2a2a',
    ring: '#00d4ff',
    sidebar: '#1c1c1c', // Lighter gray than background for contrast
  },
};

// Theme Variation 4: Deep Indigo (inspired by modern analytics platforms)
const indigoTheme: Theme = {
  name: 'Deep Indigo',
  description: 'Nearly black sidebar with indigo accents',
  colors: {
    background: '#1a1a1a',
    foreground: '#ffffff',
    card: '#212121',
    cardForeground: '#ffffff',
    popover: '#212121',
    popoverForeground: '#ffffff',
    primary: '#6366f1', // Vibrant indigo
    primaryForeground: '#ffffff',
    secondary: '#2a2a2a',
    secondaryForeground: '#ffffff',
    muted: '#2e2e2e',
    mutedForeground: '#9ca3af',
    accent: '#818cf8',
    accentForeground: '#ffffff',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#2e2e2e',
    input: '#2e2e2e',
    ring: '#6366f1',
    sidebar: '#0d0d0d', // Much darker than background - almost black
  },
};

export function DarkModeTheme() {
  const { activeTheme, isPreviewMode, setActiveTheme, setPreviewMode, resetTheme } = useThemePreview();

  // Handle preview - temporary theme application
  const handlePreview = (theme: Theme) => {
    setActiveTheme(theme);
    setPreviewMode(true);
  };

  // Handle apply - permanent theme selection
  const handleApply = (theme: Theme) => {
    setActiveTheme(theme);
    setPreviewMode(false);
  };

  // Get the current status text
  const getStatusText = () => {
    if (!activeTheme) return 'Default Dark Mode';
    if (isPreviewMode) return `Previewing: ${activeTheme.name}`;
    return `Active: ${activeTheme.name}`;
  };

  return (
    <div className="h-full bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Palette className="w-8 h-8 text-primary" />
            Dark Mode Theme
          </h1>
          <p className="text-muted-foreground mt-2">
            Experiment with different dark mode variations and color schemes
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2 text-sm">
          <Moon className="w-4 h-4 mr-2" />
          Theme Laboratory
        </Badge>
      </div>

      {/* Active Theme Banner */}
      {activeTheme && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {isPreviewMode ? 'Preview Mode Active' : 'Theme Applied'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Currently viewing: <strong className="text-foreground">{activeTheme.name}</strong>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {isPreviewMode && (
                  <Button 
                    size="sm" 
                    onClick={() => handleApply(activeTheme)}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Apply This Theme
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetTheme}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Dark Mode Status</CardTitle>
          <CardDescription>
            This page is designed to help you test and compare different dark mode themes before implementing them across the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Active Theme</p>
                <p className="text-sm text-muted-foreground">
                  {getStatusText()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Background</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-background border-2 border-border rounded"></div>
                <code className="text-xs font-mono text-foreground">
                  {activeTheme?.colors.background || 'var(--background)'}
                </code>
              </div>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Primary</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded"></div>
                <code className="text-xs font-mono text-foreground">
                  {activeTheme?.colors.primary || 'var(--primary)'}
                </code>
              </div>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Foreground</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-foreground border border-border rounded"></div>
                <code className="text-xs font-mono text-foreground">
                  {activeTheme?.colors.foreground || 'var(--foreground)'}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Variations Section */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Variations</CardTitle>
          <CardDescription>
            Click Preview to temporarily test a theme, or Apply to set it as active. Each variation will transform the entire page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="variations" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="variations">Variations</TabsTrigger>
              <TabsTrigger value="colors">Color Palette</TabsTrigger>
              <TabsTrigger value="components">Component Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="variations" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Variation 1: Charcoal Slate */}
                <div 
                  className="p-0 border-2 rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                  style={{ 
                    borderColor: activeTheme?.name === charcoalTheme.name ? charcoalTheme.colors.primary : 'var(--border)',
                    background: activeTheme?.name === charcoalTheme.name ? 'linear-gradient(to bottom right, #6366f1, #4f46e5)' : 'transparent' 
                  }}
                >
                  <div className="p-1">
                    <div className="rounded-md overflow-hidden" style={{ backgroundColor: charcoalTheme.colors.background }}>
                      {/* Mini Preview */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" style={{ color: charcoalTheme.colors.primary }} />
                            <span className="text-xs font-semibold" style={{ color: charcoalTheme.colors.foreground }}>
                              {charcoalTheme.name}
                            </span>
                          </div>
                          {activeTheme?.name === charcoalTheme.name && (
                            <Check className="w-4 h-4" style={{ color: charcoalTheme.colors.primary }} />
                          )}
                        </div>
                        
                        {/* Color Swatches */}
                        <div className="grid grid-cols-4 gap-2">
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: charcoalTheme.colors.background }}
                            title="Background"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: charcoalTheme.colors.card }}
                            title="Card"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: charcoalTheme.colors.primary }}
                            title="Primary"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: charcoalTheme.colors.accent }}
                            title="Accent"
                          />
                        </div>

                        {/* Mini Cards Preview */}
                        <div className="space-y-2">
                          <div 
                            className="p-3 rounded-lg" 
                            style={{ backgroundColor: charcoalTheme.colors.card }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="w-3 h-3" style={{ color: charcoalTheme.colors.primary }} />
                              <span className="text-xs font-medium" style={{ color: charcoalTheme.colors.foreground }}>
                                Card Example
                              </span>
                            </div>
                            <div className="text-xs" style={{ color: charcoalTheme.colors.mutedForeground }}>
                              Deep charcoal with vibrant accents
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <div 
                              className="flex-1 px-3 py-2 rounded text-center text-xs font-medium"
                              style={{ 
                                backgroundColor: charcoalTheme.colors.primary,
                                color: charcoalTheme.colors.primaryForeground 
                              }}
                            >
                              Primary
                            </div>
                            <div 
                              className="flex-1 px-3 py-2 rounded text-center text-xs font-medium"
                              style={{ 
                                backgroundColor: charcoalTheme.colors.secondary,
                                color: charcoalTheme.colors.secondaryForeground 
                              }}
                            >
                              Secondary
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Area */}
                      <div className="p-3 border-t" style={{ borderColor: charcoalTheme.colors.border }}>
                        <p className="text-xs mb-2" style={{ color: charcoalTheme.colors.mutedForeground }}>
                          {charcoalTheme.description}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => handlePreview(charcoalTheme)}
                          >
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => handleApply(charcoalTheme)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variation 2: Dark Slate Ember */}
                <div 
                  className="p-0 border-2 rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                  style={{ 
                    borderColor: activeTheme?.name === emberTheme.name ? emberTheme.colors.primary : 'var(--border)',
                    background: activeTheme?.name === emberTheme.name ? 'linear-gradient(to bottom right, #ff6b4a, #f06a4d)' : 'transparent' 
                  }}
                >
                  <div className="p-1">
                    <div className="rounded-md overflow-hidden" style={{ backgroundColor: emberTheme.colors.background }}>
                      {/* Mini Preview */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" style={{ color: emberTheme.colors.primary }} />
                            <span className="text-xs font-semibold" style={{ color: emberTheme.colors.foreground }}>
                              {emberTheme.name}
                            </span>
                          </div>
                          {activeTheme?.name === emberTheme.name && (
                            <Check className="w-4 h-4" style={{ color: emberTheme.colors.primary }} />
                          )}
                        </div>
                        
                        {/* Color Swatches */}
                        <div className="grid grid-cols-4 gap-2">
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: emberTheme.colors.background }}
                            title="Background"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: emberTheme.colors.card }}
                            title="Card"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: emberTheme.colors.primary }}
                            title="Primary"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: emberTheme.colors.accent }}
                            title="Accent"
                          />
                        </div>

                        {/* Mini Cards Preview */}
                        <div className="space-y-2">
                          <div 
                            className="p-3 rounded-lg" 
                            style={{ backgroundColor: emberTheme.colors.card }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="w-3 h-3" style={{ color: emberTheme.colors.primary }} />
                              <span className="text-xs font-medium" style={{ color: emberTheme.colors.foreground }}>
                                Card Example
                              </span>
                            </div>
                            <div className="text-xs" style={{ color: emberTheme.colors.mutedForeground }}>
                              Rich dark slate with warm accents
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <div 
                              className="flex-1 px-3 py-2 rounded text-center text-xs font-medium"
                              style={{ 
                                backgroundColor: emberTheme.colors.primary,
                                color: emberTheme.colors.primaryForeground 
                              }}
                            >
                              Primary
                            </div>
                            <div 
                              className="flex-1 px-3 py-2 rounded text-center text-xs font-medium"
                              style={{ 
                                backgroundColor: emberTheme.colors.secondary,
                                color: emberTheme.colors.secondaryForeground 
                              }}
                            >
                              Secondary
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Area */}
                      <div className="p-3 border-t" style={{ borderColor: emberTheme.colors.border }}>
                        <p className="text-xs mb-2" style={{ color: emberTheme.colors.mutedForeground }}>
                          {emberTheme.description}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => handlePreview(emberTheme)}
                          >
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => handleApply(emberTheme)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variation 3: Midnight Spectrum */}
                <div 
                  className="p-0 border-2 rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                  style={{ 
                    borderColor: activeTheme?.name === spectrumTheme.name ? spectrumTheme.colors.primary : 'var(--border)',
                    background: activeTheme?.name === spectrumTheme.name ? 'linear-gradient(to bottom right, #00d4ff, #0ea5e9)' : 'transparent' 
                  }}
                >
                  <div className="p-1">
                    <div className="rounded-md overflow-hidden" style={{ backgroundColor: spectrumTheme.colors.background }}>
                      {/* Mini Preview */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" style={{ color: spectrumTheme.colors.primary }} />
                            <span className="text-xs font-semibold" style={{ color: spectrumTheme.colors.foreground }}>
                              {spectrumTheme.name}
                            </span>
                          </div>
                          {activeTheme?.name === spectrumTheme.name && (
                            <Check className="w-4 h-4" style={{ color: spectrumTheme.colors.primary }} />
                          )}
                        </div>
                        
                        {/* Color Swatches */}
                        <div className="grid grid-cols-4 gap-2">
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: spectrumTheme.colors.background }}
                            title="Background"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: spectrumTheme.colors.card }}
                            title="Card"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: spectrumTheme.colors.primary }}
                            title="Primary"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: spectrumTheme.colors.accent }}
                            title="Accent"
                          />
                        </div>

                        {/* Mini Cards Preview */}
                        <div className="space-y-2">
                          <div 
                            className="p-3 rounded-lg" 
                            style={{ backgroundColor: spectrumTheme.colors.card }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="w-3 h-3" style={{ color: spectrumTheme.colors.primary }} />
                              <span className="text-xs font-medium" style={{ color: spectrumTheme.colors.foreground }}>
                                Card Example
                              </span>
                            </div>
                            <div className="text-xs" style={{ color: spectrumTheme.colors.mutedForeground }}>
                              Ultra-dark with vibrant accents
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <div 
                              className="flex-1 px-3 py-2 rounded text-center text-xs font-medium"
                              style={{ 
                                backgroundColor: spectrumTheme.colors.primary,
                                color: spectrumTheme.colors.primaryForeground 
                              }}
                            >
                              Primary
                            </div>
                            <div 
                              className="flex-1 px-3 py-2 rounded text-center text-xs font-medium"
                              style={{ 
                                backgroundColor: spectrumTheme.colors.secondary,
                                color: spectrumTheme.colors.secondaryForeground 
                              }}
                            >
                              Secondary
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Area */}
                      <div className="p-3 border-t" style={{ borderColor: spectrumTheme.colors.border }}>
                        <p className="text-xs mb-2" style={{ color: spectrumTheme.colors.mutedForeground }}>
                          {spectrumTheme.description}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => handlePreview(spectrumTheme)}
                          >
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => handleApply(spectrumTheme)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variation 4: Deep Indigo */}
                <div 
                  className="p-0 border-2 rounded-lg overflow-hidden hover:border-primary transition-colors cursor-pointer"
                  style={{ 
                    borderColor: activeTheme?.name === indigoTheme.name ? indigoTheme.colors.primary : 'var(--border)',
                    background: activeTheme?.name === indigoTheme.name ? 'linear-gradient(to bottom right, #6366f1, #818cf8)' : 'transparent' 
                  }}
                >
                  <div className="p-1">
                    <div className="rounded-md overflow-hidden" style={{ backgroundColor: indigoTheme.colors.background }}>
                      {/* Mini Preview */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" style={{ color: indigoTheme.colors.primary }} />
                            <span className="text-xs font-semibold" style={{ color: indigoTheme.colors.foreground }}>
                              {indigoTheme.name}
                            </span>
                          </div>
                          {activeTheme?.name === indigoTheme.name && (
                            <Check className="w-4 h-4" style={{ color: indigoTheme.colors.primary }} />
                          )}
                        </div>
                        
                        {/* Color Swatches */}
                        <div className="grid grid-cols-4 gap-2">
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: indigoTheme.colors.background }}
                            title="Background"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: indigoTheme.colors.card }}
                            title="Card"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: indigoTheme.colors.primary }}
                            title="Primary"
                          />
                          <div 
                            className="h-8 rounded" 
                            style={{ backgroundColor: indigoTheme.colors.accent }}
                            title="Accent"
                          />
                        </div>

                        {/* Mini Cards Preview */}
                        <div className="space-y-2">
                          <div 
                            className="p-3 rounded-lg" 
                            style={{ backgroundColor: indigoTheme.colors.card }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="w-3 h-3" style={{ color: indigoTheme.colors.primary }} />
                              <span className="text-xs font-medium" style={{ color: indigoTheme.colors.foreground }}>
                                Card Example
                              </span>
                            </div>
                            <div className="text-xs" style={{ color: indigoTheme.colors.mutedForeground }}>
                              Nearly black with indigo accents
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <div 
                              className="flex-1 px-3 py-2 rounded text-center text-xs font-medium"
                              style={{ 
                                backgroundColor: indigoTheme.colors.primary,
                                color: indigoTheme.colors.primaryForeground 
                              }}
                            >
                              Primary
                            </div>
                            <div 
                              className="flex-1 px-3 py-2 rounded text-center text-xs font-medium"
                              style={{ 
                                backgroundColor: indigoTheme.colors.secondary,
                                color: indigoTheme.colors.secondaryForeground 
                              }}
                            >
                              Secondary
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Area */}
                      <div className="p-3 border-t" style={{ borderColor: indigoTheme.colors.border }}>
                        <p className="text-xs mb-2" style={{ color: indigoTheme.colors.mutedForeground }}>
                          {indigoTheme.description}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => handlePreview(indigoTheme)}
                          >
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 text-xs"
                            onClick={() => handleApply(indigoTheme)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reference Image & Note */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Theme 1: Charcoal Slate</CardTitle>
                      <CardDescription>
                        Modern dashboard with purple/indigo accents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={exampleImage} 
                        alt="Charcoal Slate reference design" 
                        className="w-full rounded-lg border border-border"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Theme 2: Dark Slate Ember</CardTitle>
                      <CardDescription>
                        Asana-inspired with warm orange/coral accents
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <img 
                        src={asanaImage1} 
                        alt="Dark Slate Ember reference design - Dashboard" 
                        className="w-full rounded-lg border border-border"
                      />
                      <img 
                        src={asanaImage2} 
                        alt="Dark Slate Ember reference design - Tasks" 
                        className="w-full rounded-lg border border-border"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Theme 3: Midnight Spectrum</CardTitle>
                      <CardDescription>
                        Analytics-inspired with vibrant cyan accents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={analyticsImage} 
                        alt="Midnight Spectrum reference design - Analytics Dashboard" 
                        className="w-full rounded-lg border border-border"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> All three theme variations are based on modern dashboard designs. 
                    Each variation can be previewed and applied to instantly transform the entire application's appearance.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Base Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Background</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-background border-2 border-border rounded"></div>
                        <code className="text-xs font-mono">background</code>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Foreground</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-foreground rounded"></div>
                        <code className="text-xs font-mono">foreground</code>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Card</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-card border border-border rounded"></div>
                        <code className="text-xs font-mono">card</code>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Popover</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-popover border border-border rounded"></div>
                        <code className="text-xs font-mono">popover</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Accent Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Primary</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded"></div>
                        <code className="text-xs font-mono">primary</code>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Secondary</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-secondary rounded"></div>
                        <code className="text-xs font-mono">secondary</code>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Muted</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-muted rounded"></div>
                        <code className="text-xs font-mono">muted</code>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Accent</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-accent rounded"></div>
                        <code className="text-xs font-mono">accent</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="components" className="space-y-4 mt-6">
              <div className="space-y-6">
                {/* Button Samples */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Buttons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>Default Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                {/* Badge Samples */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Badges</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge>Default Badge</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                {/* Card Sample */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Cards</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Sample Card</CardTitle>
                      <CardDescription>This is how cards appear in the current theme</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Card content with text demonstrating foreground and muted text colors.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            1. <strong className="text-foreground">Preview:</strong> Click "Preview" to temporarily test a theme variation on this entire page
          </p>
          <p>
            2. <strong className="text-foreground">Apply:</strong> Click "Apply" to set the theme as active (you can still reset it)
          </p>
          <p>
            3. <strong className="text-foreground">Compare:</strong> Switch between variations to see which works best for your needs
          </p>
          <p>
            4. <strong className="text-foreground">Reset:</strong> Use the "Reset to Default" button to return to the original dark mode
          </p>
        </CardContent>
      </Card>
    </div>
  );
}