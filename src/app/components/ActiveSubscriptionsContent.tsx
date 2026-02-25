import { useState } from 'react';
import { Search, RefreshCw, Users, TrendingUp, TrendingDown, DollarSign, MoreHorizontal, ChevronDown, ArrowUpDown, ArrowLeft } from 'lucide-react';
import { TablePagination } from '@/app/components/TablePagination';

type TabType = 'overview' | 'active-services' | 'service-changes';

interface ActiveSubscriptionsContentProps {
  onNavigateBack?: () => void;
}

export function ActiveSubscriptionsContent({ onNavigateBack }: ActiveSubscriptionsContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Active Subscriptions</h1>
        <p className="text-[#94A3B8]">Overview of your active subscriber base</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-[#1E293B]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'overview'
              ? 'text-[#F8FAFC] bg-[#1E293B] rounded-t-lg'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('active-services')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'active-services'
              ? 'text-[#F8FAFC] bg-[#1E293B] rounded-t-lg'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Active Services
        </button>
        <button
          onClick={() => setActiveTab('service-changes')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'service-changes'
              ? 'text-[#F8FAFC] bg-[#1E293B] rounded-t-lg'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Service Changes
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'active-services' && <ActiveServicesTab />}
      {activeTab === 'service-changes' && <ServiceChangesTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Active"
          value="0"
          subtitle="Active subscriptions"
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          title="New This Month"
          value="+0"
          subtitle="New activations"
          icon={<TrendingUp className="w-5 h-5 text-[var(--success)]" />}
          trend="positive"
        />
        <MetricCard
          title="Churned This Month"
          value="-0"
          subtitle="Net 0 subscribers"
          icon={<TrendingDown className="w-5 h-5 text-[#E60000]" />}
          trend="negative"
        />
        <MetricCard
          title="Monthly Revenue"
          value="$0"
          subtitle="Recurring revenue"
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscriptions by Provider & Plan */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-2">
            Subscriptions by Provider & Plan
          </h3>
          <p className="text-sm text-[#94A3B8] mb-6">
            Distribution of active subscriptions across providers and plans
          </p>
          
          <div className="h-64 flex items-end gap-12">
            {/* Simple bar chart representation */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-[var(--success)] h-48 rounded-t"></div>
              <p className="text-xs text-[#94A3B8] mt-2">Sumo fiber</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-[var(--success)] rounded"></div>
            <span className="text-xs text-[#94A3B8]">300 megabit internet</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-2">Top Products</h3>
          <p className="text-sm text-[#94A3B8] mb-6">
            Most popular plans by active subscription count
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium text-[#94A3B8]">1</span>
                  <div>
                    <p className="text-sm font-medium text-[#F8FAFC]">300 megabit internet</p>
                    <p className="text-xs text-[#94A3B8]">Sumo fiber</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#F8FAFC]">1</p>
                  <p className="text-xs text-[#94A3B8]">100.0%</p>
                </div>
              </div>
              <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--success)] h-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-xs text-[var(--success)] text-right mt-1">$38.25 MRR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveServicesTab() {
  return (
    <div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Active"
          value="1"
          subtitle="Active subscriptions"
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          title="Service Synced"
          value="1"
          subtitle="0 not synced"
          icon={<RefreshCw className="w-5 h-5 text-[var(--success)]" />}
        />
        <MetricCard
          title="Fiberspark"
          value="0"
          subtitle="0.0% of total"
          icon={<div className="w-5 h-5 bg-[#147FFF] rounded"></div>}
        />
        <MetricCard
          title="Sumo Fiber"
          value="1"
          subtitle="100.0% of total"
          icon={<div className="w-5 h-5 bg-[var(--success)] rounded"></div>}
        />
      </div>

      {/* Active Services Section */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-2">Active Services</h3>
          <p className="text-sm text-[#94A3B8]">
            Manage active customer subscriptions. Cancel or switch service plans.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by name, email, or account ID..."
              className="w-full pl-10 pr-4 py-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#147FFF]"
            />
          </div>
          <select className="pl-4 pr-10 py-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#147FFF] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3d%2214%22%20height%3d%228%22%20viewBox%3d%220%200%2014%208%22%20fill%3d%22none%22%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%3e%3cpath%20d%3d%22M1%201L7%207L13%201%22%20stroke%3d%22%2394A3B8%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:10px_6px] bg-[right_1rem_center] bg-no-repeat">
            <option>All Providers</option>
          </select>
          <select className="pl-4 pr-10 py-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#147FFF] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3d%2214%22%20height%3d%228%22%20viewBox%3d%220%200%2014%208%22%20fill%3d%22none%22%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%3e%3cpath%20d%3d%22M1%201L7%207L13%201%22%20stroke%3d%22%2394A3B8%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:10px_6px] bg-[right_1rem_center] bg-no-repeat">
            <option>All Plans</option>
          </select>
          <select className="pl-4 pr-10 py-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#147FFF] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3d%2214%22%20height%3d%228%22%20viewBox%3d%220%200%2014%208%22%20fill%3d%22none%22%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%3e%3cpath%20d%3d%22M1%201L7%207L13%201%22%20stroke%3d%22%2394A3B8%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:10px_6px] bg-[right_1rem_center] bg-no-repeat">
            <option>All Services (1)</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] border border-[#1E293B] rounded-lg text-sm text-[#F8FAFC] hover:bg-[#2D3F5E] focus:outline-none focus:ring-2 focus:ring-[#147FFF]">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    Account ID
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    Customer
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Plan / Provider</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    Price
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    Start Date
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Address</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#1E293B] hover:bg-[#1E293B]/30">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                    <span className="text-sm text-[#F8FAFC]">JB-2826-716539</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm text-[#F8FAFC] font-medium">Jamestown Device Test</p>
                    <p className="text-xs text-[#94A3B8]">jrosario+testdevice@entpnt.com</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm text-[#F8FAFC]">300 Megabit Internet</p>
                    <p className="text-xs text-[#94A3B8]">Sumo Fiber</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[#F8FAFC]">$38.25/mo</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[#F8FAFC]">Jan 21, 2026</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[#F8FAFC]">149 CAMP ST, JAMESTO...</span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-[#94A3B8] hover:text-[#F8FAFC]">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
          className="mt-6"
        />
      </div>
    </div>
  );
}

function ServiceChangesTab() {
  return (
    <div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Switches"
          value="4"
          subtitle="This month"
          icon={<RefreshCw className="w-5 h-5" />}
        />
        <MetricCard
          title="Upgrades"
          value="0"
          subtitle="Higher tier moves"
          icon={<TrendingUp className="w-5 h-5 text-[var(--success)]" />}
          trend="positive"
        />
        <MetricCard
          title="Downgrades"
          value="0"
          subtitle="Lower tier moves"
          icon={<TrendingDown className="w-5 h-5 text-[#E60000]" />}
          trend="negative"
        />
        <MetricCard
          title="Net MRR Impact"
          value="+$2.50"
          subtitle="Monthly revenue change"
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Service Changes Section */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-2">Service Changes</h3>
          <p className="text-sm text-[#94A3B8]">
            View account service switching history and plan changes.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by name, email, or account ID..."
              className="w-full pl-10 pr-4 py-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#147FFF]"
            />
          </div>
          <select className="pl-4 pr-10 py-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#147FFF] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3d%2214%22%20height%3d%228%22%20viewBox%3d%220%200%2014%208%22%20fill%3d%22none%22%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%3e%3cpath%20d%3d%22M1%201L7%207L13%201%22%20stroke%3d%22%2394A3B8%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:10px_6px] bg-[right_1rem_center] bg-no-repeat">
            <option>All Types</option>
          </select>
          <select className="pl-4 pr-10 py-2 bg-[#020817] border border-[#1E293B] rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#147FFF] appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3d%2214%22%20height%3d%228%22%20viewBox%3d%220%200%2014%208%22%20fill%3d%22none%22%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%3e%3cpath%20d%3d%22M1%201L7%207L13%201%22%20stroke%3d%22%2394A3B8%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:10px_6px] bg-[right_1rem_center] bg-no-repeat">
            <option>All Statuses</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] border border-[#1E293B] rounded-lg text-sm text-[#F8FAFC] hover:bg-[#2D3F5E] focus:outline-none focus:ring-2 focus:ring-[#147FFF]">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Account ID</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Plan Change</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Price Change</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Date</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Status</th>
              </tr>
            </thead>
            <tbody>
              {serviceChangesData.map((change, index) => (
                <tr key={index} className="border-b border-[#1E293B] hover:bg-[#1E293B]/30">
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#F8FAFC]">{change.accountId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-[#F8FAFC] font-medium">{change.customerName}</p>
                      <p className="text-xs text-[#94A3B8]">{change.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#94A3B8]">{change.planFrom}</span>
                      <span className="text-[#94A3B8]">→</span>
                      <span className="text-[#F8FAFC] font-medium">{change.planTo}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 text-xs bg-[#1E293B] text-[#94A3B8] rounded">
                      {change.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-sm font-medium ${
                      change.priceChange.startsWith('+') ? 'text-[var(--success)]' : 
                      change.priceChange.startsWith('-') ? 'text-[#E60000]' : 
                      'text-[#F8FAFC]'
                    }`}>
                      {change.priceChange}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#F8FAFC]">{change.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-xs bg-white text-[#020817] rounded-full font-medium">
                      {change.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6">
          <p className="text-sm text-[#94A3B8]">Showing 5 of 5 service changes</p>
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
  trend?: 'positive' | 'negative';
}

function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-[#94A3B8]">{title}</h3>
        <div className={`${
          trend === 'positive' ? 'text-[var(--success)]' : 
          trend === 'negative' ? 'text-[#E60000]' : 
          'text-[#94A3B8]'
        }`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-semibold mb-1 ${
          trend === 'positive' ? 'text-[var(--success)]' : 
          trend === 'negative' ? 'text-[#E60000]' : 
          'text-[#F8FAFC]'
        }`}>
          {value}
        </p>
        <p className="text-xs text-[#94A3B8]">{subtitle}</p>
      </div>
    </div>
  );
}

// Mock data for service changes
const serviceChangesData = [
  {
    accountId: 'JB-2826-716539',
    customerName: 'Jamestown Device Test',
    customerEmail: 'jrosario+testdevice@entpnt.com',
    planFrom: 'Fiberspark Economy 300 Mbps',
    planTo: '300 Megabit Internet',
    type: 'different_provider',
    priceChange: '$0.00/mo',
    date: 'Jan 22, 2026',
    status: 'Completed'
  },
  {
    accountId: 'JB-2825-666885',
    customerName: 'Jamestown Test',
    customerEmail: 'rdarling@jamestown@entpnt.com',
    planFrom: '300 Megabit Internet',
    planTo: '600 Megabit Internet',
    type: 'different_provider',
    priceChange: '+$2.50/mo',
    date: 'Jan 13, 2026',
    status: 'Completed'
  },
  {
    accountId: 'JB-2825-666885',
    customerName: 'Jamestown Test',
    customerEmail: 'rdarling@jamestown@entpnt.com',
    planFrom: '600 Megabit Internet',
    planTo: '300 Megabit Internet',
    type: 'different_provider',
    priceChange: '-$2.50/mo',
    date: 'Jan 13, 2026',
    status: 'Completed'
  },
  {
    accountId: 'JB-2825-666885',
    customerName: 'Jamestown Test',
    customerEmail: 'rdarling@jamestown@entpnt.com',
    planFrom: '300 Megabit Internet',
    planTo: '600 Megabit Internet',
    type: 'different_provider',
    priceChange: '+$2.50/mo',
    date: 'Jan 12, 2026',
    status: 'Completed'
  },
  {
    accountId: 'JB-2825-666885',
    customerName: 'Jamestown Test',
    customerEmail: 'rdarling@jamestown@entpnt.com',
    planFrom: '1 Gigabit Internet',
    planTo: '300 Megabit Internet',
    type: 'different_provider',
    priceChange: '-$5.00/mo',
    date: 'Dec 31, 2025',
    status: 'Completed'
  }
];