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
        <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Cancelled Subscriptions</h1>
        <p className="text-[#94A3B8]">Overview of churned subscribers and cancellation trends</p>
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
          onClick={() => setActiveTab('cancelled-services')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'cancelled-services'
              ? 'text-[#F8FAFC] bg-[#1E293B] rounded-t-lg'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Cancelled Services
        </button>
        <button
          onClick={() => setActiveTab('switch-services')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'switch-services'
              ? 'text-[#F8FAFC] bg-[#1E293B] rounded-t-lg'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
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
          icon={<Calendar className="w-5 h-5 text-[#E60000]" />}
          iconColor="text-[#E60000]"
        />
        <MetricCard
          title="This Month"
          value="0"
          subtitle="Last 30 days"
          icon={<Calendar className="w-5 h-5 text-[#E60000]" />}
          iconColor="text-[#E60000]"
        />
        <MetricCard
          title="Lost MRR"
          value="$0.00"
          subtitle="Monthly recurring revenue"
          icon={<TrendingDown className="w-5 h-5 text-[#E60000]" />}
          iconColor="text-[#E60000]"
          valueColor="text-[#E60000]"
        />
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Cancellation Reasons Pie Chart */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Cancellation Reasons</h3>
            <p className="text-sm text-[#94A3B8]">Distribution of why customers cancelled</p>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <svg viewBox="0 0 200 200" className="w-64 h-64">
              {/* Customer Request - 5 out of 7 = 71.4% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#EF4444"
                strokeWidth="40"
                strokeDasharray="358 360"
                transform="rotate(-90 100 100)"
              />
              {/* Moved Out Of Service Area - 1 out of 7 = 14.3% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#FB923C"
                strokeWidth="40"
                strokeDasharray="51 360"
                strokeDashoffset="-358"
                transform="rotate(-90 100 100)"
              />
              {/* Other - 1 out of 7 = 14.3% */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="40"
                strokeDasharray="51 360"
                strokeDashoffset="-409"
                transform="rotate(-90 100 100)"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#EF4444] rounded"></div>
                <span className="text-sm text-[#94A3B8]">Customer Request</span>
              </div>
              <span className="text-sm text-[#F8FAFC] font-medium">5 (71.4%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FB923C] rounded"></div>
                <span className="text-sm text-[#94A3B8]">Moved Out Of Service Area</span>
              </div>
              <span className="text-sm text-[#F8FAFC] font-medium">1 (14.3%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FBBF24] rounded"></div>
                <span className="text-sm text-[#94A3B8]">Other</span>
              </div>
              <span className="text-sm text-[#F8FAFC] font-medium">1 (14.3%)</span>
            </div>
          </div>
        </div>

        {/* Cancellations by Provider & Plan */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Cancellations by Provider & Plan</h3>
            <p className="text-sm text-[#94A3B8]">Breakdown by service provider and plan type</p>
          </div>

          <div className="h-80 flex items-end gap-8 px-4">
            {/* Advanced Stream */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col gap-1" style={{ height: '280px' }}>
                <div className="flex items-end gap-2 h-full">
                  <div className="flex-1 bg-[#FB923C] rounded-t" style={{ height: '35%' }}></div>
                  <div className="flex-1 bg-[#FBBF24] rounded-t" style={{ height: '70%' }}></div>
                </div>
              </div>
              <span className="text-xs text-[#64748B] mt-2">Advanced Stream</span>
            </div>

            {/* Sumo Fiber */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col gap-1" style={{ height: '280px' }}>
                <div className="flex items-end gap-2 h-full">
                  <div className="flex-1 bg-[#EF4444] rounded-t" style={{ height: '40%' }}></div>
                  <div className="flex-1 bg-[#FBBF24] rounded-t" style={{ height: '45%' }}></div>
                  <div className="flex-1 bg-[#10B981] rounded-t" style={{ height: '85%' }}></div>
                </div>
              </div>
              <span className="text-xs text-[#64748B] mt-2">Sumo Fiber</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[#1E293B]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#EF4444] rounded"></div>
              <span className="text-xs text-[#94A3B8]">100M/100M w/limited support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FB923C] rounded"></div>
              <span className="text-xs text-[#94A3B8]">1GB + Phone Bundle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FBBF24] rounded"></div>
              <span className="text-xs text-[#94A3B8]">1GB/1GB</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#10B981] rounded"></div>
              <span className="text-xs text-[#94A3B8]">2.5GB/2.5GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Reasons by Provider */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Reasons by Provider</h3>
            <p className="text-sm text-[#94A3B8]">Cancellation reasons breakdown per provider</p>
          </div>

          <div className="h-80 flex items-end gap-8 px-4">
            {/* Advanced Stream */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full" style={{ height: '280px' }}>
                <div className="flex flex-col h-full">
                  <div className="bg-[#10B981] rounded-t" style={{ height: '100%' }}></div>
                </div>
              </div>
              <span className="text-xs text-[#64748B] mt-2">Advanced Stream</span>
            </div>

            {/* Sumo Fiber */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full" style={{ height: '280px' }}>
                <div className="flex flex-col h-full justify-end">
                  <div className="bg-[#FBBF24] rounded-t" style={{ height: '25%' }}></div>
                  <div className="bg-[#FB923C]" style={{ height: '25%' }}></div>
                  <div className="bg-[#10B981] rounded-b" style={{ height: '50%' }}></div>
                </div>
              </div>
              <span className="text-xs text-[#64748B] mt-2">Sumo Fiber</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[#1E293B]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#10B981] rounded"></div>
              <span className="text-xs text-[#94A3B8]">Customer Request</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FB923C] rounded"></div>
              <span className="text-xs text-[#94A3B8]">Moved Out Of Service Area</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FBBF24] rounded"></div>
              <span className="text-xs text-[#94A3B8]">Other</span>
            </div>
          </div>
        </div>

        {/* Top Cancellation Reasons */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Top Cancellation Reasons</h3>
            <p className="text-sm text-[#94A3B8]">Most common reasons for churn with lost revenue</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#F8FAFC]">1. Customer Request</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#94A3B8]">5 (60.0%)</span>
                  <span className="text-sm text-[#E60000] font-medium">$382.78</span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                <div className="h-full bg-[#E60000] rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#F8FAFC]">2. Moved Out Of Service Area</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#94A3B8]">1 (100.0%)</span>
                  <span className="text-sm text-[#E60000] font-medium">$99.99</span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                <div className="h-full bg-[#E60000] rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#F8FAFC]">3. Other</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#94A3B8]">1 (100.0%)</span>
                  <span className="text-sm text-[#E60000] font-medium">$69.99</span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                <div className="h-full bg-[#E60000] rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Calendar */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Cancellation Calendar</h3>
            <p className="text-sm text-[#94A3B8]">
              January 2026 - 6 Cancellations <span className="text-[#E60000]">($452.77 lost)</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs bg-[#1E293B] text-[#94A3B8] rounded hover:bg-[#334155]">
              Last Month
            </button>
            <button className="px-3 py-1.5 text-xs bg-white text-[#020817] rounded font-medium">
              This Month
            </button>
          </div>
        </div>

        <div className="h-80 flex items-end gap-2 px-4">
          {calendarData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col-reverse" style={{ height: '280px' }}>
                {day.count > 0 && (
                  <div
                    className="w-full bg-[#EF4444] rounded-t"
                    style={{ height: `${(day.count / 4) * 100}%` }}
                  />
                )}
              </div>
              <span className="text-xs text-[#64748B] mt-2">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CancelledServicesTab() {
  return (
    <div>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Cancelled"
          value="7"
          subtitle="Last 90 days"
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          title="Unique Reasons"
          value="3"
          subtitle="Different cancellation reasons"
          icon={<AlertTriangle className="w-5 h-5 text-[#DC6300]" />}
          iconColor="text-[#DC6300]"
        />
        <MetricCard
          title="Lost MRR"
          value="$552.76"
          subtitle="Monthly revenue lost"
          icon={<TrendingDown className="w-5 h-5 text-[#E60000]" />}
          iconColor="text-[#E60000]"
          valueColor="text-[#E60000]"
        />
      </div>

      {/* Cancelled Subscriptions Section */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-2">Cancelled Subscriptions</h3>
          <p className="text-sm text-[#94A3B8]">
            View and analyze cancelled customer subscriptions.
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
            <option>All Reasons</option>
            <option>Customer Request</option>
            <option>Moved Out Of Service Area</option>
            <option>Other</option>
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
                  <div className="flex items-center gap-1">
                    Account ID
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    Customer
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    Email
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    Plan
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    Price
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    Cancelled Date
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    Reason
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {cancelledSubscriptionsData.map((subscription, index) => (
                <tr key={index} className="border-b border-[#1E293B] hover:bg-[#1E293B]/30">
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#F8FAFC]">{subscription.accountId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#F8FAFC]">{subscription.customerName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#94A3B8]">{subscription.email}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#F8FAFC]">{subscription.plan}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#F8FAFC]">{subscription.price}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#F8FAFC]">{subscription.cancelledDate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 text-xs rounded font-medium ${
                      subscription.reason === 'Customer Request'
                        ? 'bg-[#1E293B] text-[#F8FAFC]'
                        : subscription.reason === 'Moved Out Of Service Area'
                        ? 'bg-[#147FFF] text-white'
                        : 'bg-[#1E293B] text-[#F8FAFC]'
                    }`}>
                      {subscription.reason}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-[#94A3B8]">
          Showing 7 of 7 cancelled subscriptions
        </div>
      </div>
    </div>
  );
}

function SwitchServicesTab() {
  return (
    <div>
      {/* Info Banner */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 mb-8 flex items-start gap-3">
        <ArrowUpDown className="w-5 h-5 text-[#147FFF] flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1">Service Switches Are Not Churn</h3>
          <p className="text-sm text-[#94A3B8]">
            These records show customers who changed plans or providers within the network. They are still active subscribers and are not counted as cancellations in your churn metrics.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Switches"
          value="1"
          subtitle="Last 90 days"
          icon={<ArrowUpDown className="w-5 h-5" />}
        />
        <MetricCard
          title="Upgrades"
          value="0"
          subtitle="Higher tier plans"
          icon={<TrendingDown className="w-5 h-5 text-[#21DB00]" />}
          iconColor="text-[#21DB00]"
        />
        <MetricCard
          title="Downgrades"
          value="1"
          subtitle="Lower tier plans"
          icon={<TrendingDown className="w-5 h-5 text-[#E60000]" />}
          iconColor="text-[#E60000]"
        />
        <MetricCard
          title="Net MRR Impact"
          value="-$30.00"
          subtitle="From 1 customers"
          icon={<DollarSign className="w-5 h-5 text-[#E60000]" />}
          iconColor="text-[#E60000]"
          valueColor="text-[#E60000]"
        />
      </div>

      {/* Service Switch History */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-2">Service Switch History</h3>
          <p className="text-sm text-[#94A3B8]">
            View plan and provider changes within the network. These customers are still active on the network.
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
            <option>Upgrade</option>
            <option>Downgrade</option>
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
                  <div className="flex items-center gap-1">
                    Account ID
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    Customer
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">From Plan</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">To Plan</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    MRR Impact
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    Switch Date
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#94A3B8]">Status</th>
              </tr>
            </thead>
            <tbody>
              {switchServicesData.map((switchData, index) => (
                <tr key={index} className="border-b border-[#1E293B] hover:bg-[#1E293B]/30">
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#F8FAFC]">{switchData.accountId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#F8FAFC]">{switchData.customerName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-[#F8FAFC]">{switchData.fromPlan}</p>
                      <p className="text-xs text-[#94A3B8]">{switchData.fromPrice}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-[#F8FAFC]">{switchData.toPlan}</p>
                      <p className="text-xs text-[#94A3B8]">{switchData.toPrice}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#E60000] font-medium">{switchData.mrrImpact}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-xs bg-[#DC6300] text-white rounded font-medium">
                      {switchData.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#F8FAFC]">{switchData.switchDate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 text-xs bg-[#1E293B] text-[#F8FAFC] rounded font-medium">
                      {switchData.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-[#94A3B8]">
          Showing 1 of 1 service switches
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
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-[#94A3B8]">{title}</h3>
        <div className={iconColor || 'text-[#94A3B8]'}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-semibold mb-1 ${valueColor || 'text-[#F8FAFC]'}`}>
          {value}
        </p>
        <p className="text-xs text-[#94A3B8]">{subtitle}</p>
      </div>
    </div>
  );
}

// Mock data for cancelled subscriptions
const cancelledSubscriptionsData = [
  {
    accountId: 'OF-2025-216943',
    customerName: 'Shameka Rouse',
    email: 'sweetcakerou@yahoo.com',
    plan: '1GB + Phone Bundle',
    price: '$90.90/mo',
    cancelledDate: 'Jan 26, 2026',
    reason: 'Customer Request'
  },
  {
    accountId: 'OF-2025-242148',
    customerName: 'Kenneth Glover',
    email: 'gloverkonsult@gmail.com',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    cancelledDate: 'Jan 23, 2026',
    reason: 'Customer Request'
  },
  {
    accountId: 'OF-2025-829163',
    customerName: 'Martin Ravi',
    email: 'hellopaulmartin@gmail.com',
    plan: '100M/100M w/limited support',
    price: '$59.99/mo',
    cancelledDate: 'Jan 20, 2026',
    reason: 'Customer Request'
  },
  {
    accountId: 'OF-2025-555950',
    customerName: 'Jerome Rhett',
    email: 'jrhette@gmail.com',
    plan: '2.5GB/2.5GB',
    price: '$99.99/mo',
    cancelledDate: 'Jan 20, 2026',
    reason: 'Moved Out Of Service Area'
  },
  {
    accountId: 'OF-2025-564874',
    customerName: 'Timothy Johnson',
    email: 'waitingforchange1988@gmail.com',
    plan: '1GB/1GB',
    price: '$69.99/mo',
    cancelledDate: 'Jan 15, 2026',
    reason: 'Other'
  },
  {
    accountId: 'OF-2025-983125',
    customerName: 'Shannon Mccants',
    email: 'shannonmccants80@gmail.com',
    plan: '1GB/1GB',
    price: '$65.95/mo',
    cancelledDate: 'Jan 15, 2026',
    reason: 'Customer Request'
  },
  {
    accountId: 'OF-2025-754177',
    customerName: 'Tamieka Bockhart',
    email: 'tamieka0981@hotmail.com',
    plan: '2.5GB/2.5GB',
    price: '$99.99/mo',
    cancelledDate: 'Dec 31, 2025',
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
  { label: '15', count: 2 },
  { label: '16', count: 0 },
  { label: '17', count: 0 },
  { label: '18', count: 0 },
  { label: '19', count: 0 },
  { label: '20', count: 2 },
  { label: '21', count: 0 },
  { label: '22', count: 0 },
  { label: '23', count: 1 },
  { label: '24', count: 0 },
  { label: '25', count: 0 },
  { label: '26', count: 1 },
  { label: '27', count: 0 },
  { label: '28', count: 0 },
  { label: '29', count: 0 },
  { label: '30', count: 0 },
  { label: '31', count: 0 }
];