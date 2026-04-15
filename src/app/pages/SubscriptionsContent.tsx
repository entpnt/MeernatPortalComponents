import { CheckCircle, Clock, XCircle, Users, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

const subscriptionCards = [
  {
    id: 'all-subscribers',
    title: 'All Subscribers',
    description: 'View and manage all subscriber accounts, service addresses, and customer details',
    icon: Users,
    iconColor: 'text-[#147FFF]',
    iconBg: 'bg-[#147FFF]/10',
    route: 'all-subscribers',
  },
  {
    id: 'pending',
    title: 'Pending Subscriptions',
    description: 'Manage pending installations, subscription setups, and scheduled work',
    icon: Clock,
    iconColor: 'text-[#DC6300]',
    iconBg: 'bg-[#DC6300]/10',
    route: 'pending-subscriptions',
  },
  {
    id: 'cancelled',
    title: 'Cancelled Subscriptions',
    description: 'Review churned subscribers, cancellation reasons, and lost revenue',
    icon: XCircle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/10',
    route: 'cancelled-subscriptions',
  },
  {
    id: 'onboarding',
    title: 'Onboarding Pipeline',
    description: 'Track customer progress through the signup funnel and identify bottlenecks',
    icon: Users,
    iconColor: 'text-[#147FFF]',
    iconBg: 'bg-[#147FFF]/10',
    route: 'onboarding-pipeline',
  },
  {
    id: 'analytics',
    title: 'Subscription Analytics',
    description: 'Growth trends, churn analysis, and cohort retention insights',
    icon: TrendingUp,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10',
    route: 'subscription-analytics',
  },
];

interface SubscriptionsContentProps {
  onNavigate?: (section: string) => void;
}

export function SubscriptionsContent({ onNavigate }: SubscriptionsContentProps) {
  const handleCardClick = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      // Fallback to window location if no onNavigate provided
      window.location.hash = route;
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--foreground)]">Subscription Management</h1>
          <p className="text-sm md:text-base text-[var(--muted-foreground)]">
            Manage customer subscriptions, track onboarding progress, and analyze subscription metrics.
          </p>
        </div>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {subscriptionCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.id}
              onClick={() => handleCardClick(card.route)}
              className="bg-[var(--card)] border-[var(--border)] hover:border-[var(--focus)]/50 transition-all duration-200 group cursor-pointer"
            >
              <CardHeader className="space-y-4">
                <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-[var(--card-foreground)]">{card.title}</CardTitle>
                  <CardDescription className="text-[var(--muted-foreground)] text-sm">
                    {card.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-[var(--focus)] hover:bg-[var(--secondary)] hover:text-[var(--focus)] group-hover:bg-[var(--secondary)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card.route);
                  }}
                >
                  <span>View Section</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[var(--muted-foreground)]">Total Subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--card-foreground)]">2,847</div>
            <p className="text-xs text-[var(--success)] mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[var(--muted-foreground)]">Monthly Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--card-foreground)]">$142,580</div>
            <p className="text-xs text-[var(--success)] mt-1">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader className="pb-3 min-h-[4.5rem]">
            <CardDescription className="text-[var(--muted-foreground)]">Churn Rate</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-end">
            <div className="text-2xl font-bold text-[var(--card-foreground)]">2.4%</div>
            <p className="text-xs text-[var(--success)] mt-1">-0.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[var(--muted-foreground)]">Pending Installs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--card-foreground)]">47</div>
            <p className="text-xs text-[var(--warning)] mt-1">+3 from yesterday</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}