import { ReactNode } from 'react';

interface TabMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
  }>;
  className?: string;
}

export function TabMenu({ activeTab, onTabChange, tabs, className = '' }: TabMenuProps) {
  return (
    <div className={`flex gap-2 mb-6 border-b border-border ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-medium transition-all rounded-t-lg ${
            activeTab === tab.id
              ? 'text-foreground bg-secondary'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          }`}
        >
          {tab.label}
        </button>
      ))}
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