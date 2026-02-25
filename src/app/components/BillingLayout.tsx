import { Activity, TrendingUp } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface BillingLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate?: (section: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', route: 'billing-overview' },
  { id: 'queue', label: 'Queue', route: 'billing-queue' },
  { id: 'manual-review', label: 'Manual Review', route: 'manual-review' },
  { id: 'subscriber-history', label: 'Subscriber History', route: 'subscriber-history' },
];

export function BillingLayout({ children, activeTab, onNavigate }: BillingLayoutProps) {
  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onNavigate?.(tab.route)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-[var(--secondary)] text-[var(--foreground)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
