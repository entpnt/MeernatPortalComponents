import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { CommunicationTypesTable } from '@/app/components/communications/CommunicationTypesTable';
import { ViewButton } from '@/app/components/ui/view-button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/app/components/ui/table';
import { Checkbox } from '@/app/components/ui/checkbox';

import { useState } from 'react';
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Settings as SettingsIcon,
  RefreshCw,
  Download,
  Search,
  Filter,
  X,
  ChevronDown,
  MoreHorizontal,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Phone,
  MapPin,
  Calendar,
  TestTube
} from 'lucide-react';

// Mock data
const mockFailedJobs = [
  {
    id: 'BN313582',
    customer: 'Catherine Simpson',
    email: 'jtsmp@yahoo.com',
    type: 'billing_notification_3day',
    network: 'Orangeburg Fiber',
    status: 'Failed',
    attempts: '1/3',
    queued: 'Jan 8, 2026, 12:00 AM',
  },
  {
    id: 'BN313583',
    customer: 'Robert Johnson',
    email: 'rjohnson@gmail.com',
    type: 'service_activation',
    network: 'Jamestown BPU',
    status: 'Failed',
    attempts: '2/3',
    queued: 'Jan 8, 2026, 1:15 AM',
  },
];

const networks = ['Jamestown BPU', 'Orangeburg Fiber', 'Charleston Fiber'];

