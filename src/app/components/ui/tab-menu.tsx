import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface TabMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon?: LucideIcon;
  }>;
  className?: string;
  compact?: boolean;
}

export function TabMenu({ activeTab, onTabChange, tabs, className = '', compact = false }: TabMenuProps) {
  return (
    <div className={`flex gap-1 overflow-x-auto border-b border-border scrollbar-hide ${className}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-all rounded-t-lg whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-foreground bg-secondary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            {!compact && <span>{tab.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

interface TabContentProps {
  activeTab: string;
  tabId: string;
  children: ReactNode;
}

export function TabContent({ activeTab, tabId, children }: TabContentProps) {
  if (activeTab !== tabId) return null;
  return <>{children}</>;
}