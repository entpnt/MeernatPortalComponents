import { useState } from 'react';
import { Search, RefreshCw, Users, Calendar, Clock, AlertTriangle, FileText, CheckCircle, MoreHorizontal, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { TablePagination } from '@/app/components/TablePagination';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';

type TabType = 'overview' | 'pending-installations' | 'needs-reschedule';

interface PendingSubscriptionsContentProps {
  onNavigateBack?: () => void;
}

export function PendingSubscriptionsContent({ onNavigateBack }: PendingSubscriptionsContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pending-installations');

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Pending Subscriptions</h1>
        <p className="text-muted-foreground">Manage installation schedules and onboarding</p>
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
          onClick={() => setActiveTab('pending-installations')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'pending-installations'
              ? 'text-foreground bg-secondary rounded-t-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending Installations
        </button>
        <button
          onClick={() => setActiveTab('needs-reschedule')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'needs-reschedule'
              ? 'text-foreground bg-secondary rounded-t-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Needs Reschedule
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'pending-installations' && <PendingInstallationsTab />}
      {activeTab === 'needs-reschedule' && <NeedsRescheduleTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div>
      {/* Metrics Grid - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Pending"
          value="67"
          subtitle="All pending subscriptions"
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          title="Scheduled"
          value="31"
          subtitle="Installs with scheduled date"
          icon={<CheckCircle className="w-5 h-5 text-[var(--success)]" />}
          iconColor="text-[var(--success)]"
        />
        <MetricCard
          title="In Progress"
          value="1"
          subtitle="Currently being installed"
          icon={<RefreshCw className="w-5 h-5 text-[var(--info)]" />}
          iconColor="text-[var(--info)]"
        />
        <MetricCard
          title="Overdue"
          value="0"
          subtitle="Past scheduled date"
          icon={<AlertTriangle className="w-5 h-5 text-[var(--error)]" />}
          iconColor="text-[var(--error)]"
        />
      </div>

      {/* Metrics Grid - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Today"
          value="1"
          subtitle="Scheduled for today"
          icon={<Calendar className="w-5 h-5 text-[var(--warning)]" />}
          iconColor="text-[var(--warning)]"
        />
        <MetricCard
          title="This Week"
          value="4"
          subtitle="Next 7 days"
          icon={<Calendar className="w-5 h-5 text-[var(--accent)]" />}
          iconColor="text-[var(--accent)]"
        />
        <MetricCard
          title="Awaiting Schedule"
          value="10"
          subtitle="No install date set"
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          title="Contracts Signed"
          value="0"
          subtitle="Out of 67 total"
          icon={<FileText className="w-5 h-5 text-[var(--success)]" />}
          iconColor="text-[var(--success)]"
        />
      </div>

      {/* Installation Schedule Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-card-foreground mb-1">
              Installation Schedule
            </h3>
            <p className="text-sm text-muted-foreground">January 2026 - 18 installations</p>
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

        {/* Bar Chart */}
        <div className="h-80 flex items-end gap-4 px-4">
          {chartData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col-reverse gap-1" style={{ height: '280px' }}>
                {day.completed > 0 && (
                  <div
                    className="w-full bg-[var(--accent)] rounded-t"
                    style={{ height: `${(day.completed / 4) * 100}%` }}
                  />
                )}
                {day.inProgress > 0 && (
                  <div
                    className="w-full bg-[var(--info)]"
                    style={{ height: `${(day.inProgress / 4) * 100}%` }}
                  />
                )}
                {day.pending > 0 && (
                  <div
                    className="w-full bg-[var(--warning)]"
                    style={{ height: `${(day.pending / 4) * 100}%` }}
                  />
                )}
                {day.scheduled > 0 && (
                  <div
                    className="w-full bg-[var(--success)] rounded-b"
                    style={{ height: `${(day.scheduled / 4) * 100}%` }}
                  />
                )}
              </div>
              <span className="text-xs text-muted-foreground mt-2">{day.label}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--accent)] rounded"></div>
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--info)] rounded"></div>
            <span className="text-xs text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--warning)] rounded"></div>
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--success)] rounded"></div>
            <span className="text-xs text-muted-foreground">Scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PendingInstallationsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Pending"
          value="67"
          subtitle="Customers awaiting installation"
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          title="Scheduled"
          value="31"
          subtitle="Installation date confirmed"
          icon={<CheckCircle className="w-5 h-5 text-[var(--success)]" />}
          iconColor="text-[var(--success)]"
        />
        <MetricCard
          title="In Progress"
          value="1"
          subtitle="Currently being installed"
          icon={<RefreshCw className="w-5 h-5 text-[var(--info)]" />}
          iconColor="text-[var(--info)]"
        />
        <MetricCard
          title="Awaiting Schedule"
          value="0"
          subtitle="Needs installation date"
          icon={<Calendar className="w-5 h-5 text-[var(--warning)]" />}
          iconColor="text-[var(--warning)]"
        />
      </div>

      {/* Pending Subscriptions Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-card-foreground mb-2">Pending Subscriptions</h3>
          <p className="text-sm text-muted-foreground">
            Manage customers awaiting installation. Edit service plans and schedule installation dates.
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
            <option>All Statuses</option>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Pending</option>
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
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Address</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Plan</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Install Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Contract</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {pendingInstallationsData.map((installation, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">{installation.accountId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-foreground font-medium">{installation.customerName}</p>
                      <p className="text-xs text-muted-foreground">{installation.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-foreground">{installation.address}</p>
                      <p className="text-xs text-muted-foreground">{installation.city}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-foreground">{installation.plan}</p>
                      <p className="text-xs text-muted-foreground">{installation.price}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-foreground">{installation.installDate}</p>
                      <p className="text-xs text-muted-foreground">{installation.installTime}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      installation.status === 'completed' 
                        ? 'bg-secondary text-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {installation.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      installation.contract === 'Pending' 
                        ? 'bg-secondary text-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {installation.contract}
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
                          <span>Switch Plan</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-secondary rounded transition-colors">
                          <span>Cancel Subscription</span>
                        </button>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

function NeedsRescheduleTab() {
  return (
    <div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Needs Reschedule"
          value="20"
          subtitle="Awaiting new install date"
          icon={<Calendar className="w-5 h-5" />}
        />
        <MetricCard
          title="High Urgency"
          value="20"
          subtitle="Waiting 7+ days"
          icon={<AlertTriangle className="w-5 h-5 text-[var(--error)]" />}
          iconColor="text-[var(--error)]"
        />
        <MetricCard
          title="Medium Urgency"
          value="0"
          subtitle="Waiting 3-7 days"
          icon={<AlertTriangle className="w-5 h-5 text-[var(--warning)]" />}
          iconColor="text-[var(--warning)]"
        />
      </div>

      {/* Needs Reschedule Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-card-foreground mb-2">Needs Reschedule</h3>
          <p className="text-sm text-muted-foreground">
            Subscriptions with cancelled installations awaiting new install dates.
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
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Address</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Plan</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Original Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Cancelled At</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {needsRescheduleData.map((item, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">{item.accountId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-foreground font-medium">{item.customerName}</p>
                      <p className="text-xs text-muted-foreground">{item.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">{item.address}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">{item.plan}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-foreground">{item.originalDate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-foreground">{item.cancelledAt}</p>
                      <p className="text-xs text-muted-foreground">{item.daysAgo}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded font-medium">
                      {item.urgency}
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
}

function MetricCard({ title, value, subtitle, icon, iconColor }: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={iconColor || 'text-muted-foreground'}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-semibold mb-1 ${iconColor || 'text-foreground'}`}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

// Mock data for pending installations
const pendingInstallationsData = [
  {
    accountId: 'OF-2025-418218',
    customerName: 'Linda Mitchum',
    customerEmail: 'lbmitchum5@gmail.com',
    address: '2170 CLIFTON CIR, ORANGEBURG, SC',
    city: 'ORANGEBURG, SC',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    installDate: 'Nov 24, 2025',
    installTime: 'Morning (8:00 AM - 12:00 PM)',
    status: 'completed',
    contract: 'Pending'
  },
  {
    accountId: 'OF-2026-133363',
    customerName: 'Thresa Zimmerman',
    customerEmail: 'thresazimmerman@gmail.com',
    address: '1820 SAINT MATTHEWS RD ...',
    city: 'ORANGEBURG, SC',
    plan: '100M/100M',
    price: '$57.95/mo',
    installDate: 'Feb 1, 2026',
    installTime: 'Afternoon',
    status: 'scheduled',
    contract: 'Pending'
  },
  {
    accountId: 'OF-2025-894507',
    customerName: 'Amari Way',
    customerEmail: 'amariway51@gmail.com',
    address: '773 MCKEWN ST, ORANGEBU...',
    city: 'ORANGEBURG, SC',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    installDate: 'Sep 28, 2025',
    installTime: '1:00 PM - 5:00 PM',
    status: 'scheduled',
    contract: 'Pending'
  },
  {
    accountId: 'OF-2025-882519',
    customerName: 'Travis Carson',
    customerEmail: 'traviscarson8@gmail.com',
    address: '608 BERRY ST, ORANGEBURG...',
    city: 'ORANGEBURG, SC',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    installDate: 'Sep 28, 2025',
    installTime: '8:00 AM - 5:00 PM',
    status: 'completed',
    contract: 'Pending'
  },
  {
    accountId: 'OF-2025-789968',
    customerName: 'Theodore Brown',
    customerEmail: 'theodore.brown47@icloud.com',
    address: '1820 SAINT MATTHEWS RD, ...',
    city: 'ORANGEBURG, SC',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    installDate: 'Sep 30, 2025',
    installTime: '8:00 AM - 12:00 PM',
    status: 'scheduled',
    contract: 'Pending'
  },
  {
    accountId: 'OF-2025-468960',
    customerName: 'Walter Furtick',
    customerEmail: 'tignut300@gmail.com',
    address: '1820 SAINT MATTHEWS RD, ...',
    city: 'ORANGEBURG, SC',
    plan: '100M/100M',
    price: '$57.95/mo',
    installDate: 'Oct 1, 2025',
    installTime: '1:00 PM - 5:00 PM',
    status: 'scheduled',
    contract: 'Pending'
  },
  {
    accountId: 'OF-2025-301176',
    customerName: 'Elijah Carmichael',
    customerEmail: 'Doejnailmail44@gmail.com',
    address: '1820 SAINT MATTHEWS RD, ...',
    city: 'ORANGEBURG, SC',
    plan: '1GB + Phone Bundle',
    price: '$90.90/mo',
    installDate: 'Oct 1, 2025',
    installTime: '8:00 AM - 5:00 PM',
    status: 'scheduled',
    contract: 'Pending'
  },
  {
    accountId: 'OF-2025-486395',
    customerName: 'Ruben Hugges',
    customerEmail: 'rubendogg55@gmail.com',
    address: '1820 SAINT MATTHEWS RD, ...',
    city: 'ORANGEBURG, SC',
    plan: '100M/100M',
    price: '$57.95/mo',
    installDate: 'Oct 1, 2025',
    installTime: '8:00 AM - 12:00 PM',
    status: 'scheduled',
    contract: 'Pending'
  },
  {
    accountId: 'OF-2025-935683',
    customerName: 'Thresa Zimmerman',
    customerEmail: 'amandazimmerman33@gmail.com',
    address: '1820 SAINT MATTHEWS RD, ...',
    city: 'ORANGEBURG, SC',
    plan: '100M/100M w/limited support',
    price: '$59.83/mo',
    installDate: 'Oct 5, 2025',
    installTime: '8:00 AM - 5:00 PM',
    status: 'scheduled',
    contract: 'Pending'
  },
  {
    accountId: 'OF-2025-442658',
    customerName: 'Thresa Zimmerman',
    customerEmail: 'a.zimmerman1@yahoo.com',
    address: '1820 SAINT MATTHEWS RD, ...',
    city: 'ORANGEBURG, SC',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    installDate: 'Oct 15, 2025',
    installTime: 'Morning (8:00 AM - 12:00 PM)',
    status: 'scheduled',
    contract: 'Pending'
  }
];

// Mock data for needs reschedule
const needsRescheduleData = [
  {
    accountId: 'OF-2825-795456',
    customerName: 'Juliana Test',
    customerEmail: 'jrosario+email@entpnt.com',
    address: '146 FAME LN, ORANGEBUR...',
    plan: '1GB + Phone Bundle',
    originalDate: 'Jan 13, 2026',
    cancelledAt: 'Jan 9, 2026',
    daysAgo: '18 days ago',
    urgency: 'High'
  },
  {
    accountId: 'OF-2825-802981',
    customerName: 'Juliana Test',
    customerEmail: 'jrosario+test12345@entpnt.com',
    address: '3096 BROUGHTON ST, ORA...',
    plan: '1GB/1GB',
    originalDate: 'Dec 30, 2025',
    cancelledAt: 'Jan 8, 2026',
    daysAgo: '18 days ago',
    urgency: 'High'
  },
  {
    accountId: 'OF-2825-229790',
    customerName: 'Quintin Duown',
    customerEmail: 'raydoown04@gmail.com',
    address: '1600 Columbia Rd C Apt j3, ...',
    plan: '100M/100M',
    originalDate: 'Dec 22, 2025',
    cancelledAt: 'Dec 23, 2025',
    daysAgo: '35 days ago',
    urgency: 'High'
  },
  {
    accountId: 'OF-2825-326893',
    customerName: 'Jerry Solage',
    customerEmail: 'jerrysolages15@gmail.com',
    address: '1600 COLUMBIA RD, ORANG...',
    plan: '1GB/1GB',
    originalDate: 'Oct 8, 2025',
    cancelledAt: 'Dec 20, 2025',
    daysAgo: '38 days ago',
    urgency: 'High'
  },
  {
    accountId: 'OF-2825-293874',
    customerName: 'Kenneth Glover',
    customerEmail: 'gloverkenny6@icloud.com',
    address: '210 SAGO PALM DR, ORANG...',
    plan: '1GB/1GB',
    originalDate: 'Dec 28, 2025',
    cancelledAt: 'Dec 19, 2025',
    daysAgo: '38 days ago',
    urgency: 'High'
  },
  {
    accountId: 'OF-2825-156881',
    customerName: 'Juliana Test',
    customerEmail: 'jrosario+test392@entpnt.com',
    address: '3096 BROUGHTON ST, ORA...',
    plan: '1GB + Phone Bundle',
    originalDate: 'Dec 15, 2025',
    cancelledAt: 'Dec 12, 2025',
    daysAgo: '45 days ago',
    urgency: 'High'
  },
  {
    accountId: 'OF-2825-892739',
    customerName: 'James Cutting',
    customerEmail: 'scdaddy@aol.com',
    address: '825 COLUMBIA RD, ORANGE...',
    plan: '100M/100M',
    originalDate: 'Nov 23, 2025',
    cancelledAt: 'Nov 24, 2025',
    daysAgo: '64 days ago',
    urgency: 'High'
  }
];

// Mock data for chart
const chartData = [
  { label: '1', completed: 0, inProgress: 0, pending: 0, scheduled: 1 },
  { label: '2', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '3', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '6', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '7', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '8', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '9', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '10', completed: 0, inProgress: 0, pending: 0, scheduled: 2 },
  { label: '13', completed: 1, inProgress: 1, pending: 0, scheduled: 0 },
  { label: '14', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '15', completed: 0, inProgress: 0, pending: 0, scheduled: 1 },
  { label: '16', completed: 2, inProgress: 0, pending: 1, scheduled: 1 },
  { label: '17', completed: 4, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '18', completed: 1, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '19', completed: 0, inProgress: 0, pending: 0, scheduled: 1 },
  { label: '20', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '21', completed: 3, inProgress: 0, pending: 0, scheduled: 1 },
  { label: '22', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '23', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '24', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '25', completed: 1, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '26', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '27', completed: 0, inProgress: 1, pending: 0, scheduled: 1 },
  { label: '28', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '29', completed: 1, inProgress: 0, pending: 0, scheduled: 1 },
  { label: '30', completed: 0, inProgress: 0, pending: 0, scheduled: 0 },
  { label: '31', completed: 2, inProgress: 0, pending: 0, scheduled: 0 }
];
