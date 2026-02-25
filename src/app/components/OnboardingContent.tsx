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
        <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Onboarding Pipeline</h1>
        <p className="text-[#94A3B8]">Track customer progress through the signup process • Orangeburg Fiber</p>
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
          onClick={() => setActiveTab('completed-flow')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'completed-flow'
              ? 'text-[#F8FAFC] bg-[#1E293B] rounded-t-lg'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Completed Flow
          <span className="ml-2 px-2 py-0.5 text-xs bg-[#DC2626] text-white rounded-full">18</span>
        </button>
        <button
          onClick={() => setActiveTab('planned-flow')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeTab === 'planned-flow'
              ? 'text-[#F8FAFC] bg-[#1E293B] rounded-t-lg'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Planned Flow
          <span className="ml-2 px-2 py-0.5 text-xs bg-[#DC6300] text-white rounded-full">16</span>
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
        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">Total in Funnel</p>
            <Users className="w-4 h-4 text-[#94A3B8]" />
          </div>
          <p className="text-3xl font-bold text-[#F8FAFC]">345</p>
          <p className="text-xs text-[#94A3B8] mt-1">Active signups</p>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">Completed</p>
            <CheckCircle className="w-4 h-4 text-[#21DB00]" />
          </div>
          <p className="text-3xl font-bold text-[#21DB00]">315</p>
          <p className="text-xs text-[#94A3B8] mt-1">Finished onboarding</p>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">In Progress</p>
            <Clock className="w-4 h-4 text-[#DC6300]" />
          </div>
          <p className="text-3xl font-bold text-[#DC6300]">30</p>
          <p className="text-xs text-[#94A3B8] mt-1">166 waiting for address</p>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">Completion Rate</p>
            <TrendingUp className="w-4 h-4 text-[#147FFF]" />
          </div>
          <p className="text-3xl font-bold text-[#147FFF]">91.3%</p>
          <p className="text-xs text-[#94A3B8] mt-1">Overall success rate</p>
        </Card>
      </div>

      {/* Flow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Completed Flow</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Total</span>
              <span className="text-xl font-bold text-[#F8FAFC]">154</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Completed</span>
              <span className="text-xl font-bold text-[#21DB00]">137</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Rate</span>
              <span className="text-xl font-bold text-[#147FFF]">89.0%</span>
            </div>
            <p className="text-xs text-[#64748B] pt-2 border-t border-[#1E293B]">
              Avg 64.9 days since signup (88% avg completion)
            </p>
          </div>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Planned Flow</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Total</span>
              <span className="text-xl font-bold text-[#F8FAFC]">166</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Completed</span>
              <span className="text-xl font-bold text-[#21DB00]">155</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Rate</span>
              <span className="text-xl font-bold text-[#147FFF]">93.4%</span>
            </div>
            <p className="text-xs text-[#64748B] pt-2 border-t border-[#1E293B]">
              Avg 59.0 days since signup (85% avg completion)
            </p>
          </div>
        </Card>
      </div>

      {/* Additional Flow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Planned Flow (Planned To Completed)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Total</span>
              <span className="text-xl font-bold text-[#F8FAFC]">17</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Completed</span>
              <span className="text-xl font-bold text-[#21DB00]">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Rate</span>
              <span className="text-xl font-bold text-[#147FFF]">88.2%</span>
            </div>
            <p className="text-xs text-[#64748B] pt-2 border-t border-[#1E293B]">
              Avg 67.5 days since signup (82% avg completion)
            </p>
          </div>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Unknown Flow (Unknown)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Total</span>
              <span className="text-xl font-bold text-[#F8FAFC]">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Completed</span>
              <span className="text-xl font-bold text-[#21DB00]">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#94A3B8]">Rate</span>
              <span className="text-xl font-bold text-[#147FFF]">100.0%</span>
            </div>
            <p className="text-xs text-[#64748B] pt-2 border-t border-[#1E293B]">
              Avg 109.9 days since signup (97% avg completion)
            </p>
          </div>
        </Card>
      </div>

      {/* Onboarding Funnel */}
      <Card className="bg-[#0F172A] border-[#1E293B] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#F8FAFC]">Onboarding Funnel</h3>
            <p className="text-sm text-[#94A3B8]">Customer progression through the signup process</p>
          </div>
          <Button variant="outline" size="sm" className="border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]">
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
                <span className="text-[#94A3B8]">{stage.label}</span>
                <span className="text-[#F8FAFC]">{stage.completed + stage.planned}</span>
              </div>
              <div className="relative h-8 bg-[#1E293B] rounded overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-[#147FFF]"
                  style={{ width: `${(stage.completed / stage.total) * 100}%` }}
                />
                {stage.planned > 0 && (
                  <div
                    className="absolute top-0 h-full bg-[#8B5CF6]"
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

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#1E293B]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#147FFF] rounded" />
            <span className="text-sm text-[#94A3B8]">Completed Flow (Address Ready)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#8B5CF6] rounded" />
            <span className="text-sm text-[#94A3B8]">Planned Flow (Address Not Ready)</span>
          </div>
        </div>
      </Card>

      {/* Drop-off Analysis */}
      <Card className="bg-[#0F172A] border-[#1E293B] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-1">Drop-off Analysis</h3>
          <p className="text-sm text-[#94A3B8]">Identify where customers are leaving the funnel</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 bg-[#1E293B] text-[#F8FAFC] rounded text-sm font-medium">
            All (345)
          </button>
          <button className="px-4 py-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded text-sm font-medium">
            Completed (257)
          </button>
          <button className="px-4 py-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded text-sm font-medium">
            Planned (88)
          </button>
        </div>

        <div className="bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
              <span className="text-sm font-semibold text-[#F8FAFC]">Highest Drop-off</span>
            </div>
            <span className="px-2 py-1 bg-[#8B5CF6] text-white text-xs rounded">Planned</span>
          </div>
          <p className="text-lg font-bold text-[#F8FAFC] mb-1">We'll Be in Touch!</p>
          <p className="text-sm text-[#DC2626]">100.0% drop-off rate (88 users)</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[#F8FAFC]">Top Problem Steps</h4>
          {[
            { step: 'We\'ll Be in Touch!', count: 88, rate: '100.0%', flow: 'Planned' },
            { step: 'Final Confirmation', count: 88, rate: '100.0%', flow: 'Completed' },
            { step: 'Property Access Agreement', count: 80, rate: '33.3%', flow: 'Completed' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-[#1E293B] last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#64748B] w-6">{index + 1}.</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  item.flow === 'Planned' ? 'bg-[#8B5CF6] text-white' : 'bg-[#147FFF] text-white'
                }`}>
                  {item.flow}
                </span>
                <span className="text-sm text-[#F8FAFC]">{item.step}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#DC2626]">{item.count}</div>
                <div className="text-xs text-[#94A3B8]">→ {item.rate}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-[#1E293B] space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#94A3B8]">Total Dropped Off</span>
            <span className="text-[#F8FAFC] font-semibold">345</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#94A3B8]">● Completed Flow</span>
            <span className="text-[#F8FAFC] font-semibold">257</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#94A3B8]">● Planned Flow</span>
            <span className="text-[#F8FAFC] font-semibold">88</span>
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
        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">Total in Flow</p>
            <Users className="w-4 h-4 text-[#94A3B8]" />
          </div>
          <p className="text-3xl font-bold text-[#F8FAFC]">154</p>
          <p className="text-xs text-[#94A3B8] mt-1">137 completed, 17 stuck</p>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">Avg Days to Service</p>
            <Clock className="w-4 h-4 text-[#147FFF]" />
          </div>
          <p className="text-3xl font-bold text-[#147FFF]">52.4</p>
          <p className="text-xs text-[#94A3B8] mt-1">54 users with service</p>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">At Risk</p>
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#DC2626]/10 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
          </div>
          <p className="text-3xl font-bold text-[#DC2626]">17</p>
          <p className="text-xs text-[#94A3B8] mt-1">Stuck &gt;14 days</p>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">Needs Follow-up</p>
            <TrendingUp className="w-4 h-4 text-[#DC6300]" />
          </div>
          <p className="text-3xl font-bold text-[#94A3B8]">0</p>
          <p className="text-xs text-[#94A3B8] mt-1">Stuck 7-14 days</p>
        </Card>
      </div>

      {/* Time to Service Metrics */}
      <Card className="bg-[#0F172A] border-[#1E293B] p-6">
        <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">Time to Service Metrics</h3>
        <p className="text-sm text-[#94A3B8] mb-6">
          Days from account creation to first service activation (uses original subscription date for switchers)
        </p>

        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-[#94A3B8] mb-2">Minimum</p>
            <p className="text-3xl font-bold text-[#F8FAFC]">0 days</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-[#94A3B8] mb-2">Average</p>
            <p className="text-3xl font-bold text-[#147FFF]">52.4 days</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-[#94A3B8] mb-2">Median</p>
            <p className="text-3xl font-bold text-[#F8FAFC]">57 days</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-[#94A3B8] mb-2">Maximum</p>
            <p className="text-3xl font-bold text-[#F8FAFC]">88 days</p>
          </div>
        </div>
      </Card>

      {/* Status Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#DC2626]/10 border-[#DC2626]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#DC2626] rounded-full" />
            <span className="text-sm font-semibold text-[#F8FAFC]">At Risk (15)</span>
          </div>
          <p className="text-xs text-[#94A3B8]">Stuck more than 14 days - immediate attention required</p>
        </Card>

        <Card className="bg-[#DC6300]/10 border-[#DC6300]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#DC6300] rounded-full" />
            <span className="text-sm font-semibold text-[#F8FAFC]">Needs Follow-up (2)</span>
          </div>
          <p className="text-xs text-[#94A3B8]">Stuck 7-14 days - proactive outreach recommended</p>
        </Card>

        <Card className="bg-[#147FFF]/10 border-[#147FFF]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#147FFF] rounded-full" />
            <span className="text-sm font-semibold text-[#F8FAFC]">Monitoring (1)</span>
          </div>
          <p className="text-xs text-[#94A3B8]">Stuck 3-7 days - keep an eye on progress</p>
        </Card>
      </div>

      {/* Stuck Customers Table */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#F8FAFC] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#DC6300]" />
              Stuck Customers
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Users in completed flow who need attention (excludes those who finished onboarding)
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Days Since Signup</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Completion</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Funnel Stage</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Urgency</th>
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
                <tr key={index} className="border-b border-[#1E293B] hover:bg-[#1E293B]/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-[#F8FAFC]">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-[#94A3B8]">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-[#F8FAFC]">{customer.days} days</td>
                  <td className="px-6 py-4 text-sm text-[#F8FAFC]">{customer.completion}%</td>
                  <td className="px-6 py-4 text-sm text-[#94A3B8]">{customer.stage}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#DC2626] text-white text-xs rounded">
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
        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">Total Planned</p>
            <Users className="w-4 h-4 text-[#94A3B8]" />
          </div>
          <p className="text-3xl font-bold text-[#F8FAFC]">183</p>
          <p className="text-xs text-[#94A3B8] mt-1">Started with address not ready</p>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">Address Not Ready</p>
            <AlertTriangle className="w-4 h-4 text-[#DC6300]" />
          </div>
          <p className="text-3xl font-bold text-[#DC6300]">166</p>
          <p className="text-xs text-[#94A3B8] mt-1">Still waiting for service area</p>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">Address Ready</p>
            <CheckCircle className="w-4 h-4 text-[#21DB00]" />
          </div>
          <p className="text-3xl font-bold text-[#21DB00]">17</p>
          <p className="text-xs text-[#94A3B8] mt-1">6 started signup</p>
        </Card>

        <Card className="bg-[#0F172A] border-[#1E293B] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#94A3B8]">Fully Converted</p>
            <TrendingUp className="w-4 h-4 text-[#147FFF]" />
          </div>
          <p className="text-3xl font-bold text-[#147FFF]">6</p>
          <p className="text-xs text-[#94A3B8] mt-1">35.3% conversion rate</p>
        </Card>
      </div>

      {/* Planned Flow Conversion Funnel */}
      <Card className="bg-[#0F172A] border-[#1E293B] p-6">
        <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">Planned Flow Conversion Funnel</h3>
        <p className="text-sm text-[#94A3B8] mb-6">
          Track how planned users convert when their address becomes ready
        </p>

        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-[#94A3B8] mb-2">Address Became Ready</p>
            <p className="text-4xl font-bold text-[#F8FAFC]">17</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-[#94A3B8] mb-2">Started Full Signup</p>
            <p className="text-4xl font-bold text-[#21DB00]">6</p>
            <p className="text-xs text-[#94A3B8] mt-1">35.3% of ready</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-[#94A3B8] mb-2">Fully Converted</p>
            <p className="text-4xl font-bold text-[#21DB00]">6</p>
            <p className="text-xs text-[#94A3B8] mt-1">100.0% completion</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-[#94A3B8] mb-2">Avg Days to Service</p>
            <p className="text-4xl font-bold text-[#147FFF]">91.0</p>
            <p className="text-xs text-[#94A3B8] mt-1">From planned signup</p>
          </div>
        </div>
      </Card>

      {/* Ready to Convert Section */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <div className="px-6 py-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-[#21DB00]" />
            <h3 className="text-lg font-semibold text-[#F8FAFC]">Ready to Convert</h3>
            <span className="px-2 py-1 bg-[#21DB00] text-[#020817] text-xs rounded font-medium ml-2">
              16 users
            </span>
          </div>
          <p className="text-sm text-[#94A3B8]">
            Users whose address is now ready but haven't completed signup - high conversion potential
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Days Since Signup</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Started Signup</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Completion</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Jerry Cobb', email: 'jerrycobb1865@gmail.com', days: 126, started: 'No', completion: 25 },
                { name: 'Jerry Cobb', email: 'jerrycobb1865@gmail.com', days: 126, started: 'No', completion: 75 },
                { name: 'SAMUEL SIMPSON', email: 'simpson803@gmail.com', days: 126, started: 'No', completion: 75 },
                { name: 'Cherelle Washington', email: 'cherellewashington13@gmail.com', days: 118, started: 'No', completion: 75 },
                { name: 'Satara Darby', email: 'satarad@yahoo.com', days: 102, started: 'No', completion: 75 },
                { name: 'LAKISHA Brown Crawford', email: 'browncrawfordlakisha@yahoo.com', days: 96, started: 'No', completion: 50 },
                { name: 'Junior Kelly', email: 'jkelly@gmail.com', days: 94, started: 'No', completion: 75 },
                { name: 'Kedrick Burke', email: 'dj.mixmaster1210@yahoo.com', days: 93, started: 'No', completion: 75 },
                { name: 'Milhouse Theo', email: 'theom369@gmail.com', days: 87, started: 'No', completion: 100 },
                { name: 'W. Spencer Davis', email: 'wsdavis@ymail.com', days: 83, started: 'No', completion: 100 },
              ].map((customer, index) => (
                <tr key={index} className="border-b border-[#1E293B] hover:bg-[#1E293B]/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-[#F8FAFC]">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-[#94A3B8]">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-[#F8FAFC]">{customer.days} days</td>
                  <td className="px-6 py-4 text-sm text-[#94A3B8]">{customer.started}</td>
                  <td className="px-6 py-4 text-sm text-[#F8FAFC]">{customer.completion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-[#94A3B8]">
            Showing 1-10 of 16 users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPageReady(Math.max(1, currentPageReady - 1))}
              disabled={currentPageReady === 1}
              className="flex items-center gap-1 px-3 py-1 text-sm text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {[1, 2].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPageReady(page)}
                  className={`w-8 h-8 rounded text-sm transition-colors ${
                    currentPageReady === page
                      ? 'bg-white text-[#020817] font-medium'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPageReady(Math.min(totalPagesReady, currentPageReady + 1))}
              disabled={currentPageReady === totalPagesReady}
              className="flex items-center gap-1 px-3 py-1 text-sm text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Waiting for Address Section */}
      <Card className="bg-[#0F172A] border-[#1E293B]">
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-[#DC6300]" />
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Waiting for Address</h3>
              <span className="px-2 py-1 bg-[#DC6300] text-white text-xs rounded font-medium ml-2">
                187 users
              </span>
            </div>
            <p className="text-sm text-[#94A3B8]">
              Users whose address is not yet serviceable - waiting for build-out
            </p>
          </div>
          <Button variant="outline" size="sm" className="border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Days Waiting</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Planned Steps Done</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-[#94A3B8]">Current Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Amanda Snell', email: 'trouble850@yahoo.com', days: 137, steps: 75, status: 'planned' },
                { name: 'Emma Butler', email: 'emmabutler82768@gmail.com', days: 137, steps: 75, status: 'planned' },
                { name: 'Levine Dash', email: 'ldash4604@gmail.com', days: 134, steps: 75, status: 'planned' },
                { name: 'Desiire Guinyard', email: 'guinyarddesire@gmail.com', days: 132, steps: 75, status: 'planned' },
                { name: 'Test Test', email: 'ebanyla@gmail.com', days: 132, steps: 75, status: 'planned' },
                { name: 'Darrell Ammonds', email: 'pammonds@ymail.com', days: 130, steps: 75, status: 'planned' },
                { name: 'Emonl Jones', email: 'emonljones46@gmail.com', days: 130, steps: 75, status: 'planned' },
                { name: 'Daryl Steward', email: 'darylsteward9827@gmail.com', days: 130, steps: 75, status: 'planned' },
                { name: 'Wayne Sandie', email: 'jumpmaster4@yahoo.com', days: 129, steps: 75, status: 'planned' },
                { name: 'Kenneth Shuler', email: 'shulerkenneth914@gmail.com', days: 127, steps: 75, status: 'planned' },
              ].map((customer, index) => (
                <tr key={index} className="border-b border-[#1E293B] hover:bg-[#1E293B]/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-[#F8FAFC]">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-[#94A3B8]">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-[#F8FAFC]">{customer.days} days</td>
                  <td className="px-6 py-4 text-sm text-[#F8FAFC]">{customer.steps}%</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#1E293B] text-[#94A3B8] text-xs rounded">
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-[#94A3B8]">
            Showing 1-10 of 187 users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPageWaiting(Math.max(1, currentPageWaiting - 1))}
              disabled={currentPageWaiting === 1}
              className="flex items-center gap-1 px-3 py-1 text-sm text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPageWaiting(page)}
                  className={`w-8 h-8 rounded text-sm transition-colors ${
                    currentPageWaiting === page
                      ? 'bg-white text-[#020817] font-medium'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPageWaiting(Math.min(totalPagesWaiting, currentPageWaiting + 1))}
              disabled={currentPageWaiting === totalPagesWaiting}
              className="flex items-center gap-1 px-3 py-1 text-sm text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}