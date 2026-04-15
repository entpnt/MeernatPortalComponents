import { useState, useEffect } from 'react';
import { Sidebar } from '@/app/components/Sidebar';
import { TopBar } from '@/app/components/TopBar';
import { SubscriptionsContent } from '@/app/pages/SubscriptionsContent';
import { DashboardContent } from '@/app/pages/DashboardContent';
import { GenericContent } from '@/app/components/GenericContent';
import { PendingSubscriptionsContent } from '@/app/components/PendingSubscriptionsContent';
import { CancelledSubscriptionsContent } from '@/app/components/CancelledSubscriptionsContent';
import { OnboardingContent } from '@/app/components/OnboardingContent';
import { AllSubscribersContent } from '@/app/components/AllSubscribersContent';
import { CommunicationsPage } from '@/app/components/communications/CommunicationsPage';
import { SettingsContent } from '@/app/components/SettingsContent';
import { VendorManagement } from '@/app/components/VendorManagement';
import { NetworkManagement } from '@/app/components/NetworkManagement';
import { AnalyticsContent } from '@/app/components/AnalyticsContent';
import { DevicesContent } from '@/app/components/DevicesContent';
import { BillingOverview } from '@/app/pages/BillingOverview';
import { BillingQueue } from '@/app/pages/BillingQueue';
import { ManualReview } from '@/app/pages/ManualReview';
import { SubscriberHistory } from '@/app/pages/SubscriberHistory';
import { BillingPromotions } from '@/app/pages/BillingPromotions';
import { MarketingOverview } from '@/app/pages/MarketingOverview';
import { ReadyAddresses } from '@/app/pages/ReadyAddresses';
import { AlertsContent } from '@/app/pages/AlertsContent';
import { ManageContent } from '@/app/components/ManageContent';
import { OperatorContent } from '@/app/components/OperatorContent';
import { ProvidersContent } from '@/app/components/ProvidersContent';
import { PlansServicesContent } from '@/app/components/PlansServicesContent';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PrimaryColorProvider } from '@/contexts/PrimaryColorContext';
import { ThemePreviewProvider, useThemePreview } from '@/contexts/ThemePreviewContext';
import { ThemeManagement } from '@/app/pages/ThemeManagement';

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { activeTheme } = useThemePreview();

  // Apply theme CSS variables dynamically via style tag for proper override
  useEffect(() => {
    if (!activeTheme) {
      // Remove any existing theme override
      const existingStyle = document.getElementById('theme-preview-override');
      if (existingStyle) {
        existingStyle.remove();
      }
      return;
    }

    // Create or update style tag with theme variables
    let styleTag = document.getElementById('theme-preview-override') as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'theme-preview-override';
      document.head.appendChild(styleTag);
    }

    // Generate CSS with !important to override theme.css
    styleTag.textContent = `
      .dark {
        --background: ${activeTheme.colors.background} !important;
        --foreground: ${activeTheme.colors.foreground} !important;
        --card: ${activeTheme.colors.card} !important;
        --card-foreground: ${activeTheme.colors.cardForeground} !important;
        --popover: ${activeTheme.colors.popover} !important;
        --popover-foreground: ${activeTheme.colors.popoverForeground} !important;
        --primary: ${activeTheme.colors.primary} !important;
        --primary-foreground: ${activeTheme.colors.primaryForeground} !important;
        --secondary: ${activeTheme.colors.secondary} !important;
        --secondary-foreground: ${activeTheme.colors.secondaryForeground} !important;
        --muted: ${activeTheme.colors.muted} !important;
        --muted-foreground: ${activeTheme.colors.mutedForeground} !important;
        --accent: ${activeTheme.colors.accent} !important;
        --accent-foreground: ${activeTheme.colors.accentForeground} !important;
        --destructive: ${activeTheme.colors.destructive} !important;
        --destructive-foreground: ${activeTheme.colors.destructiveForeground} !important;
        --border: ${activeTheme.colors.border} !important;
        --divider: ${activeTheme.colors.border} !important;
        --input: ${activeTheme.colors.input} !important;
        --input-background: ${activeTheme.colors.muted} !important;
        --ring: ${activeTheme.colors.ring} !important;
        --sidebar: ${activeTheme.colors.sidebar || activeTheme.colors.card} !important;
        --sidebar-foreground: ${activeTheme.colors.foreground} !important;
        --sidebar-border: ${activeTheme.colors.border} !important;
        --sidebar-accent: ${activeTheme.colors.secondary} !important;
        --sidebar-accent-foreground: ${activeTheme.colors.foreground} !important;
        --sidebar-primary: ${activeTheme.colors.primary} !important;
        --sidebar-primary-foreground: ${activeTheme.colors.primaryForeground} !important;
        --sidebar-active-gradient-from: ${activeTheme.colors.primary} !important;
        --sidebar-active-gradient-to: ${activeTheme.colors.accent} !important;
        --sidebar-active-shadow: rgba(0, 0, 0, 0.3) !important;
      }
    `;

    return () => {
      // Cleanup on unmount
      const existingStyle = document.getElementById('theme-preview-override');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [activeTheme]);

  // Generate CSS variables for the active theme preview
  const getThemeStyles = (): React.CSSProperties => {
    if (!activeTheme) return {};
    
    return {
      '--background': activeTheme.colors.background,
      '--foreground': activeTheme.colors.foreground,
      '--card': activeTheme.colors.card,
      '--card-foreground': activeTheme.colors.cardForeground,
      '--popover': activeTheme.colors.popover,
      '--popover-foreground': activeTheme.colors.popoverForeground,
      '--primary': activeTheme.colors.primary,
      '--primary-foreground': activeTheme.colors.primaryForeground,
      '--secondary': activeTheme.colors.secondary,
      '--secondary-foreground': activeTheme.colors.secondaryForeground,
      '--muted': activeTheme.colors.muted,
      '--muted-foreground': activeTheme.colors.mutedForeground,
      '--accent': activeTheme.colors.accent,
      '--accent-foreground': activeTheme.colors.accentForeground,
      '--destructive': activeTheme.colors.destructive,
      '--destructive-foreground': activeTheme.colors.destructiveForeground,
      '--border': activeTheme.colors.border,
      '--divider': activeTheme.colors.border,
      '--input': activeTheme.colors.input,
      '--input-background': activeTheme.colors.muted,
      '--ring': activeTheme.colors.ring,
      // Sidebar-specific overrides
      '--sidebar': activeTheme.colors.sidebar || activeTheme.colors.card,
      '--sidebar-foreground': activeTheme.colors.foreground,
      '--sidebar-border': activeTheme.colors.border,
      '--sidebar-accent': activeTheme.colors.secondary,
      '--sidebar-accent-foreground': activeTheme.colors.foreground,
      '--sidebar-primary': activeTheme.colors.primary,
      '--sidebar-primary-foreground': activeTheme.colors.primaryForeground,
      '--sidebar-active-gradient-from': activeTheme.colors.primary,
      '--sidebar-active-gradient-to': activeTheme.colors.accent,
      '--sidebar-active-shadow': 'rgba(0, 0, 0, 0.3)',
    } as React.CSSProperties;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'all-subscribers':
        return <AllSubscribersContent />;
      case 'subscription-management':
        return <SubscriptionsContent onNavigate={setActiveSection} />;
      case 'pending-subscriptions':
        return <PendingSubscriptionsContent onNavigateBack={() => setActiveSection('subscription-management')} />;
      case 'cancelled-subscriptions':
        return <CancelledSubscriptionsContent onNavigateBack={() => setActiveSection('subscription-management')} />;
      case 'onboarding-pipeline':
        return <OnboardingContent />;
      case 'subscription-analytics':
        return <AnalyticsContent />;
      case 'trends':
        return (
          <GenericContent
            title="Trends"
            description="Analyze trends across your subscriber base."
          />
        );
      case 'analytics':
        return (
          <GenericContent
            title="Analytics"
            description="Deep dive into analytics and insights."
          />
        );
      case 'alerts':
        return <AlertsContent />;
      case 'alerts-overview':
        return <AlertsContent />;
      case 'operator':
        return <OperatorContent />;
      case 'manage':
        return <ManageContent activeSection={activeSection} onNavigate={setActiveSection} />;
      case 'device-import-config':
        return <ManageContent activeSection={activeSection} onNavigate={setActiveSection} />;
      case 'enabled-features':
        return <ManageContent activeSection={activeSection} onNavigate={setActiveSection} />;
      case 'external-configuration':
        return <ManageContent activeSection={activeSection} onNavigate={setActiveSection} />;
      case 'manufacturer':
        return <ManageContent activeSection={activeSection} onNavigate={setActiveSection} />;
      case 'locations':
        return <ManageContent activeSection={activeSection} onNavigate={setActiveSection} />;
      case 'network':
        return <ManageContent activeSection={activeSection} onNavigate={setActiveSection} />;
      case 'sdn':
        return <ManageContent activeSection={activeSection} onNavigate={setActiveSection} />;
      case 'service-types':
        return <ManageContent activeSection={activeSection} onNavigate={setActiveSection} />;
      case 'communications':
        return <CommunicationsPage />;
      case 'billing':
        return <BillingOverview />;
      case 'billing-overview':
        return <BillingOverview />;
      case 'billing-queue':
        return <BillingQueue />;
      case 'billing-manual-review':
        return <ManualReview />;
      case 'billing-subscriber-history':
        return <SubscriberHistory />;
      case 'billing-promotions':
        return <BillingPromotions />;
      case 'marketing':
        return <MarketingOverview onNavigate={setActiveSection} />;
      case 'marketing-overview':
        return <MarketingOverview onNavigate={setActiveSection} />;
      case 'marketing-ready-addresses':
        return <ReadyAddresses onNavigate={setActiveSection} />;
      case 'documents':
        return (
          <GenericContent
            title="Documents"
            description="Access and manage all documents."
          />
        );
      case 'support':
        return (
          <GenericContent
            title="Support"
            description="Get help and support for your platform."
          />
        );
      case 'settings':
        return <SettingsContent onNavigate={setActiveSection} />;
      case 'settings-overview':
        return <SettingsContent onNavigate={setActiveSection} />;
      case 'vendors':
        return <VendorManagement onNavigateBack={() => setActiveSection('settings')} />;
      case 'networks':
        return <NetworkManagement onNavigateBack={() => setActiveSection('settings')} />;
      case 'automated-services':
        return (
          <GenericContent
            title="Automated Services"
            description="Configure billing service schedules, batch sizes, and automation parameters."
          />
        );
      case 'devices':
        return <DevicesContent />;
      case 'providers':
        return <ProvidersContent />;
      case 'plans-services':
        return <PlansServicesContent />;
      case 'theme-management':
        return <ThemeManagement />;
      default:
        return <SubscriptionsContent />;
    }
  };

  return (
    <div className="h-screen w-screen bg-background" style={getThemeStyles()}>
      {/* Sidebar - Always visible */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div 
        className={`h-full flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}`}
      >
        {/* Top Bar */}
        <TopBar activeSection={activeSection} onSectionChange={setActiveSection} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PrimaryColorProvider>
        <ThemePreviewProvider>
          <AppContent />
        </ThemePreviewProvider>
      </PrimaryColorProvider>
    </ThemeProvider>
  );
}