export function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [networkFilter, setNetworkFilter] = useState('all');
  const [commTypeFilter, setCommTypeFilter] = useState('all');
  const [selectedNetwork, setSelectedNetwork] = useState('Orangeburg Fiber');

  // Stats
  const stats = {
    totalJobs: 156,
    pending: 3,
    processing: 2,
    sent: 148,
    failed: 3,
  };

  const successRate = stats.totalJobs > 0 
    ? ((stats.sent / stats.totalJobs) * 100).toFixed(1) 
    : '0';

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Communications</h1>
        <p className="text-[var(--muted-foreground)]">
          Monitor email queue performance and manage network communication settings • Orangeburg Fiber
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-[var(--card)] border border-[var(--border)]">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--secondary)]">
            <Mail className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="email-queue" className="data-[state=active]:bg-[var(--secondary)]">
            <Clock className="w-4 h-4 mr-2" />
            Email Queue
          </TabsTrigger>
          <TabsTrigger value="failed-jobs" className="data-[state=active]:bg-[var(--secondary)]">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Failed Jobs
          </TabsTrigger>
          <TabsTrigger value="network-config" className="data-[state=active]:bg-[var(--secondary)]">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Network Config
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Info Banner */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-4">
            <div className="flex gap-3 text-sm text-[var(--muted-foreground)]">
              <div className="w-5 h-5 rounded-full border-2 border-[#147FFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-[#147FFF] rounded-full" />
              </div>
              <p>
                This dashboard provides real-time monitoring of the email queue system. Email jobs are automatically processed and delivered to customers based on communication type settings.
              </p>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[var(--card)] border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[var(--muted-foreground)]" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-[var(--muted-foreground)]">Total Jobs</p>
                <p className="text-3xl font-semibold text-[var(--foreground)]">{stats.totalJobs}</p>
                <p className="text-xs text-[var(--muted-foreground)]">All time email jobs</p>
              </div>
            </Card>

            <Card className="bg-[var(--card)] border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#F59E0B]" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-[var(--muted-foreground)]">Pending</p>
                <p className="text-3xl font-semibold text-[#F59E0B]">{stats.pending}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Queued for processing</p>
              </div>
            </Card>

            <Card className="bg-[var(--card)] border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-[var(--muted-foreground)]">Sent</p>
                <p className="text-3xl font-semibold text-[#10B981]">{stats.sent}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Successfully delivered</p>
              </div>
            </Card>

            <Card className="bg-[var(--card)] border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-[var(--muted-foreground)]">Failed</p>
                <p className="text-3xl font-semibold text-[#EF4444]">{stats.failed}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Require attention</p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[var(--card)] border-[var(--border)] p-6 hover:border-[#147FFF] transition-colors cursor-pointer">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-[#1E3A8A] rounded-lg flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">Email Queue</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4 flex-1">
                    Monitor and manage all email jobs in real-time
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center text-[#147FFF] hover:bg-[var(--secondary)]"
                    onClick={() => setActiveTab('email-queue')}
                  >
                    View Details
                  </Button>
                </div>
              </Card>

              <Card className="bg-[var(--card)] border-[var(--border)] p-6 hover:border-[#147FFF] transition-colors cursor-pointer">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-[#7F1D1D] rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">Failed Jobs</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4 flex-1">
                    Review and retry failed email deliveries
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center text-[#147FFF] hover:bg-[var(--secondary)]"
                    onClick={() => setActiveTab('failed-jobs')}
                  >
                    View Details
                  </Button>
                </div>
              </Card>

              <Card className="bg-[var(--card)] border-[var(--border)] p-6 hover:border-[#147FFF] transition-colors cursor-pointer">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-[#581C87] rounded-lg flex items-center justify-center mb-4">
                    <SettingsIcon className="w-6 h-6 text-[#A855F7]" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">Network Configuration</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4 flex-1">
                    Configure email settings for each network
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center text-[#147FFF] hover:bg-[var(--secondary)]"
                    onClick={() => setActiveTab('network-config')}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Email Delivery Success Rate */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">Email Delivery Success Rate</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Overall performance of email delivery system</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#10B981]" />
                <span className="text-2xl font-semibold text-[#10B981]">{successRate}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Success Rate</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-8 bg-[var(--secondary)] rounded-lg overflow-hidden relative">
                <div 
                  className="h-full bg-[#10B981] transition-all duration-500"
                  style={{ width: `${successRate}%` }}
                />
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#10B981] rounded-sm" />
                    <span className="text-xs text-[var(--muted-foreground)]">{stats.sent} Sent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#F59E0B] rounded-sm" />
                    <span className="text-xs text-[var(--muted-foreground)]">{stats.pending} Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#EF4444] rounded-sm" />
                    <span className="text-xs text-[var(--muted-foreground)]">{stats.failed} Failed</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Email Queue Tab */}
        <TabsContent value="email-queue" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Email Queue</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">Monitor and manage all email jobs in real-time</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[var(--border)] bg-[var(--card)]">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="border-[var(--border)] bg-[var(--card)]">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Real-time indicator */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-3">
            <div className="flex items-center gap-2 text-sm text-[#10B981]">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              <span>Real-time monitoring active</span>
            </div>
          </Card>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-[var(--card)] border-[var(--border)] p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span className="text-xs text-[var(--muted-foreground)]">Total Jobs</span>
              </div>
              <p className="text-2xl font-semibold text-[var(--foreground)]">{stats.totalJobs}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">All email jobs</p>
            </Card>

            <Card className="bg-[var(--card)] border-[var(--border)] p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs text-[var(--muted-foreground)]">Pending</span>
              </div>
              <p className="text-2xl font-semibold text-[#F59E0B]">{stats.pending}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Queued</p>
            </Card>

            <Card className="bg-[var(--card)] border-[var(--border)] p-4">
              <div className="flex items-center gap-3 mb-2">
                <RefreshCw className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-xs text-[var(--muted-foreground)]">Processing</span>
              </div>
              <p className="text-2xl font-semibold text-[#3B82F6]">{stats.processing}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">In progress</p>
            </Card>

            <Card className="bg-[var(--card)] border-[var(--border)] p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                <span className="text-xs text-[var(--muted-foreground)]">Sent</span>
              </div>
              <p className="text-2xl font-semibold text-[#10B981]">{stats.sent}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Delivered</p>
            </Card>

            <Card className="bg-[var(--card)] border-[var(--border)] p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                <span className="text-xs text-[var(--muted-foreground)]">Failed</span>
              </div>
              <p className="text-2xl font-semibold text-[#EF4444]">{stats.failed}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">0% success</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                  <Input
                    placeholder="Search by email, name, job ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Network</label>
                <Select value={networkFilter} onValueChange={setNetworkFilter}>
                  <SelectTrigger className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]">
                    <SelectValue placeholder="All Networks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Networks</SelectItem>
                    {networks.map(network => (
                      <SelectItem key={network} value={network.toLowerCase()}>{network}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Communication Type</label>
                <Select value={commTypeFilter} onValueChange={setCommTypeFilter}>
                  <SelectTrigger className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="billing">Billing Notifications</SelectItem>
                    <SelectItem value="service">Service Updates</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="bg-[var(--secondary)] text-[var(--foreground)]">
                    1 filter active
                  </Badge>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setNetworkFilter('all');
                  setCommTypeFilter('all');
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="mt-4 text-[var(--muted-foreground)]">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          {/* Empty State */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[var(--secondary)] rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-[var(--muted-foreground)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No email jobs found</h3>
              <p className="text-sm text-[var(--muted-foreground)] max-w-md">
                There are no email jobs matching your current filters. Try adjusting your filters or check back later.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Failed Jobs Tab */}
        <TabsContent value="failed-jobs" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Failed Email Jobs</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">Review and retry failed email deliveries</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[var(--border)] bg-[var(--card)]">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="border-[var(--border)] bg-[var(--card)]">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry All (1)
              </Button>
            </div>
          </div>

          {/* Info Banner */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-4">
            <div className="flex gap-3 text-sm text-[var(--muted-foreground)]">
              <div className="w-5 h-5 rounded-full border-2 border-[#147FFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-[#147FFF] rounded-full" />
              </div>
              <p>
                Failed jobs are automatically retried up to 3 times. Jobs shown here have exceeded the retry limit and require manual review. Check the error messages to identify issues.
              </p>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[var(--card)] border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Total Failed</p>
              <p className="text-3xl font-semibold text-[#EF4444]">{mockFailedJobs.length}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Jobs requiring attention</p>
            </Card>

            <Card className="bg-[var(--card)] border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-[#F59E0B]" />
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Retryable</p>
              <p className="text-3xl font-semibold text-[#F59E0B]">1</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Can be retried manually</p>
            </Card>

            <Card className="bg-[var(--card)] border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[var(--muted-foreground)]" />
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Recent Failures</p>
              <p className="text-3xl font-semibold text-[var(--foreground)]">0</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Last 24 hours</p>
            </Card>
          </div>

          {/* Filter Section */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-6">
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">Filter Failed Jobs</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">Filter by network or communication type</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Networks</SelectItem>
                  {networks.map(network => (
                    <SelectItem key={network} value={network.toLowerCase()}>{network}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="billing">Billing Notifications</SelectItem>
                  <SelectItem value="service">Service Updates</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Table */}
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="text-sm text-[var(--muted-foreground)]">
                Showing {mockFailedJobs.length}-{mockFailedJobs.length} of {mockFailedJobs.length} jobs
              </div>
              <Button variant="outline" size="sm" className="border-[var(--border)] bg-[var(--card)]">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-[var(--border)] hover:bg-[var(--secondary)]">
                  <TableHead className="w-12">
                    <Checkbox className="border-[var(--border)]" />
                  </TableHead>
                  <TableHead className="text-[var(--muted-foreground)]">Job ID</TableHead>
                  <TableHead className="text-[var(--muted-foreground)]">Customer</TableHead>
                  <TableHead className="text-[var(--muted-foreground)]">Email</TableHead>
                  <TableHead className="text-[var(--muted-foreground)]">Type</TableHead>
                  <TableHead className="text-[var(--muted-foreground)]">Network</TableHead>
                  <TableHead className="text-[var(--muted-foreground)]">Status</TableHead>
                  <TableHead className="text-[var(--muted-foreground)]">Attempts</TableHead>
                  <TableHead className="text-[var(--muted-foreground)]">Queued</TableHead>
                  <TableHead className="text-[var(--muted-foreground)]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFailedJobs.map((job) => (
                  <TableRow key={job.id} className="border-[var(--border)] hover:bg-[var(--secondary)]">
                    <TableCell>
                      <Checkbox className="border-[var(--border)]" />
                    </TableCell>
                    <TableCell className="text-[var(--foreground)] font-mono text-sm">{job.id}</TableCell>
                    <TableCell className="text-[var(--foreground)]">{job.customer}</TableCell>
                    <TableCell className="text-[var(--muted-foreground)]">{job.email}</TableCell>
                    <TableCell className="text-[var(--muted-foreground)] text-sm">{job.type}</TableCell>
                    <TableCell className="text-[var(--muted-foreground)]">{job.network}</TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="bg-[#7F1D1D] text-[#FEE2E2]">
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[var(--foreground)]">{job.attempts}</TableCell>
                    <TableCell className="text-[var(--muted-foreground)] text-sm">{job.queued}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RotateCcw className="w-4 h-4 text-[var(--muted-foreground)]" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4 text-[var(--muted-foreground)]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 border-t border-[var(--border)] flex items-center justify-between">
              <div className="text-sm text-[var(--muted-foreground)]">
                Rows per page: 
                <Select defaultValue="25">
                  <SelectTrigger className="ml-2 w-16 h-8 bg-[var(--popover)] border-[var(--border)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <span>Page 1 of 1</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Network Config Tab */}
        <TabsContent value="network-config" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Network Email Configuration</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Configure email settings and communication types for each network
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-[var(--border)] bg-[var(--card)]">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Info Banner */}
          <Card className="bg-[var(--card)] border-[var(--border)] p-4">
            <div className="flex gap-3 text-sm text-[var(--muted-foreground)]">
              <div className="w-5 h-5 rounded-full border-2 border-[#147FFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 bg-[#147FFF] rounded-full" />
              </div>
              <p>
                Email configurations control how automated emails are sent for each network. Ensure Postmark settings are correct and test configurations before enabling communication types.
              </p>
            </div>
          </Card>

          {/* Tabs for Config */}
          <Tabs defaultValue="email-settings" className="space-y-6">
            <TabsList className="bg-[var(--card)] border border-[var(--border)]">
              <TabsTrigger value="email-settings" className="data-[state=active]:bg-[var(--secondary)]">
                <Mail className="w-4 h-4 mr-2" />
                Email Settings
              </TabsTrigger>
              <TabsTrigger value="comm-types" className="data-[state=active]:bg-[var(--secondary)]">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Communication Types
              </TabsTrigger>
              <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--secondary)]">
                Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email-settings" className="space-y-6">
              <Card className="bg-[var(--card)] border-[var(--border)] p-6">
                <div className="flex items-start gap-3 mb-6">
                  <Mail className="w-5 h-5 text-[#147FFF] mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">Email Configuration</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Configure email settings for sending automated emails from this network
                    </p>
                  </div>
                </div>

                <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#147FFF] rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">OF</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">Configuring Email Settings For</p>
                        <p className="text-sm text-[var(--muted-foreground)]">{selectedNetwork}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-[#147FFF] text-white">
                      subscribers
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <div className="w-4 h-4 rounded-full border-2 border-[#147FFF] flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-[#147FFF] rounded-full" />
                    </div>
                    <p>Existing configuration found. Update the fields below to modify.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <label className="text-sm font-medium text-[var(--foreground)]">Support Email Address</label>
                    </div>
                    <Input
                      defaultValue="help@orangeburgfiber.net"
                      className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]"
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      Primary support email address for customer communications
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[var(--muted-foreground)]">📞</span>
                      <label className="text-sm font-medium text-[var(--foreground)]">Support Phone Number</label>
                    </div>
                    <Input
                      defaultValue="803-373-0430"
                      className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]"
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      Optional: Primary support phone number for customer contact
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[var(--muted-foreground)]">🏢</span>
                      <label className="text-sm font-medium text-[var(--foreground)]">Company Address</label>
                    </div>
                    <Input
                      defaultValue="1949 West Pinter's Row, Salt Lake City, UT 84119"
                      className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]"
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      Optional: Physical company address for email footers and legal information
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <label className="text-sm font-medium text-[var(--foreground)]">From Domain</label>
                    </div>
                    <Input
                      defaultValue="orangeburgfiber.net"
                      className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]"
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      Domain used for sending emails (must be verified in Postmark)
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <SettingsIcon className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <label className="text-sm font-medium text-[var(--foreground)]">Postmark Server Token</label>
                    </div>
                    <Input
                      type="password"
                      defaultValue="••••••••••••••••"
                      className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]"
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      API token for Postmark email service
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[var(--border)]">
                  <Button className="bg-[#147FFF] hover:bg-[#1068CC]">
                    Save Configuration
                  </Button>
                  <Button variant="outline" className="border-[var(--border)]">
                    Test Email
                  </Button>
                  <Button variant="ghost" className="text-[var(--muted-foreground)]">
                    Cancel
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="comm-types">
              <CommunicationTypesTable />
            </TabsContent>

            <TabsContent value="overview">
              <ViewButton />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}