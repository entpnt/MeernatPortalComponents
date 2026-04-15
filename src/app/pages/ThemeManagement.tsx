import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Palette, Check, Sparkles } from 'lucide-react';
import { usePrimaryColor, primaryColorOptions, PrimaryColorOption } from '@/contexts/PrimaryColorContext';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeManagement() {
  const { primaryColor, setPrimaryColor, currentColorValues } = usePrimaryColor();
  const { theme } = useTheme();

  return (
    <div className="p-6 min-h-screen">
      {/* Page Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-start gap-4 mb-3">
          <div className="p-3 bg-card border border-border rounded-lg">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">Theme Management</h1>
            <p className="text-muted-foreground max-w-2xl">
              Customize the primary brand color across your entire dashboard. Changes apply to buttons, links, active states, and highlights in both light and dark modes.
            </p>
          </div>
        </div>
      </div>

      {/* Current Selection Banner */}
      <div className="max-w-5xl mx-auto mb-8">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                style={{ backgroundColor: theme === 'light' ? currentColorValues.lightValue : currentColorValues.darkValue }}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{currentColorValues.name}</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{currentColorValues.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Currently Applied</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Color Options Grid */}
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Available Primary Colors</h2>
          <p className="text-sm text-muted-foreground">
            Choose from professionally curated color options that meet accessibility standards and work beautifully in both light and dark modes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(primaryColorOptions).map(([key, option]) => {
            const isActive = primaryColor === key;
            const colorValue = theme === 'light' ? option.lightValue : option.darkValue;
            const hoverValue = theme === 'light' ? option.lightHover : option.darkHover;
            
            return (
              <Card
                key={key}
                className={`relative bg-card border transition-all cursor-pointer ${
                  isActive 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setPrimaryColor(key as PrimaryColorOption)}
              >
                <div className="p-6">
                  {/* Color Preview */}
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className="w-20 h-20 rounded-lg border-2 border-border shadow-sm transition-all"
                      style={{ backgroundColor: colorValue }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{option.name}</h3>
                        {isActive && (
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Light Mode</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border border-border shadow-sm flex items-center justify-center"
                          style={{ backgroundColor: option.lightValue, color: option.lightForeground }}
                          title={`Background: ${option.lightValue}, Text: ${option.lightForeground}`}
                        >
                          <span className="text-xs font-bold">A</span>
                        </div>
                        <div 
                          className="w-8 h-8 rounded border border-border shadow-sm flex items-center justify-center"
                          style={{ backgroundColor: option.lightHover, color: option.lightForeground }}
                          title={`Hover: ${option.lightHover}, Text: ${option.lightForeground}`}
                        >
                          <span className="text-xs font-bold">A</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Dark Mode</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border border-border shadow-sm flex items-center justify-center"
                          style={{ backgroundColor: option.darkValue, color: option.darkForeground }}
                          title={`Background: ${option.darkValue}, Text: ${option.darkForeground}`}
                        >
                          <span className="text-xs font-bold">A</span>
                        </div>
                        <div 
                          className="w-8 h-8 rounded border border-border shadow-sm flex items-center justify-center"
                          style={{ backgroundColor: option.darkHover, color: option.darkForeground }}
                          title={`Hover: ${option.darkHover}, Text: ${option.darkForeground}`}
                        >
                          <span className="text-xs font-bold">A</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimaryColor(key as PrimaryColorOption);
                      }}
                      className="w-full"
                      style={
                        isActive
                          ? {
                              backgroundColor: colorValue,
                              color: theme === 'light' ? option.lightForeground : option.darkForeground,
                            }
                          : undefined
                      }
                      variant={isActive ? 'default' : 'outline'}
                    >
                      {isActive ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Applied
                        </>
                      ) : (
                        'Apply This Color'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-card border-border p-6">
          <h3 className="text-base font-semibold text-foreground mb-3">About Primary Color Customization</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">• Global Application:</strong> The selected primary color is applied consistently across all buttons, links, active navigation states, focus rings, and interactive elements throughout the dashboard.
            </p>
            <p>
              <strong className="text-foreground">• Accessibility Tested:</strong> All color options meet WCAG AA contrast requirements (4.5:1 minimum) and maintain clear differentiation from error, warning, and success states.
            </p>
            <p>
              <strong className="text-foreground">• Dynamic Text Contrast:</strong> Button text color automatically adjusts based on background luminance. Bright colors use dark text, while darker colors use light text for optimal readability.
            </p>
            <p>
              <strong className="text-foreground">• Light & Dark Support:</strong> Each color has been optimized for both light and dark mode with appropriate brightness adjustments to ensure consistent visibility across all themes.
            </p>
            <p>
              <strong className="text-foreground">• System Colors Unchanged:</strong> Error (red), warning (orange), and success (green) colors remain unchanged to maintain clear visual communication.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}