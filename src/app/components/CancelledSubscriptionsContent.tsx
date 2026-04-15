import { useState } from 'react';
import { Search, RefreshCw, Users, TrendingDown, DollarSign, ArrowUpDown, Calendar, AlertTriangle, MoreHorizontal, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';

type TabType = 'overview' | 'cancelled-services' | 'switch-services';

interface CancelledSubscriptionsContentProps {
  onNavigateBack?: () => void;
}

export function CancelledSubscriptionsContent({ onNavigateBack }: CancelledSubscriptionsContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Cancelled Subscriptions</h1>
        <p className="text-muted-foreground">Overview of churned subscribers and cancellation trends</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'overview'
              ? 'text-foreground bg-secondary rounded-t-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('cancelled-services')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'cancelled-services'
              ? 'text-foreground bg-secondary rounded-t-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Cancelled Services
        </button>
        <button
          onClick={() => setActiveTab('switch-services')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'switch-services'
              ? 'text-foreground bg-secondary rounded-t-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Switch Services
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'cancelled-services' && <CancelledServicesTab />}
      {activeTab === 'switch-services' && <SwitchServicesTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div>
      {/* Metrics Grid - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Cancelled"
          value="7"
          subtitle="Last 90 days"
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          title="This Week"
          value="0"
          subtitle="Last 7 days"
          icon={<Calendar className="w-5 h-5 text-[var(--error)]" />}
          iconColor="text-[var(--error)]"
        />
        <MetricCard
          title="This Month"
          value="0"
          subtitle="Last 30 days"
          icon={<Calendar className="w-5 h-5 text-[var(--error)]" />}
          iconColor="text-[var(--error)]"
        />
        <MetricCard
          title="Lost MRR"
          value="$0.00"
          subtitle="Monthly recurring revenue"
          icon={<TrendingDown className="w-5 h-5 text-[var(--error)]" />}
          iconColor="text-[var(--error)]"
          valueColor="text-[var(--error)]"
        />
      </div>

      {/* Metrics Grid - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Churn Rate"
          value="0%"
          subtitle="This month"
          icon={<TrendingDown className="w-5 h-5 text-[var(--error)]" />}
          iconColor="text-[var(--error)]"
          valueColor="text-[var(--error)]"
        />
        <MetricCard
          title="Primary Reason"
          value="N/A"
          subtitle="Most common cancellation"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <MetricCard
          title="Voluntary"
          value="0"
          subtitle="Customer requested"
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          title="Involuntary"
          value="0"
          subtitle="Payment issues, etc."
          icon={<DollarSign className="w-5 h-5 text-[var(--warning)]" />}
          iconColor="text-[var(--warning)]"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cancellation Calendar */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-card-foreground mb-1">
                Cancellation Calendar
              </h3>
              <p className="text-sm text-muted-foreground">January 2026 - 0 cancellations</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs bg-secondary text-muted-foreground rounded hover:bg-secondary/80">
                Last
              </button>
              <button className="px-3 py-1.5 text-xs bg-secondary text-foreground rounded">
                This Month
              </button>
              <button className="px-3 py-1.5 text-xs bg-secondary text-muted-foreground rounded hover:bg-secondary/80">
                Next
              </button>
            </div>
          </div>

          {/* Calendar Chart */}
          <div className="h-64 flex items-end gap-2 px-2">
            {calendarData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col-reverse" style={{ height: '200px' }}>
                  {day.count > 0 && (
                    <div
                      className="w-full bg-[var(--error)] rounded-t"
                      style={{ height: `${(day.count / 3) * 100}%` }}
                    />
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-2">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cancellation Reasons */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-base font-semibold text-card-foreground mb-2">
            Cancellation Reasons
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Top reasons for subscription cancellations
          </p>

          <div className="space-y-4">
            {cancellationReasons.map((reason, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-muted-foreground">{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{reason.reason}</p>
                      <p className="text-xs text-muted-foreground">{reason.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{reason.count}</p>
                    <p className="text-xs text-muted-foreground">{reason.percentage}</p>
                  </div>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--error)] h-full"
                    style={{ width: reason.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CancelledServicesTab() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Cancelled"
          value="7"
          subtitle="All cancelled services"
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          title="This Month"
          value="0"
          subtitle="Last 30 days"
          icon={<Calendar className="w-5 h-5 text-[var(--error)]" />}
          iconColor="text-[var(--error)]"
        />
        <MetricCard
          title="Lost MRR"
          value="$0.00"
          subtitle="Monthly recurring revenue"
          icon={<TrendingDown className="w-5 h-5 text-[var(--error)]" />}
          iconColor="text-[var(--error)]"
          valueColor="text-[var(--error)]"
        />
        <MetricCard
          title="Avg. Lifetime"
          value="N/A"
          subtitle="Days before cancellation"
          icon={<Calendar className="w-5 h-5" />}
        />
      </div>

      {/* Cancelled Services Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-card-foreground mb-2">Cancelled Services</h3>
          <p className="text-sm text-muted-foreground">
            Complete history of cancelled customer subscriptions and reasons
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or account ID..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-input rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select className="pl-4 pr-10 py-2 bg-input-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3d%2214%22%20height%3d%228%22%20viewBox%3d%220%200%2014%208%22%20fill%3d%22none%22%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%3e%3cpath%20d%3d%22M1%201L7%207L13%201%22%20stroke%3d%22%2394A3B8%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:10px_6px] bg-[right_1rem_center] bg-no-repeat">
            <option>All Reasons</option>
            <option>Customer Request</option>
            <option>Payment Issues</option>
            <option>Relocation</option>
            <option>Competition</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    Account ID
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    Customer
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Plan</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    Cancelled Date
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    MRR Lost
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Reason</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {cancelledServicesData.map((service, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">{service.accountId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-foreground font-medium">{service.customerName}</p>
                      <p className="text-xs text-muted-foreground">{service.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-foreground">{service.plan}</p>
                      <p className="text-xs text-muted-foreground">{service.price}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">{service.cancelledDate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[var(--error)] font-medium">{service.mrrLost}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-xs bg-secondary text-foreground rounded-full">
                      {service.reason}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-1 bg-popover border border-border">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded transition-colors">
                          <span>View Details</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded transition-colors">
                          <span>Reactivate</span>
                        </button>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing 7 of 7 cancelled services
        </div>
      </div>
    </div>
  );
}

function SwitchServicesTab() {
  return (
    <div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Switches"
          value="1"
          subtitle="Service plan changes"
          icon={<RefreshCw className="w-5 h-5" />}
        />
        <MetricCard
          title="Downgrades"
          value="1"
          subtitle="Lower tier moves"
          icon={<TrendingDown className="w-5 h-5 text-[var(--error)]" />}
          iconColor="text-[var(--error)]"
        />
        <MetricCard
          title="MRR Impact"
          value="-$30.00"
          subtitle="Revenue change"
          icon={<DollarSign className="w-5 h-5 text-[var(--error)]" />}
          iconColor="text-[var(--error)]"
          valueColor="text-[var(--error)]"
        />
        <MetricCard
          title="At Risk"
          value="1"
          subtitle="May cancel soon"
          icon={<AlertTriangle className="w-5 h-5 text-[var(--warning)]" />}
          iconColor="text-[var(--warning)]"
        />
      </div>

      {/* Switch Services Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-card-foreground mb-2">Switch Services</h3>
          <p className="text-sm text-muted-foreground">
            Customers who downgraded to lower-tier plans
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or account ID..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-input rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select className="pl-4 pr-10 py-2 bg-input-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3d%2214%22%20height%3d%228%22%20viewBox%3d%220%200%2014%208%22%20fill%3d%22none%22%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%3e%3cpath%20d%3d%22M1%201L7%207L13%201%22%20stroke%3d%22%2394A3B8%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:10px_6px] bg-[right_1rem_center] bg-no-repeat">
            <option>All Types</option>
            <option>Downgrade</option>
            <option>Upgrade</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Account ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Plan Change</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">MRR Impact</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Switch Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {switchServicesData.map((service, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">{service.accountId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground font-medium">{service.customerName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div>
                        <p className="text-foreground">{service.fromPlan}</p>
                        <p className="text-xs text-muted-foreground">{service.fromPrice}</p>
                      </div>
                      <span className="text-muted-foreground">→</span>
                      <div>
                        <p className="text-foreground font-medium">{service.toPlan}</p>
                        <p className="text-xs text-muted-foreground">{service.toPrice}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-sm font-medium ${
                      service.mrrImpact.startsWith('-') ? 'text-[var(--error)]' : 'text-[var(--success)]'
                    }`}>
                      {service.mrrImpact}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      service.type === 'Downgrade'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-secondary text-foreground'
                    }`}>
                      {service.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">{service.switchDate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-full font-medium">
                      {service.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconColor?: string;
  valueColor?: string;
}

function MetricCard({ title, value, subtitle, icon, iconColor, valueColor }: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={iconColor || 'text-muted-foreground'}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-semibold mb-1 ${valueColor || 'text-foreground'}`}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

// Mock data for cancelled services
const cancelledServicesData = [
  {
    accountId: 'OF-2025-418218',
    customerName: 'Linda Mitchum',
    customerEmail: 'lbmitchum5@gmail.com',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    cancelledDate: 'Nov 24, 2025',
    mrrLost: '-$65.95',
    reason: 'Customer Request'
  },
  {
    accountId: 'OF-2026-133363',
    customerName: 'Thresa Zimmerman',
    customerEmail: 'thresazimmerman@gmail.com',
    plan: '100M/100M',
    price: '$57.95/mo',
    cancelledDate: 'Feb 1, 2026',
    mrrLost: '-$57.95',
    reason: 'Customer Request'
  },
  {
    accountId: 'OF-2025-894507',
    customerName: 'Amari Way',
    customerEmail: 'amariway51@gmail.com',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    cancelledDate: 'Sep 28, 2025',
    mrrLost: '-$65.95',
    reason: 'Customer Request'
  },
  {
    accountId: 'OF-2025-882519',
    customerName: 'Travis Carson',
    customerEmail: 'traviscarson8@gmail.com',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    cancelledDate: 'Sep 28, 2025',
    mrrLost: '-$65.95',
    reason: 'Customer Request'
  },
  {
    accountId: 'OF-2025-789968',
    customerName: 'Theodore Brown',
    customerEmail: 'theodore.brown47@icloud.com',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    cancelledDate: 'Sep 30, 2025',
    mrrLost: '-$65.95',
    reason: 'Customer Request'
  },
  {
    accountId: 'OF-2025-468960',
    customerName: 'Walter Furtick',
    customerEmail: 'tignut300@gmail.com',
    plan: '100M/100M',
    price: '$57.95/mo',
    cancelledDate: 'Oct 1, 2025',
    mrrLost: '-$57.95',
    reason: 'Customer Request'
  },
  {
    accountId: 'OF-2025-301176',
    customerName: 'Elijah Carmichael',
    customerEmail: 'Doejnailmail44@gmail.com',
    plan: '1GB + Phone Bundle',
    price: '$90.90/mo',
    cancelledDate: 'Oct 1, 2025',
    mrrLost: '-$90.90',
    reason: 'Customer Request'
  }
];

// Mock data for switch services
const switchServicesData = [
  {
    accountId: 'OF-2025-843562',
    customerName: 'SABRINA CELINE TURKAL',
    fromPlan: '2.5GB/2.5GB',
    fromPrice: '$99.99/mo',
    toPlan: '1GB/1GB',
    toPrice: '$69.99/mo',
    mrrImpact: '-$30.00',
    type: 'Downgrade',
    switchDate: 'Jan 15, 2026',
    status: 'completed'
  }
];

// Mock data for cancellation calendar (January 2026)
const calendarData = [
  { label: '1', count: 0 },
  { label: '2', count: 0 },
  { label: '3', count: 0 },
  { label: '4', count: 0 },
  { label: '5', count: 0 },
  { label: '6', count: 0 },
  { label: '7', count: 0 },
  { label: '8', count: 0 },
  { label: '9', count: 0 },
  { label: '10', count: 0 },
  { label: '11', count: 0 },
  { label: '12', count: 0 },
  { label: '13', count: 0 },
  { label: '14', count: 0 },
  { label: '15', count: 0 },
  { label: '16', count: 0 },
  { label: '17', count: 0 },
  { label: '18', count: 0 },
  { label: '19', count: 0 },
  { label: '20', count: 0 },
  { label: '21', count: 0 },
  { label: '22', count: 0 },
  { label: '23', count: 0 },
  { label: '24', count: 0 },
  { label: '25', count: 0 },
  { label: '26', count: 0 },
  { label: '27', count: 0 },
  { label: '28', count: 0 },
  { label: '29', count: 0 },
  { label: '30', count: 0 },
  { label: '31', count: 0 }
];

// Mock data for cancellation reasons
const cancellationReasons = [
  {
    reason: 'Customer Request',
    category: 'Voluntary',
    count: '7',
    percentage: '100%'
  },
  {
    reason: 'Payment Issues',
    category: 'Involuntary',
    count: '0',
    percentage: '0%'
  },
  {
    reason: 'Relocation',
    category: 'Voluntary',
    count: '0',
    percentage: '0%'
  },
  {
    reason: 'Competition',
    category: 'Voluntary',
    count: '0',
    percentage: '0%'
  }
];
