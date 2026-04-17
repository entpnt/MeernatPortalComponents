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
        <h1 className="text-3xl font-bold text-foreground mb-2">Account Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into account metrics • Orangeburg Fiber
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
        <div className="p-2 bg-secondary rounded-lg">
          <TrendingUp className="w-5 h-5 text-[var(--info)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Growth Analytics</h2>
          <p className="text-sm text-muted-foreground">Track subscription growth over time</p>
        </div>
      </div>

      {/* Account Growth Trend Card */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-card-foreground mb-1">
              Account Growth Trend
            </h3>
            <p className="text-sm text-muted-foreground">
              Net new accounts over the selected time period
            </p>
          </div>

          {/* Time View Toggle */}
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground mr-2 self-center">View by:</span>
            <Button
              variant={timeView === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeView('daily')}
              className={
                timeView === 'daily'
                  ? 'bg-secondary text-foreground border-border'
                  : 'bg-transparent text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
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
                  ? 'bg-secondary text-foreground border-border'
                  : 'bg-transparent text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
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
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-transparent text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              />
              <YAxis stroke="var(--muted-foreground)" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend
                wrapperStyle={{ color: 'var(--foreground)' }}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>{value}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke="var(--error)"
                strokeWidth={2}
                dot={{ fill: 'var(--error)', r: 4 }}
                name="Cancelled"
              />
              <Line
                type="monotone"
                dataKey="netGrowth"
                stroke="var(--info)"
                strokeWidth={2}
                dot={{ fill: 'var(--info)', r: 4 }}
                name="Net Growth"
              />
              <Line
                type="monotone"
                dataKey="new"
                stroke="var(--success)"
                strokeWidth={2}
                dot={{ fill: 'var(--success)', r: 4 }}
                name="New"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--success)] rounded-full" />
            <span className="text-sm text-muted-foreground">New Accounts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--error)] rounded-full" />
            <span className="text-sm text-muted-foreground">Cancelled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--info)] rounded-full" />
            <span className="text-sm text-muted-foreground">Net Growth</span>
          </div>
        </div>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--success)]/10 rounded-lg">
              <Users className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Growth</p>
              <p className="text-2xl font-bold text-foreground">+128</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Last 12 months</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--info)]/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[var(--info)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Monthly Growth</p>
              <p className="text-2xl font-bold text-foreground">10.7</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Per month average</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--error)]/10 rounded-lg">
              <UserX className="w-5 h-5 text-[var(--error)]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Churned</p>
              <p className="text-2xl font-bold text-foreground">-47</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Last 12 months</p>
        </Card>
      </div>
    </div>
  );
}

