import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp, 
  BarChart3, 
  CreditCard, 
  FolderOpen, 
  HelpCircle, 
  Settings, 
  ChevronRight, 
  ChevronDown,
  Network,
  Monitor,
  UserCog,
  Building2,
  Bell,
  Router,
  MessageSquare,
  Megaphone,
  Package,
  Tag,
  Receipt,
  ListChecks,
  Eye,
  History,
  Percent,
  PanelLeftClose,
  PanelLeft,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemePreview } from '@/contexts/ThemePreviewContext';
import logoImageDark from 'figma:asset/dcd7610257c06e6dff00ca4ea6848bfbe5b665bc.png';
import logoImageLight from 'figma:asset/0433c6bb0eba061dbe8a14d5dc2873c8939e93dc.png';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: number;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'NOC', icon: LayoutDashboard },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: 3 },
  { 
    id: 'manage', 
    label: 'Manage', 
    icon: Settings,
    children: [
      { id: 'device-import-config', label: 'Device Import Configuration', icon: Router },
      { id: 'enabled-features', label: 'Enabled Features', icon: CheckCircle },
      { id: 'external-configuration', label: 'External Configuration', icon: Settings },
      { id: 'manufacturer', label: 'Manufacturer', icon: Building2 },
      { id: 'locations', label: 'Locations', icon: Monitor },
      { id: 'network', label: 'Network', icon: Network },
      { id: 'sdn', label: 'SDN', icon: Router },
      { id: 'service-types', label: 'Service Types', icon: FolderOpen },
    ]
  },
  { id: 'operator', label: 'Operator', icon: UserCog },
  { id: 'providers', label: 'Providers', icon: Building2 },
  { 
    id: 'subscription-management', 
    label: 'Subscription Management', 
    icon: Users,
    children: [
      { id: 'all-subscribers', label: 'All Subscribers', icon: Users },
      { id: 'pending-subscriptions', label: 'Pending Subscriptions', icon: Clock },
      { id: 'cancelled-subscriptions', label: 'Cancelled Subscriptions', icon: XCircle },
      { id: 'onboarding-pipeline', label: 'Onboarding Pipeline', icon: Users },
      { id: 'subscription-analytics', label: 'Subscription Analytics', icon: TrendingUp },
    ]
  },
  { id: 'plans-services', label: 'Plans & Services', icon: Tag },
  { id: 'devices', label: 'Devices', icon: Router },
  { id: 'communications', label: 'Communications', icon: MessageSquare },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { 
    id: 'billing', 
    label: 'Billing', 
    icon: CreditCard,
    children: [
      { id: 'billing-overview', label: 'Overview', icon: Receipt },
      { id: 'billing-queue', label: 'Queue', icon: ListChecks },
      { id: 'billing-manual-review', label: 'Manual Review', icon: Eye },
      { id: 'billing-subscriber-history', label: 'Subscriber History', icon: History },
      { id: 'billing-promotions', label: 'Promotions', icon: Percent },
    ]
  },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
];

