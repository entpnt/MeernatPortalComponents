import { Target, TrendingUp, Users, Zap, ArrowRight } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface MarketingOverviewProps {
  onNavigate?: (section: string) => void;
}

export function MarketingOverview({ onNavigate }: MarketingOverviewProps) {
  return (
    <div className="p-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Marketing Dashboard
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Manage marketing campaigns and lead conversion channels • Orangeburg Fiber
        </p>
      </div>

      {/* Info Banner */}
      <Card className="bg-[var(--card)] border-[var(--border)] p-4">
        <div className="flex gap-3 text-sm text-[var(--muted-foreground)]">
          <div className="w-5 h-5 rounded-full border-2 border-[#147FFF] flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-1.5 h-1.5 bg-[#147FFF] rounded-full" />
          </div>
          <p>
            <strong className="text-[var(--foreground)]">Marketing Channels:</strong> Each channel represents a specific marketing opportunity to convert leads into active customers. Select a channel below to view leads and launch campaigns.
          </p>
        </div>
      </Card>

      {/* Active Channels */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[#147FFF]" />
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Active Channels</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ready Addresses - Active */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-[#147FFF]" />
              </div>
              <Badge className="bg-[#147FFF] text-white hover:bg-[#1068CC]">
                Active
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Ready Addresses</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              Target leads who signed up during service planning. Service is now available in their area, but they haven't scheduled installation yet.
            </p>

            <div className="mb-6">
              <div className="text-4xl font-bold text-[var(--foreground)] mb-1">15</div>
              <p className="text-sm text-[var(--muted-foreground)]">leads ready</p>
            </div>

            <Button 
              className="w-full bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--muted-foreground)]"
              onClick={() => onNavigate?.('marketing-ready-addresses')}
            >
              View Channel
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          {/* Abandoned Signups - Coming Soon */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-6 opacity-60">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--muted-foreground)]" />
              </div>
              <Badge variant="outline" className="border-[var(--border)] text-[var(--muted-foreground)]">
                Coming Soon
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Abandoned Signups</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              Re-engage leads who started but didn't complete the signup process.
            </p>

            <div className="mb-6">
              <p className="text-sm text-[var(--muted-foreground)] italic">In Development</p>
            </div>
          </Card>

          {/* Service Upgrades - Coming Soon */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-6 opacity-60">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-[var(--muted-foreground)]" />
              </div>
              <Badge variant="outline" className="border-[var(--border)] text-[var(--muted-foreground)]">
                Coming Soon
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Service Upgrades</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              Target active customers with upgrade opportunities for higher-tier service plans.
            </p>

            <div className="mb-6">
              <p className="text-sm text-[var(--muted-foreground)] italic">In Development</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Channel Performance */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[#147FFF]" />
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Channel Performance</h2>
        </div>

        <Card className="bg-[var(--card)] border-[var(--border)] p-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[var(--secondary)] rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Performance Analytics</h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md mb-4">
              Track campaign performance, conversion rates, and ROI across all marketing channels.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
              <div className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full animate-pulse" />
              <span className="text-sm text-[var(--muted-foreground)]">Coming Soon</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
