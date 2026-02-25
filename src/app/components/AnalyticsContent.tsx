import { useState } from 'react';
import { TrendingUp, UserX, Users, RefreshCw, Search, Mail, Info, ArrowLeft } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { TabMenu, TabContent } from '@/app/components/ui/tab-menu';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type TabType = 'growth-trends' | 'churn-analysis' | 'cohort-retention';
type TimeView = 'daily' | 'weekly' | 'monthly';

interface AnalyticsContentProps {
  onNavigateBack?: () => void;
}

export function AnalyticsContent({ onNavigateBack }: AnalyticsContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('growth-trends');

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Subscription Analytics</h1>
        <p className="text-[#94A3B8]">
          Comprehensive insights into subscriber metrics • Orangeburg Fiber
        </p>
      </div>

      {/* Tabs */}
      <TabMenu
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
        tabs={[
          { id: 'growth-trends', label: 'Growth Trends' },
          { id: 'churn-analysis', label: 'Churn Analysis' },
          { id: 'cohort-retention', label: 'Cohort Retention' },
        ]}
      />

      {/* Tab Content */}
      {activeTab === 'growth-trends' && <GrowthTrendsTab />}
      {activeTab === 'churn-analysis' && <ChurnAnalysisTab />}
      {activeTab === 'cohort-retention' && <CohortRetentionTab />}
    </div>
  );
}

// Growth Trends Tab Component
function GrowthTrendsTab() {
  const [timeView, setTimeView] = useState<TimeView>('monthly');

  // Mock data for the line chart
  const growthData = [
    { month: 'Nov 2023', cancelled: 5, netGrowth: 3, new: 8 },
    { month: 'Jan 2024', cancelled: 4, netGrowth: 5, new: 9 },
    { month: 'Mar 2024', cancelled: 3, netGrowth: 4, new: 7 },
    { month: 'May 2024', cancelled: 4, netGrowth: 6, new: 10 },
    { month: 'Jul 2024', cancelled: 5, netGrowth: 7, new: 12 },
    { month: 'Sep 2024', cancelled: 6, netGrowth: 8, new: 14 },
    { month: 'Nov 2024', cancelled: 4, netGrowth: 5, new: 9 },
    { month: 'Jan 2025', cancelled: 3, netGrowth: 4, new: 7 },
    { month: 'Mar 2025', cancelled: 5, netGrowth: 6, new: 11 },
    { month: 'May 2025', cancelled: 4, netGrowth: 7, new: 11 },
    { month: 'Jul 2025', cancelled: 2, netGrowth: 45, new: 47 },
    { month: 'Sep 2025', cancelled: 8, netGrowth: 48, new: 56 },
    { month: 'Nov 2025', cancelled: 12, netGrowth: 32, new: 44 },
  ];

  return (
    <div className="space-y-6">
      {/* Growth Analytics Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-[#1E293B] rounded-lg">
          <TrendingUp className="w-5 h-5 text-[#147FFF]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#F8FAFC] mb-1">Growth Analytics</h2>
          <p className="text-sm text-[#94A3B8]">Track subscription growth over time</p>
        </div>
      </div>

      {/* Subscription Growth Trend Card */}
      <Card className="bg-[#0F172A] border-[#1E293B] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
              Subscription Growth Trend
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Net new subscriptions over the selected time period
            </p>
          </div>

          {/* Time View Toggle */}
          <div className="flex gap-2">
            <span className="text-sm text-[#94A3B8] mr-2 self-center">View by:</span>
            <Button
              variant={timeView === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeView('daily')}
              className={
                timeView === 'daily'
                  ? 'bg-[#1E293B] text-[#F8FAFC] border-[#1E293B]'
                  : 'bg-transparent text-[#94A3B8] border-[#1E293B] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
              }
            >
              Daily
            </Button>
            <Button
              variant={timeView === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeView('weekly')}
              className={
                timeView === 'weekly'
                  ? 'bg-[#1E293B] text-[#F8FAFC] border-[#1E293B]'
                  : 'bg-transparent text-[#94A3B8] border-[#1E293B] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
              }
            >
              Weekly
            </Button>
            <Button
              variant={timeView === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeView('monthly')}
              className={
                timeView === 'monthly'
                  ? 'bg-[#F8FAFC] text-[#020817] border-[#F8FAFC]'
                  : 'bg-transparent text-[#94A3B8] border-[#1E293B] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
              }
            >
              Monthly
            </Button>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growthData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                tick={{ fill: '#94A3B8', fontSize: 12 }}
              />
              <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                }}
                labelStyle={{ color: '#F8FAFC' }}
              />
              <Legend
                wrapperStyle={{ color: '#F8FAFC' }}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: '#94A3B8', fontSize: '14px' }}>{value}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke="#FF5C5C"
                strokeWidth={2}
                dot={{ fill: '#FF5C5C', r: 4 }}
                name="Cancelled"
              />
              <Line
                type="monotone"
                dataKey="netGrowth"
                stroke="#147FFF"
                strokeWidth={2}
                dot={{ fill: '#147FFF', r: 4 }}
                name="Net Growth"
              />
              <Line
                type="monotone"
                dataKey="new"
                stroke="#21DB00"
                strokeWidth={2}
                dot={{ fill: '#21DB00', r: 4 }}
                name="New"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

