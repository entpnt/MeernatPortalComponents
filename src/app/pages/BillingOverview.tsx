import { TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const paymentScheduleData = [
  { date: 'Jan 27', amount: 0 },
  { date: 'Jan 29', amount: 150 },
  { date: 'Jan 31', amount: 200 },
  { date: 'Feb 2', amount: 100 },
  { date: 'Feb 4', amount: 500 },
  { date: 'Feb 6', amount: 50 },
  { date: 'Feb 8', amount: 0 },
  { date: 'Feb 10', amount: 0 },
  { date: 'Feb 12', amount: 2400 },
  { date: 'Feb 14', amount: 0 },
  { date: 'Feb 16', amount: 0 },
  { date: 'Feb 18', amount: 0 },
  { date: 'Feb 20', amount: 150 },
  { date: 'Feb 22', amount: 0 },
  { date: 'Feb 24', amount: 300 },
  { date: 'Feb 26', amount: 1650 },
];

export function BillingOverview() {
  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Billing Operations Dashboard
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Monitor billing operations and service health • Orangeburg Fiber
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-3 gap-6">
        {/* Scheduled */}
        <Card className="bg-[var(--card)] border-[var(--border)] p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm text-[var(--muted-foreground)]">Scheduled (Next 7 Days)</h3>
            <TrendingUp className="w-5 h-5 text-[var(--muted-foreground)]" />
          </div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">$345.90</div>
          <p className="text-sm text-[var(--muted-foreground)]">5 subscriptions upcoming</p>
        </Card>

        {/* Billed Today */}
        <Card className="bg-[var(--card)] border-[var(--border)] p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm text-[var(--muted-foreground)]">Billed Today</h3>
            <TrendingUp className="w-5 h-5 text-[var(--muted-foreground)]" />
          </div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">$0.00</div>
          <p className="text-sm text-[var(--muted-foreground)]">0 invoices created</p>
        </Card>

        {/* Failed Today */}
        <Card className="bg-[var(--card)] border-[var(--border)] p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm text-[var(--muted-foreground)]">Failed Today</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-500 mb-1">$135.94</div>
          <p className="text-sm text-[var(--muted-foreground)]">2 failures require attention</p>
        </Card>
      </div>

      {/* Service Health */}
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Service Health</h2>
        <div className="grid grid-cols-3 gap-6">
          {/* Email Notifications */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Email Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Last Run:</span>
                <span className="text-sm text-[var(--foreground)]">Never</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Emailed Today:</span>
                <span className="text-sm text-[var(--foreground)]">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--muted-foreground)]">Success Rate:</span>
                <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                  0%
                </Badge>
              </div>
            </div>
          </Card>

          {/* Billing Queue */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Billing Queue
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Last Run:</span>
                <span className="text-sm text-[var(--foreground)]">Never</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Billed Today:</span>
                <span className="text-sm text-[var(--foreground)]">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--muted-foreground)]">Success Rate:</span>
                <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                  0%
                </Badge>
              </div>
            </div>
          </Card>

          {/* Invoicing */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-6">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Invoicing
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Last Run:</span>
                <span className="text-sm text-[var(--foreground)]">Never</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--muted-foreground)]">Invoiced Today:</span>
                <span className="text-sm text-[var(--foreground)]">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--muted-foreground)]">Success Rate:</span>
                <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                  0%
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 30-Day Payment Schedule Chart */}
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">
          30-Day Payment Schedule
        </h2>
        <Card className="bg-[var(--card)] border-[var(--border)] p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentScheduleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--foreground)',
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#147FFF"
                strokeWidth={2}
                dot={{ fill: '#147FFF', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

export default BillingOverview;