// Churn Analysis Tab Component
function ChurnAnalysisTab() {
  // Mock data for churn reasons pie chart
  const churnReasons = [
    { name: 'Price too high', value: 35, color: 'var(--error)' },
    { name: 'Switched providers', value: 25, color: 'var(--warning)' },
    { name: 'Service issues', value: 20, color: 'var(--info)' },
    { name: 'Moving/Relocation', value: 15, color: 'var(--accent)' },
    { name: 'Other', value: 5, color: 'var(--muted)' },
  ];

  return (
    <div className="space-y-6">
      {/* Churn Analysis Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-secondary rounded-lg">
          <UserX className="w-5 h-5 text-[var(--error)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Churn Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Understand why customers are leaving and identify patterns
          </p>
        </div>
      </div>

      {/* Churn Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Churn Rate</p>
            <UserX className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-[var(--error)]">2.4%</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Churned Users</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">12</p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">At Risk</p>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-[var(--warning)]">24</p>
          <p className="text-xs text-muted-foreground mt-1">Low engagement</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Lifetime</p>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">18mo</p>
          <p className="text-xs text-muted-foreground mt-1">Before churning</p>
        </Card>
      </div>

      {/* Churn Reasons Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-base font-semibold text-card-foreground mb-4">
            Churn Reasons Distribution
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={churnReasons}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {churnReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`var(--${entry.color.replace('var(--', '').replace(')', '')})`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Reasons List */}
        <Card className="bg-card border-border p-6">
          <h3 className="text-base font-semibold text-card-foreground mb-4">Top Churn Reasons</h3>
          <div className="space-y-4">
            {churnReasons.map((reason, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-muted-foreground">{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{reason.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {reason.value}% of total churn
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{reason.value}</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${reason.value}%`,
                      backgroundColor: reason.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* At-Risk Customers */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-card-foreground mb-1">
              At-Risk Customers
            </h3>
            <p className="text-sm text-muted-foreground">
              Customers showing signs of potential churn
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground">
            <Mail className="w-4 h-4 mr-2" />
            Send Campaign
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Risk Score</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Last Active</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Doe', email: 'john@example.com', plan: '1GB/1GB', riskScore: 85, lastActive: '30 days ago' },
                { name: 'Jane Smith', email: 'jane@example.com', plan: '100M/100M', riskScore: 72, lastActive: '25 days ago' },
                { name: 'Bob Johnson', email: 'bob@example.com', plan: '2.5GB/2.5GB', riskScore: 68, lastActive: '20 days ago' },
              ].map((customer, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{customer.plan}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      customer.riskScore > 80
                        ? 'bg-destructive/10 text-destructive'
                        : customer.riskScore > 60
                        ? 'bg-[var(--warning)]/10 text-[var(--warning)]'
                        : 'bg-[var(--info)]/10 text-[var(--info)]'
                    }`}>
                      {customer.riskScore}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{customer.lastActive}</td>
                  <td className="px-4 py-4">
                    <Button variant="outline" size="sm" className="border-border text-foreground">
                      Contact
                    </Button>
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
    { cohort: 'Jul 2025', size: 47, month0: 100, month1: 100, month2: 100, month3: 98 },
    { cohort: 'Jun 2025', size: 11, month0: 100, month1: 100, month2: 100, month3: 100 },
    { cohort: 'May 2025', size: 4, month0: 100, month1: 100, month2: 100, month3: 100 },
    { cohort: 'Apr 2025', size: 7, month0: 100, month1: 100, month2: 100, month3: 100 },
  ];

  // Function to determine cell color based on retention rate
  const getCellColor = (value: number | null) => {
    if (value === null) return 'bg-muted';
    if (value >= 95) return 'bg-[var(--success)]/20 text-[var(--success)]';
    if (value >= 85) return 'bg-[var(--info)]/20 text-[var(--info)]';
    if (value >= 70) return 'bg-[var(--warning)]/20 text-[var(--warning)]';
    return 'bg-[var(--error)]/20 text-[var(--error)]';
  };

  return (
    <div className="space-y-6">
      {/* Cohort Retention Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-secondary rounded-lg">
          <TrendingUp className="w-5 h-5 text-[var(--success)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Cohort Retention Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Track how different customer cohorts retain over time
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Overall Retention</p>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-[var(--success)]">97.6%</p>
          <p className="text-xs text-muted-foreground mt-1">All cohorts</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Best Cohort</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">100%</p>
          <p className="text-xs text-muted-foreground mt-1">Sep 2025</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg 3-Month</p>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">98.5%</p>
          <p className="text-xs text-muted-foreground mt-1">Retention rate</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Cohorts</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">8</p>
          <p className="text-xs text-muted-foreground mt-1">Active cohorts</p>
        </Card>
      </div>

      {/* Cohort Retention Table */}
      <Card className="bg-card border-border p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-card-foreground mb-1">
            Cohort Retention Heatmap
          </h3>
          <p className="text-sm text-muted-foreground">
            Percentage of customers retained each month after signup
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Cohort</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Size</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Month 0</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Month 1</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Month 2</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground">Month 3</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((cohort, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{cohort.cohort}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{cohort.size}</td>
                  <td className={`px-4 py-3 text-sm font-medium text-center ${getCellColor(cohort.month0)}`}>
                    {cohort.month0 !== null ? `${cohort.month0}%` : '—'}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-center ${getCellColor(cohort.month1)}`}>
                    {cohort.month1 !== null ? `${cohort.month1}%` : '—'}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-center ${getCellColor(cohort.month2)}`}>
                    {cohort.month2 !== null ? `${cohort.month2}%` : '—'}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-center ${getCellColor(cohort.month3)}`}>
                    {cohort.month3 !== null ? `${cohort.month3}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--success)]/20" />
            <span className="text-xs text-muted-foreground">Excellent (95-100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--info)]/20" />
            <span className="text-xs text-muted-foreground">Good (85-94%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--warning)]/20" />
            <span className="text-xs text-muted-foreground">Fair (70-84%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--error)]/20" />
            <span className="text-xs text-muted-foreground">Poor (&lt;70%)</span>
          </div>
        </div>
      </Card>

      {/* Insights Card */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-base font-semibold text-card-foreground mb-4">Key Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg">
            <div className="p-2 bg-[var(--success)]/20 rounded">
              <TrendingUp className="w-4 h-4 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Strong Overall Retention</p>
              <p className="text-xs text-muted-foreground">
                Your overall retention rate of 97.6% is excellent. Most cohorts maintain 100% retention through their first 3 months.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[var(--info)]/10 border border-[var(--info)]/20 rounded-lg">
            <div className="p-2 bg-[var(--info)]/20 rounded">
              <Info className="w-4 h-4 text-[var(--info)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Consistent Performance</p>
              <p className="text-xs text-muted-foreground">
                Recent cohorts (Sep-Nov 2025) are showing 100% retention, indicating improved onboarding or customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
