import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Server,
  Wifi,
  HardDrive,
  Zap,
  Thermometer,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

// Mock data for charts
const bandwidthData = [
  { time: '00:00', ingress: 45, egress: 38 },
  { time: '04:00', ingress: 32, egress: 28 },
  { time: '08:00', ingress: 68, egress: 55 },
  { time: '12:00', ingress: 82, egress: 71 },
  { time: '16:00', ingress: 91, egress: 78 },
  { time: '20:00', ingress: 75, egress: 65 },
  { time: '23:59', ingress: 52, egress: 44 },
];

const latencyData = [
  { time: '00:00', latency: 12, jitter: 2 },
  { time: '04:00', latency: 11, jitter: 1.5 },
  { time: '08:00', latency: 15, jitter: 3 },
  { time: '12:00', latency: 18, jitter: 4 },
  { time: '16:00', latency: 16, jitter: 3.5 },
  { time: '20:00', latency: 14, jitter: 2.5 },
  { time: '23:59', latency: 13, jitter: 2 },
];

const deviceStatusData = [
  { name: 'Online', value: 247, color: 'var(--success)' },
  { name: 'Offline', value: 8, color: '#DC2626' },
  { name: 'Degraded', value: 15, color: '#DC6300' },
];

const capacityData = [
  { category: 'Port Usage', used: 68, total: 100 },
  { category: 'OLT Capacity', used: 73, total: 100 },
  { category: 'IP Pool', used: 45, total: 100 },
  { category: 'Fiber Strands', used: 82, total: 100 },
];

// Mock alerts data
const recentAlerts = [
  { id: 1, severity: 'critical', device: 'OLT-JMT-01', message: 'High temperature detected', time: '2 min ago', ack: false },
  { id: 2, severity: 'warning', device: 'RTR-CORE-03', message: 'Interface errors increasing', time: '8 min ago', ack: false },
  { id: 3, severity: 'critical', device: 'SWI-AGG-12', message: 'Link saturation detected', time: '12 min ago', ack: true },
  { id: 4, severity: 'info', device: 'OLT-JMT-04', message: 'Firmware update available', time: '25 min ago', ack: true },
  { id: 5, severity: 'warning', device: 'RTR-EDGE-07', message: 'CPU utilization above 80%', time: '32 min ago', ack: false },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]';
    case 'warning':
      return 'bg-[#DC6300]/10 text-[#DC6300] border-[#DC6300]';
    case 'info':
      return 'bg-[#147FFF]/10 text-[#147FFF] border-[#147FFF]';
    default:
      return 'bg-[#94A3B8]/10 text-[#94A3B8] border-[#94A3B8]';
  }
};

