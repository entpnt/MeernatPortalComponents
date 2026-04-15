import { useState } from 'react';
import { RefreshCw, Users, Clock, AlertTriangle, TrendingUp, CheckCircle, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { TablePagination } from '@/app/components/TablePagination';

type TabType = 'overview' | 'completed-flow' | 'planned-flow';

interface OnboardingContentProps {
  onNavigateBack?: () => void;
}

export function OnboardingContent({ onNavigateBack }: OnboardingContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Onboarding Pipeline</h1>
        <p className="text-muted-foreground">Track customer progress through the signup process • Orangeburg Fiber</p>
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
          onClick={() => setActiveTab('completed-flow')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'completed-flow'
              ? 'text-foreground bg-secondary rounded-t-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Completed Flow
          <span className="ml-2 px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full">18</span>
        </button>
        <button
          onClick={() => setActiveTab('planned-flow')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'planned-flow'
              ? 'text-foreground bg-secondary rounded-t-lg'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Planned Flow
          <span className="ml-2 px-2 py-0.5 text-xs bg-[var(--warning)] text-white rounded-full">16</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'completed-flow' && <CompletedFlowTab />}
      {activeTab === 'planned-flow' && <PlannedFlowTab />}
    </div>
  );
}

// Overview Tab Component
function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total in Funnel</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">345</p>
          <p className="text-xs text-muted-foreground mt-1">Active signups</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Completed</p>
            <CheckCircle className="w-4 h-4 text-[var(--success)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--success)]">315</p>
          <p className="text-xs text-muted-foreground mt-1">Finished onboarding</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <Clock className="w-4 h-4 text-[var(--warning)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--warning)]">30</p>
          <p className="text-xs text-muted-foreground mt-1">166 waiting for address</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <TrendingUp className="w-4 h-4 text-[var(--info)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--info)]">91.3%</p>
          <p className="text-xs text-muted-foreground mt-1">Overall success rate</p>
        </Card>
      </div>

      {/* Flow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Completed Flow</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">154</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-xl font-bold text-[var(--success)]">137</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rate</span>
              <span className="text-xl font-bold text-[var(--info)]">89.0%</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              Avg 64.9 days since signup (88% avg completion)
            </p>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Planned Flow</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">166</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-xl font-bold text-[var(--success)]">155</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rate</span>
              <span className="text-xl font-bold text-[var(--info)]">93.4%</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              Avg 59.0 days since signup (85% avg completion)
            </p>
          </div>
        </Card>
      </div>

      {/* Additional Flow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Planned Flow (Planned To Completed)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">17</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-xl font-bold text-[var(--success)]">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rate</span>
              <span className="text-xl font-bold text-[var(--info)]">88.2%</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              Avg 67.5 days since signup (82% avg completion)
            </p>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Unknown Flow (Unknown)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-foreground">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-xl font-bold text-[var(--success)]">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rate</span>
              <span className="text-xl font-bold text-[var(--info)]">100.0%</span>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              Avg 109.9 days since signup (97% avg completion)
            </p>
          </div>
        </Card>
      </div>

      {/* Onboarding Funnel */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Onboarding Funnel</h3>
            <p className="text-sm text-muted-foreground">Customer progression through the signup process</p>
          </div>
          <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Stats
          </Button>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Create Account', completed: 345, planned: 0, total: 345 },
            { label: 'Rent or Own?', completed: 300, planned: 0, total: 345 },
            { label: 'Property Access Agreement', completed: 280, planned: 90, total: 345 },
            { label: 'We\'ll Be In Touch!', completed: 260, planned: 0, total: 345 },
            { label: 'Service Selection', completed: 240, planned: 0, total: 345 },
            { label: 'Review & Confirm', completed: 240, planned: 0, total: 345 },
            { label: 'Installation Scheduling', completed: 220, planned: 0, total: 345 },
            { label: 'Save Payment Method', completed: 200, planned: 0, total: 345 },
            { label: 'Final Confirmation', completed: 180, planned: 0, total: 345 },
          ].map((stage, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{stage.label}</span>
                <span className="text-foreground">{stage.completed + stage.planned}</span>
              </div>
              <div className="relative h-8 bg-muted rounded overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-[var(--info)]"
                  style={{ width: `${(stage.completed / stage.total) * 100}%` }}
                />
                {stage.planned > 0 && (
                  <div
                    className="absolute top-0 h-full bg-[var(--accent)]"
                    style={{
                      left: `${(stage.completed / stage.total) * 100}%`,
                      width: `${(stage.planned / stage.total) * 100}%`,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--info)] rounded" />
            <span className="text-sm text-muted-foreground">Completed Flow (Address Ready)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[var(--accent)] rounded" />
            <span className="text-sm text-muted-foreground">Planned Flow (Address Not Ready)</span>
          </div>
        </div>
      </Card>

      {/* Drop-off Analysis */}
      <Card className="bg-card border-border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-1">Drop-off Analysis</h3>
          <p className="text-sm text-muted-foreground">Identify where customers are leaving the funnel</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 bg-secondary text-foreground rounded text-sm font-medium">
            All (345)
          </button>
          <button className="px-4 py-2 text-muted-foreground hover:text-foreground rounded text-sm font-medium">
            Completed (257)
          </button>
          <button className="px-4 py-2 text-muted-foreground hover:text-foreground rounded text-sm font-medium">
            Planned (88)
          </button>
        </div>

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="text-sm font-semibold text-foreground">Highest Drop-off</span>
            </div>
            <span className="px-2 py-1 bg-[var(--accent)] text-white text-xs rounded">Planned</span>
          </div>
          <p className="text-lg font-bold text-foreground mb-1">We'll Be in Touch!</p>
          <p className="text-sm text-destructive">100.0% drop-off rate (88 users)</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Top Problem Steps</h4>
          {[
            { step: 'We\'ll Be in Touch!', count: 88, rate: '100.0%', flow: 'Planned' },
            { step: 'Final Confirmation', count: 88, rate: '100.0%', flow: 'Completed' },
            { step: 'Property Access Agreement', count: 80, rate: '33.3%', flow: 'Completed' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  item.flow === 'Planned' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--info)] text-white'
                }`}>
                  {item.flow}
                </span>
                <span className="text-sm text-foreground">{item.step}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-destructive">{item.count}</div>
                <div className="text-xs text-muted-foreground">→ {item.rate}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Dropped Off</span>
            <span className="text-foreground font-semibold">345</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">● Completed Flow</span>
            <span className="text-foreground font-semibold">257</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">● Planned Flow</span>
            <span className="text-foreground font-semibold">88</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Completed Flow Tab Component
function CompletedFlowTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total in Flow</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">154</p>
          <p className="text-xs text-muted-foreground mt-1">137 completed, 17 stuck</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Avg Days to Service</p>
            <Clock className="w-4 h-4 text-[var(--info)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--info)]">52.4</p>
          <p className="text-xs text-muted-foreground mt-1">54 users with service</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">At Risk</p>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10 mb-3">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-destructive">17</p>
          <p className="text-xs text-muted-foreground mt-1">Stuck &gt;14 days</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Needs Follow-up</p>
            <TrendingUp className="w-4 h-4 text-[var(--warning)]" />
          </div>
          <p className="text-3xl font-bold text-muted-foreground">0</p>
          <p className="text-xs text-muted-foreground mt-1">Stuck 7-14 days</p>
        </Card>
      </div>

      {/* Time to Service Metrics */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Time to Service Metrics</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Days from account creation to first service activation (uses original subscription date for switchers)
        </p>

        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Minimum</p>
            <p className="text-3xl font-bold text-foreground">0 days</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Average</p>
            <p className="text-3xl font-bold text-[var(--info)]">52.4 days</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Median</p>
            <p className="text-3xl font-bold text-foreground">57 days</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Maximum</p>
            <p className="text-3xl font-bold text-foreground">88 days</p>
          </div>
        </div>
      </Card>

      {/* Status Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-destructive/10 border-destructive/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-destructive rounded-full" />
            <span className="text-sm font-semibold text-foreground">At Risk (15)</span>
          </div>
          <p className="text-xs text-muted-foreground">Stuck more than 14 days - immediate attention required</p>
        </Card>

        <Card className="bg-[var(--warning)]/10 border-[var(--warning)]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[var(--warning)] rounded-full" />
            <span className="text-sm font-semibold text-foreground">Needs Follow-up (2)</span>
          </div>
          <p className="text-xs text-muted-foreground">Stuck 7-14 days - proactive outreach recommended</p>
        </Card>

        <Card className="bg-[var(--info)]/10 border-[var(--info)]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[var(--info)] rounded-full" />
            <span className="text-sm font-semibold text-foreground">Monitoring (1)</span>
          </div>
          <p className="text-xs text-muted-foreground">Stuck 3-7 days - keep an eye on progress</p>
        </Card>
      </div>

      {/* Stuck Customers Table */}
      <Card className="bg-card border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
              Stuck Customers
            </h3>
            <p className="text-sm text-muted-foreground">
              Users in completed flow who need attention (excludes those who finished onboarding)
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Days Since Signup</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Completion</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Funnel Stage</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Adam Gibbs', email: 'adamtylergibbs@gmail.com', days: 134, completion: 25, stage: 'Early (<50%)', urgency: 'At Risk' },
                { name: 'Tiffney Cable', email: 'tiffneycable1@gmail.com', days: 126, completion: 38, stage: 'Early (<50%)', urgency: 'At Risk' },
                { name: 'Samore reedkeitt', email: 'merriall17@gmail.com', days: 125, completion: 25, stage: 'Early (<50%)', urgency: 'At Risk' },
                { name: 'Zach Colter', email: 'rgmoore2020@icloud.com', days: 122, completion: 63, stage: 'Mid (50-87%)', urgency: 'At Risk' },
                { name: 'Katrina Barnes', email: 'katrinadbarnes@yahoo.com', days: 119, completion: 25, stage: 'Early (<50%)', urgency: 'At Risk' },
                { name: 'robert mccrum', email: 'bobgmccrum@gmail.com', days: 116, completion: 63, stage: 'Mid (50-87%)', urgency: 'At Risk' },
                { name: 'Larry Felder', email: 'laritqua1399@gmail.com', days: 112, completion: 38, stage: 'Early (<50%)', urgency: 'At Risk' },
                { name: 'JACOB Heatley', email: 'jlh2003rype@yahoo.com', days: 108, completion: 63, stage: 'Mid (50-87%)', urgency: 'At Risk' },
                { name: 'Kerry Lamigo-Folk', email: 'kylam67@yahoo.com', days: 83, completion: 25, stage: 'Early (<50%)', urgency: 'At Risk' },
                { name: 'Juliana Test', email: 'jrosario+banner@entpnt.com', days: 75, completion: 63, stage: 'Mid (50-87%)', urgency: 'At Risk' },
              ].map((customer, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{customer.days} days</td>
                  <td className="px-6 py-4 text-sm text-foreground">{customer.completion}%</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{customer.stage}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded">
                      {customer.urgency}
                    </span>
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
          className="px-6 py-4"
        />
      </Card>
    </div>
  );
}

// Planned Flow Tab Component
function PlannedFlowTab() {
  const [currentPageReady, setCurrentPageReady] = useState(1);
  const [currentPageWaiting, setCurrentPageWaiting] = useState(1);
  const totalPagesReady = 2;
  const totalPagesWaiting = 5;

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Planned</p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-foreground">183</p>
          <p className="text-xs text-muted-foreground mt-1">Started with address not ready</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Address Not Ready</p>
            <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--warning)]">166</p>
          <p className="text-xs text-muted-foreground mt-1">Still waiting for service area</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Address Ready</p>
            <CheckCircle className="w-4 h-4 text-[var(--success)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--success)]">17</p>
          <p className="text-xs text-muted-foreground mt-1">6 started signup</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Fully Converted</p>
            <TrendingUp className="w-4 h-4 text-[var(--info)]" />
          </div>
          <p className="text-3xl font-bold text-[var(--info)]">6</p>
          <p className="text-xs text-muted-foreground mt-1">35.3% conversion rate</p>
        </Card>
      </div>

      {/* Planned Flow Conversion Funnel */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Planned Flow Conversion Funnel</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Track how planned users convert when their address becomes ready
        </p>

        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Address Became Ready</p>
            <p className="text-4xl font-bold text-foreground">17</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Started Full Signup</p>
            <p className="text-4xl font-bold text-[var(--success)]">6</p>
            <p className="text-xs text-muted-foreground mt-1">35.3% of ready</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Fully Converted</p>
            <p className="text-4xl font-bold text-[var(--success)]">6</p>
            <p className="text-xs text-muted-foreground mt-1">100.0% completion</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Lost</p>
            <p className="text-4xl font-bold text-destructive">11</p>
            <p className="text-xs text-muted-foreground mt-1">64.7% drop-off</p>
          </div>
        </div>
      </Card>

      {/* Address Ready - Needs Contact */}
      <Card className="bg-card border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--success)]" />
              Address Ready - Needs Contact (17)
            </h3>
            <p className="text-sm text-muted-foreground">
              Customers whose address is now ready for service - reach out to complete signup
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Address</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Ready Since</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Smith', email: 'john.smith@email.com', address: '123 Main St', readySince: '5 days ago', status: 'New' },
                { name: 'Sarah Johnson', email: 'sarah.j@email.com', address: '456 Oak Ave', readySince: '3 days ago', status: 'Contacted' },
              ].map((customer, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{customer.address}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{customer.readySince}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      customer.status === 'New' ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-secondary text-foreground'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPageReady}
          totalPages={totalPagesReady}
          onPageChange={setCurrentPageReady}
          className="px-6 py-4"
        />
      </Card>

      {/* Address Not Ready - Waiting */}
      <Card className="bg-card border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--warning)]" />
              Address Not Ready - Waiting (166)
            </h3>
            <p className="text-sm text-muted-foreground">
              Customers waiting for fiber to become available at their location
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Address</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Days Waiting</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Estimated Ready</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">Customer {index + 1}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">customer{index + 1}@email.com</td>
                  <td className="px-6 py-4 text-sm text-foreground">Address {index + 1}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{30 + index * 5} days</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">TBD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPageWaiting}
          totalPages={totalPagesWaiting}
          onPageChange={setCurrentPageWaiting}
          className="px-6 py-4"
        />
      </Card>
    </div>
  );
}