const bottomItems: NavItem[] = [
  { id: 'support', label: 'Support', icon: HelpCircle },
  { 
    id: 'settings', 
    label: 'Application Settings', 
    icon: Settings,
    children: [
      { id: 'settings-overview', label: 'Overview', icon: Settings },
      { id: 'vendors', label: 'Vendors', icon: FolderOpen },
      { id: 'networks', label: 'Networks', icon: Network },
      { id: 'theme-management', label: 'Theme Management', icon: Palette },
    ]
  },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ activeSection, onSectionChange, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set(['subscribers', 'subscription-management']));
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [flyoutPosition, setFlyoutPosition] = useState<{ top: number; item: NavItem } | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();
  const { activeTheme } = useThemePreview();
  
  // Use dark logo if we're in dark mode OR if a theme variation is active
  const shouldUseDarkLogo = theme === 'dark' || activeTheme !== null;

  // Auto-open menus if their sub-sections are active (only in expanded mode)
  useEffect(() => {
    if (!isCollapsed) {
      if (activeSection === 'settings-overview' || activeSection === 'vendors' || activeSection === 'networks' || activeSection === 'theme-management' || activeSection === 'settings') {
        setOpenMenus(prev => new Set([...prev, 'settings']));
      }
      if (activeSection === 'device-import-config' || activeSection === 'enabled-features' || activeSection === 'external-configuration' || 
          activeSection === 'manufacturer' || activeSection === 'locations' || activeSection === 'network' || 
          activeSection === 'sdn' || activeSection === 'service-types' || activeSection === 'manage') {
        setOpenMenus(prev => new Set([...prev, 'manage']));
      }
      if (activeSection === 'billing-overview' || activeSection === 'billing-queue' || activeSection === 'billing-manual-review' || 
          activeSection === 'billing-subscriber-history' || activeSection === 'billing-promotions' || activeSection === 'billing') {
        setOpenMenus(prev => new Set([...prev, 'billing']));
      }
    }
  }, [activeSection, isCollapsed]);

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const hasActiveDescendant = (item: NavItem): boolean => {
    if (item.id === activeSection) return true;
    if (item.children) {
      return item.children.some(child => hasActiveDescendant(child));
    }
    return false;
  };

  const handleMouseEnter = (item: NavItem, event: React.MouseEvent<HTMLButtonElement>) => {
    // Clear any pending close timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    
    if (isCollapsed && item.children && item.children.length > 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      setFlyoutPosition({ top: rect.top, item });
    }
    setHoveredItem(item.id);
  };

  const handleMouseLeave = () => {
    // Delay closing to allow user to move to flyout
    const timeout = setTimeout(() => {
      setHoveredItem(null);
      setFlyoutPosition(null);
    }, 150);
    setCloseTimeout(timeout);
  };

  const handleFlyoutEnter = () => {
    // Clear any pending close timeout when entering flyout
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleFlyoutLeave = () => {
    // Immediately close when leaving flyout
    setHoveredItem(null);
    setFlyoutPosition(null);
  };

  // Expanded mode nav items
  const renderNavItem = (item: NavItem, level: number = 0) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.has(item.id);
    const hasActiveChild = hasChildren && hasActiveDescendant(item);

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleMenu(item.id);
            } else {
              onSectionChange(item.id);
            }
          }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative',
            'focus:outline-none focus:ring-2 focus:ring-[var(--focus)]',
            isActive && 'text-[var(--sidebar-primary-foreground)]',
            !isActive && hasActiveChild && 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] hover:bg-[var(--sidebar-accent)]',
            !isActive && !hasActiveChild && 'text-[var(--muted-foreground)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]',
            level === 1 && 'text-sm',
            level === 2 && 'text-sm py-1.5'
          )}
          style={{
            paddingLeft: level > 0 ? `${12 + level * 8}px` : undefined,
            ...(isActive && {
              background: `linear-gradient(to right, var(--sidebar-active-gradient-from), var(--sidebar-active-gradient-to))`,
              boxShadow: `inset 0 1px 2px var(--sidebar-active-shadow)`
            })
          }}
        >
          <Icon className={cn('flex-shrink-0', level === 0 ? 'w-5 h-5' : 'w-4 h-4')} />
          <span className={cn('font-medium flex-1 text-left', 'text-sm')}>
            {item.label}
          </span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[var(--error)] text-white text-xs font-semibold rounded-full">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            isOpen ? 
              <ChevronDown className="flex-shrink-0 w-4 h-4" /> : 
              <ChevronRight className="flex-shrink-0 w-4 h-4" />
          )}
        </button>

        {hasChildren && isOpen && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Collapsed mode nav items
  const renderCollapsedNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const hasActiveChild = hasChildren && hasActiveDescendant(item);

    const button = (
      <button
        onClick={() => {
          if (!hasChildren) {
            onSectionChange(item.id);
          }
        }}
        onMouseEnter={(e) => handleMouseEnter(item, e)}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 relative',
          'focus:outline-none focus:ring-2 focus:ring-[var(--focus)]',
          isActive && 'text-[var(--sidebar-primary-foreground)]',
          !isActive && hasActiveChild && 'bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]',
          !isActive && !hasActiveChild && 'text-[var(--muted-foreground)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]'
        )}
        style={{
          ...(isActive && {
            background: `linear-gradient(to right, var(--sidebar-active-gradient-from), var(--sidebar-active-gradient-to))`,
            boxShadow: `inset 0 1px 2px var(--sidebar-active-shadow)`
          })
        }}
      >
        <div className="relative">
          <Icon className="w-5 h-5" />
          {item.badge !== undefined && item.badge > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-[var(--error)] text-white text-[10px] font-semibold rounded-full">
              {item.badge}
            </span>
          )}
        </div>
        {hasChildren && (
          <ChevronRight className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50" />
        )}
      </button>
    );

    if (!hasChildren) {
      return (
        <Tooltip key={item.id} delayDuration={0}>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-[var(--popover)] text-[var(--popover-foreground)] border border-[var(--border)]">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.id}>{button}</div>;
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          'fixed left-0 top-0 h-screen bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] flex flex-col z-50 transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--sidebar-border)]">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img src={shouldUseDarkLogo ? logoImageDark : logoImageLight} alt="Logo" className="w-8 h-8 object-contain" />
              <div>
                <h1 className="text-[var(--sidebar-foreground)] font-semibold text-base leading-tight">Management Portal</h1>
                <p className="text-[var(--muted-foreground)] text-xs">Administrator</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <img src={shouldUseDarkLogo ? logoImageDark : logoImageLight} alt="Logo" className="w-8 h-8 object-contain mx-auto" />
          )}
        </div>

        {/* Toggle Button */}
        <div className="px-2 py-2 border-b border-[var(--sidebar-border)]">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className={cn('space-y-1', isCollapsed ? 'px-2' : 'px-2')}>
            {navigationItems.map((item) => 
              isCollapsed ? renderCollapsedNavItem(item) : renderNavItem(item, 0)
            )}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-[var(--sidebar-border)] py-4">
          <nav className={cn('space-y-1', isCollapsed ? 'px-2' : 'px-2')}>
            {bottomItems.map((item) => 
              isCollapsed ? renderCollapsedNavItem(item) : renderNavItem(item, 0)
            )}
          </nav>
          
          {/* Copyright */}
          {!isCollapsed && (
            <div className="mt-4 px-4 text-center">
              <p className="text-xs text-[var(--muted-foreground)]">
                © Meernat 2026
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Flyout Menu for Collapsed Sidebar */}
      {isCollapsed && flyoutPosition && (
        <div
          className="fixed left-16 bg-[var(--popover)] border border-[var(--border)] rounded-lg shadow-lg z-50 min-w-[200px] py-2"
          style={{ top: flyoutPosition.top }}
          onMouseEnter={handleFlyoutEnter}
          onMouseLeave={handleFlyoutLeave}
        >
          <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">{flyoutPosition.item.label}</p>
          </div>
          {flyoutPosition.item.children?.map((child) => {
            const ChildIcon = child.icon;
            const isActive = activeSection === child.id;
            return (
              <button
                key={child.id}
                onClick={() => {
                  onSectionChange(child.id);
                  setFlyoutPosition(null);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                  isActive 
                    ? 'bg-[var(--secondary)] text-[var(--foreground)] font-medium' 
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                )}
              >
                <ChildIcon className="w-4 h-4" />
                <span>{child.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </TooltipProvider>
  );
}