export function DashboardContent() {
  return (
    <div className="p-6 bg-[#020817] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Network Operations Center</h1>
          <p className="text-[#94A3B8]">Real-time monitoring and control center for fiber network operations</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1E293B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#147FFF]">
            <Clock className="w-4 h-4 text-[#94A3B8]" />
            <span className="text-sm text-[#F8FAFC]">Last 24h</span>
            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#0F172A] border-[#1E293B]">
            <DropdownMenuItem className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Last Hour</DropdownMenuItem>
            <DropdownMenuItem className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Last 6 Hours</DropdownMenuItem>
            <DropdownMenuItem className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Last 24h</DropdownMenuItem>
            <DropdownMenuItem className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Last 7 Days</DropdownMenuItem>
            <DropdownMenuItem className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Last 30 Days</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Primary KPI Widgets - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {/* Overall Network Status */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 hover:border-[#147FFF] transition-colors cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[var(--success)]/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
            </div>
            <span className="text-xs text-[var(--success)] flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              2.3%
            </span>
          </div>
          <div className="text-2xl font-semibold text-[#F8FAFC] mb-1">Healthy</div>
          <div className="text-xs text-[#94A3B8]">Network Status</div>
        </div>

        {/* Active Incidents */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 hover:border-[#147FFF] transition-colors cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[#DC2626]/10 rounded-lg">
              <XCircle className="w-5 h-5 text-[#DC2626]" />
            </div>
            <span className="text-xs text-[#DC2626] flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              1
            </span>
          </div>
          <div className="text-2xl font-semibold text-[#F8FAFC] mb-1">3</div>
          <div className="text-xs text-[#94A3B8]">Active Incidents</div>
        </div>

        {/* Active Alerts */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 hover:border-[#147FFF] transition-colors cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[#DC6300]/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-[#DC6300]" />
            </div>
            <span className="text-xs text-[#94A3B8]">Critical: 2</span>
          </div>
          <div className="text-2xl font-semibold text-[#F8FAFC] mb-1">12</div>
          <div className="text-xs text-[#94A3B8]">Active Alerts</div>
        </div>

        {/* Network Uptime */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 hover:border-[#147FFF] transition-colors cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[#147FFF]/10 rounded-lg">
              <Clock className="w-5 h-5 text-[#147FFF]" />
            </div>
            <span className="text-xs text-[var(--success)]">7d: 99.98%</span>
          </div>
          <div className="text-2xl font-semibold text-[#F8FAFC] mb-1">99.97%</div>
          <div className="text-xs text-[#94A3B8]">Uptime (24h)</div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 hover:border-[#147FFF] transition-colors cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[var(--success)]/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
            </div>
            <span className="text-xs text-[var(--success)] flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              0.1%
            </span>
          </div>
          <div className="text-2xl font-semibold text-[#F8FAFC] mb-1">99.4%</div>
          <div className="text-xs text-[#94A3B8]">SLA Compliance</div>
        </div>

        {/* Subscribers Affected */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 hover:border-[#147FFF] transition-colors cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[#DC2626]/10 rounded-lg">
              <Users className="w-5 h-5 text-[#DC2626]" />
            </div>
            <span className="text-xs text-[#DC2626]">8 enterprise</span>
          </div>
          <div className="text-2xl font-semibold text-[#F8FAFC] mb-1">127</div>
          <div className="text-xs text-[#94A3B8]">Subscribers Affected</div>
        </div>
      </div>

      {/* Real-Time Performance & Infrastructure Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bandwidth Utilization */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Bandwidth Utilization</h3>
              <p className="text-xs text-[#94A3B8]">Ingress/Egress over 24 hours</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#F8FAFC]">91 Gbps</div>
              <div className="text-xs text-[#94A3B8]">Peak: 94.2 Gbps</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={bandwidthData}>
              <defs>
                <linearGradient id="colorIngress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#147FFF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#147FFF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="time" stroke="#94A3B8" style={{ fontSize: '11px' }} />
              <YAxis stroke="#94A3B8" style={{ fontSize: '11px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                labelStyle={{ color: '#F8FAFC' }}
              />
              <Area key="area-ingress" type="monotone" dataKey="ingress" stroke="#147FFF" fillOpacity={1} fill="url(#colorIngress)" />
              <Area key="area-egress" type="monotone" dataKey="egress" stroke="var(--success)" fillOpacity={1} fill="url(#colorEgress)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#147FFF] rounded-full"></div>
              <span className="text-xs text-[#94A3B8]">Ingress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--success)] rounded-full"></div>
              <span className="text-xs text-[#94A3B8]">Egress</span>
            </div>
          </div>
        </div>

        {/* Device Status Distribution */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Infrastructure Health</h3>
              <p className="text-xs text-[#94A3B8]">Device status distribution</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#F8FAFC]">270</div>
              <div className="text-xs text-[#94A3B8]">Total Devices</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="40%" height={180}>
              <PieChart>
                <Pie
                  data={deviceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {deviceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-4">
              {deviceStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-[#F8FAFC]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#F8FAFC]">{item.value}</span>
                    <span className="text-xs text-[#94A3B8]">
                      {((item.value / 270) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latency & Infrastructure Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Latency and Jitter */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Network Performance</h3>
              <p className="text-xs text-[#94A3B8]">Latency and jitter metrics</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#94A3B8] mb-1">Packet Loss: 0.02%</div>
              <div className="text-xs text-[var(--success)]">Within threshold</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="time" stroke="#94A3B8" style={{ fontSize: '11px' }} />
              <YAxis stroke="#94A3B8" style={{ fontSize: '11px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}
                labelStyle={{ color: '#F8FAFC' }}
              />
              <Line key="line-latency" type="monotone" dataKey="latency" stroke="#147FFF" strokeWidth={2} dot={{ fill: '#147FFF', r: 3 }} />
              <Line key="line-jitter" type="monotone" dataKey="jitter" stroke="#DC6300" strokeWidth={2} dot={{ fill: '#DC6300', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#147FFF] rounded-full"></div>
              <span className="text-xs text-[#94A3B8]">Latency (ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#DC6300] rounded-full"></div>
              <span className="text-xs text-[#94A3B8]">Jitter (ms)</span>
            </div>
          </div>
        </div>

        {/* Layer Status */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Network Layer Status</h3>
              <p className="text-xs text-[#94A3B8]">Core, aggregation, and access layers</p>
            </div>
          </div>
          <div className="space-y-4">
            {/* Core Layer */}
            <div className="p-4 bg-[#020817] border border-[#1E293B] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-[#147FFF]" />
                  <span className="text-sm font-medium text-[#F8FAFC]">Core Layer</span>
                </div>
                <span className="px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded">Online</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-[#94A3B8]">
                <span>12 Routers</span>
                <span>•</span>
                <span>11 Online</span>
                <span>•</span>
                <span>1 Maintenance</span>
              </div>
            </div>

            {/* Aggregation Layer */}
            <div className="p-4 bg-[#020817] border border-[#1E293B] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-[#147FFF]" />
                  <span className="text-sm font-medium text-[#F8FAFC]">Aggregation Layer</span>
                </div>
                <span className="px-2 py-1 bg-[#DC6300]/10 text-[#DC6300] text-xs rounded">Degraded</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-[#94A3B8]">
                <span>48 Switches</span>
                <span>•</span>
                <span>45 Online</span>
                <span>•</span>
                <span>3 Issues</span>
              </div>
            </div>

            {/* Access Layer */}
            <div className="p-4 bg-[#020817] border border-[#1E293B] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-[#147FFF]" />
                  <span className="text-sm font-medium text-[#F8FAFC]">Access Layer (OLTs)</span>
                </div>
                <span className="px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded">Online</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-[#94A3B8]">
                <span>210 OLTs</span>
                <span>•</span>
                <span>205 Online</span>
                <span>•</span>
                <span>5 Offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts & Capacity Planning Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Active Alerts Feed */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Active Alerts</h3>
              <p className="text-xs text-[#94A3B8]">Real-time alert feed</p>
            </div>
            <button className="text-xs text-[#147FFF] hover:text-[#1068CC] flex items-center gap-1">
              View All
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div 
                key={alert.id}
                className="p-3 bg-[#020817] border border-[#1E293B] rounded-lg hover:border-[#147FFF] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    {!alert.ack && (
                      <span className="px-2 py-1 bg-[#94A3B8]/10 text-[#94A3B8] text-xs rounded">
                        Unacknowledged
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#94A3B8]">{alert.time}</span>
                </div>
                <div className="text-sm font-medium text-[#F8FAFC] mb-1">{alert.message}</div>
                <div className="text-xs text-[#94A3B8]">{alert.device}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity Planning */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">Capacity & Planning</h3>
              <p className="text-xs text-[#94A3B8]">Resource utilization overview</p>
            </div>
          </div>
          <div className="space-y-4">
            {capacityData.map((item, index) => {
              const percentage = (item.used / item.total) * 100;
              const isWarning = percentage > 75;
              const isCritical = percentage > 85;
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#F8FAFC]">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#F8FAFC]">{percentage.toFixed(1)}%</span>
                      {isCritical ? (
                        <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-[#DC6300]" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-[#1E293B] rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        isCritical ? 'bg-[#DC2626]' : isWarning ? 'bg-[#DC6300]' : 'bg-[var(--success)]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#94A3B8]">{item.used} / {item.total} units</span>
                    {isCritical && (
                      <span className="text-xs text-[#DC2626]">Immediate action required</span>
                    )}
                    {isWarning && !isCritical && (
                      <span className="text-xs text-[#DC6300]">Plan expansion</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Service Impact Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 hover:border-[#147FFF] transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#DC6300]/10 rounded-lg">
              <Activity className="w-5 h-5 text-[#DC6300]" />
            </div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Services Degraded</h3>
          </div>
          <div className="text-2xl font-semibold text-[#F8FAFC] mb-2">7</div>
          <div className="space-y-1 text-xs text-[#94A3B8]">
            <div>• 4 Internet services</div>
            <div>• 2 IPTV services</div>
            <div>• 1 VoIP service</div>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 hover:border-[#147FFF] transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#147FFF]/10 rounded-lg">
              <Users className="w-5 h-5 text-[#147FFF]" />
            </div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Impacted Customers</h3>
          </div>
          <div className="text-2xl font-semibold text-[#F8FAFC] mb-2">127</div>
          <div className="space-y-1 text-xs text-[#94A3B8]">
            <div>• 8 Enterprise customers</div>
            <div>• 34 Business customers</div>
            <div>• 85 Residential customers</div>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 hover:border-[#147FFF] transition-colors cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[var(--success)]/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[var(--success)]" />
            </div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Provider Status</h3>
          </div>
          <div className="text-2xl font-semibold text-[#F8FAFC] mb-2">98.5%</div>
          <div className="space-y-1 text-xs text-[#94A3B8]">
            <div>• 12 providers active</div>
            <div>• 2 with minor issues</div>
            <div>• Avg response: 15 min</div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}