// Churn Analysis Tab Component
function ChurnAnalysisTab() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for pie chart
  const churnReasons = [
    { name: 'Customer Request', value: 45, color: '#94A3B8' },
    { name: 'Moved Out Of Service Area', value: 30, color: '#64748B' },
    { name: 'Other', value: 25, color: '#475569' },
  ];

  // Mock data for recently cancelled subscriptions
  const cancelledSubscriptions = [
    {
      id: '1',
      name: 'Shameka Rouse',
      email: 'sweetcakerou@yahoo.com',
      accountNumber: 'OF-2025-216943',
      plan: '1GB + Phone Bundle',
      planDetail: 'via Advanced Stream',
      mrrLost: '-$90.90',
      reason: 'Customer Request',
      cancelled: 'Jan 26, 2026',
      cancelledTime: '10:11 AM',
    },
    {
      id: '2',
      name: 'Kenneth Glover',
      email: 'gloverfkconsult@gmail.com',
      accountNumber: 'OF-2025-242148',
      plan: '1GB/1GB',
      planDetail: 'via Advanced Stream',
      mrrLost: '-$65.95',
      reason: 'Customer Request',
      cancelled: 'Jan 23, 2026',
      cancelledTime: '12:31 PM',
    },
    {
      id: '3',
      name: 'Martin Ravi',
      email: 'helpauimartin@gmail.com',
      accountNumber: 'OF-2025-828163',
      plan: '100M/100M w/limited support',
      planDetail: 'via Sumo Fiber',
      mrrLost: '-$59.99',
      reason: 'Customer Request',
      cancelled: 'Jan 20, 2026',
      cancelledTime: '2:51 PM',
    },
    {
      id: '4',
      name: 'Jerome Rhett',
      email: 'jrhette@gmail.com',
      accountNumber: 'OF-2025-555958',
      plan: '2.5GB/2.5GB',
      planDetail: 'via Sumo Fiber',
      mrrLost: '-$99.99',
      reason: 'Moved Out Of Service Area',
      cancelled: 'Jan 20, 2026',
      cancelledTime: '1:42 PM',
    },
    {
      id: '5',
      name: 'Timothy Johnson',
      email: 'waitingforchange1989@gmail.com',
      accountNumber: 'OF-2025-564874',
      plan: '1GB/1GB',
      planDetail: 'via Sumo Fiber',
      mrrLost: '-$69.99',
      reason: 'Other',
      cancelled: 'Jan 15, 2026',
      cancelledTime: '4:22 PM',
    },
    {
      id: '6',
      name: 'Shannon Mccants',
      email: 'shannonmccants80@gmail.com',
      accountNumber: 'OF-2025-981125',
      plan: '1GB/1GB',
      planDetail: 'via Advanced Stream',
      mrrLost: '-$65.95',
      reason: 'Customer Request',
      cancelled: 'Jan 15, 2026',
      cancelledTime: '3:41 PM',
    },
    {
      id: '7',
      name: 'Tamieka Bookhart',
      email: 'tamiekab0981@hotmail.com',
      accountNumber: 'OF-2025-754177',
      plan: '2.5GB/2.5GB',
      planDetail: 'via Sumo Fiber',
      mrrLost: '-$99.99',
      reason: 'Customer Request',
      cancelled: 'Dec 31, 2025',
      cancelledTime: '4:12 PM',
    },
  ];

  const filteredSubscriptions = cancelledSubscriptions.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Churn Analysis Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#1E293B] rounded-lg">
            <UserX className="w-5 h-5 text-[#FF5C5C]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-1">Churn Analysis</h2>
            <p className="text-sm text-[#94A3B8]">Understand why customers are leaving</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent text-[#94A3B8] border-[#1E293B] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Cancellation Reasons Card */}
      <Card className="bg-[#0F172A] border-[#1E293B] p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
            Cancellation Reasons
          </h3>
          <p className="text-sm text-[#94A3B8]">
            Distribution of cancellation reasons in the last 30 days
          </p>
        </div>

        {/* Pie Chart */}
        <div className="h-[400px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={churnReasons}
                cx="50%"
                cy="50%"
                innerRadius={120}
                outerRadius={180}
                paddingAngle={2}
                dataKey="value"
              >
                {churnReasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  color: '#F8FAFC',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="square"
                formatter={(value) => (
                  <span style={{ color: '#94A3B8', fontSize: '14px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recently Cancelled Card */}
      <Card className="bg-[#0F172A] border-[#1E293B] p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
            Recently Cancelled
          </h3>
          <p className="text-sm text-[#94A3B8] mb-4">
            Subscriptions cancelled in the last 30 days
          </p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <Input
              placeholder="Search by name, email, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#94A3B8]">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#94A3B8]">
                  Plan
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#94A3B8]">
                  MRR Lost
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#94A3B8]">
                  Reason
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#94A3B8]">
                  Cancelled
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#94A3B8]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-[#1E293B] hover:bg-[#1E293B]/30">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]">{sub.name}</p>
                      <p className="text-xs text-[#94A3B8]">{sub.email}</p>
                      <p className="text-xs text-[#64748B]">{sub.accountNumber}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]">{sub.plan}</p>
                      <p className="text-xs text-[#94A3B8]">{sub.planDetail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm font-medium text-[#FF5C5C]">{sub.mrrLost}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-xs font-medium bg-[#1E293B] text-[#F8FAFC] rounded-full">
                        {sub.reason}
                      </span>
                      {sub.reason !== 'Other' && (
                        <Info className="w-4 h-4 text-[#94A3B8]" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]">{sub.cancelled}</p>
                      <p className="text-xs text-[#94A3B8]">{sub.cancelledTime}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button className="p-2 hover:bg-[#1E293B] rounded">
                      <Mail className="w-4 h-4 text-[#94A3B8]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Cohort Retention Tab Component
function CohortRetentionTab() {
  // Mock cohort retention data
  const cohortData = [
    { cohort: 'Nov 2025', size: 32, month0: 100, month1: null, month2: null, month3: null },
    { cohort: 'Oct 2025', size: 33, month0: 100, month1: 100, month2: null, month3: null },
    { cohort: 'Sep 2025', size: 44, month0: 100, month1: 100, month2: 100, month3: null },
    { cohort: 'Aug 2025', size: 51, month0: 100, month1: 100, month2: 100, month3: 100 },
  ];

  const getRetentionColor = (rate: number | null) => {
    if (rate === null) return 'bg-[#0F172A]';
    if (rate >= 95) return 'bg-[#21DB00]/80';
    if (rate >= 80) return 'bg-[#21DB00]/60';
    if (rate >= 60) return 'bg-[#DC6300]/60';
    return 'bg-[#FF5C5C]/60';
  };

  return (
    <div className="space-y-6">
      {/* Cohort Retention Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-[#1E293B] rounded-lg">
          <Users className="w-5 h-5 text-[#9333EA]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#F8FAFC] mb-1">Cohort Retention</h2>
          <p className="text-sm text-[#94A3B8]">Track retention rates by signup cohort</p>
        </div>
      </div>

      {/* Retention Heatmap Card */}
      <Card className="bg-[#0F172A] border-[#1E293B] p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Retention Heatmap</h3>
          <p className="text-sm text-[#94A3B8] mb-4">
            Monthly retention rates for each signup cohort
          </p>

          {/* Legend */}
          <div className="flex items-center gap-6 text-xs">
            <span className="text-[#94A3B8]">Retention:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#21DB00]/80"></div>
              <span className="text-[#94A3B8]">&gt;95%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#21DB00]/60"></div>
              <span className="text-[#94A3B8]">80-95%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#DC6300]/60"></div>
              <span className="text-[#94A3B8]">60-80%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#FF5C5C]/60"></div>
              <span className="text-[#94A3B8]">&lt;60%</span>
            </div>
          </div>
        </div>

        {/* Heatmap Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[#94A3B8]">
                  Cohort
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[#94A3B8]">Size</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-[#94A3B8]">
                  Month 0
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-[#94A3B8]">
                  Month 1
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-[#94A3B8]">
                  Month 2
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-[#94A3B8]">
                  Month 3
                </th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((cohort, index) => (
                <tr key={index} className="border-b border-[#1E293B]">
                  <td className="py-4 px-4 text-sm font-medium text-[#F8FAFC]">
                    {cohort.cohort}
                  </td>
                  <td className="py-4 px-4 text-sm text-[#94A3B8]">{cohort.size}</td>
                  <td className="py-4 px-4">
                    <div
                      className={`${getRetentionColor(
                        cohort.month0
                      )} h-12 flex items-center justify-center rounded`}
                    >
                      <span className="text-sm font-medium text-[#F8FAFC]">
                        {cohort.month0 !== null ? `${cohort.month0}%` : ''}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className={`${getRetentionColor(
                        cohort.month1
                      )} h-12 flex items-center justify-center rounded`}
                    >
                      <span className="text-sm font-medium text-[#F8FAFC]">
                        {cohort.month1 !== null ? `${cohort.month1}%` : ''}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className={`${getRetentionColor(
                        cohort.month2
                      )} h-12 flex items-center justify-center rounded`}
                    >
                      <span className="text-sm font-medium text-[#F8FAFC]">
                        {cohort.month2 !== null ? `${cohort.month2}%` : ''}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className={`${getRetentionColor(
                        cohort.month3
                      )} h-12 flex items-center justify-center rounded`}
                    >
                      <span className="text-sm font-medium text-[#F8FAFC]">
                        {cohort.month3 !== null ? `${cohort.month3}%` : ''}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-[#1E293B]">
          <div>
            <p className="text-sm text-[#94A3B8] mb-2">Average Month 1 Retention</p>
            <p className="text-3xl font-bold text-[#F8FAFC]">100.0%</p>
          </div>
          <div>
            <p className="text-sm text-[#94A3B8] mb-2">Average Month 3 Retention</p>
            <p className="text-3xl font-bold text-[#F8FAFC]">100.0%</p>
          </div>
          <div>
            <p className="text-sm text-[#94A3B8] mb-2">Total Cohort Customers</p>
            <p className="text-3xl font-bold text-[#F8FAFC]">160</p>
          </div>
        </div>
      </Card>
    </div>
  );
}