import React, { useState } from 'react';
import { Search, Filter, Bell, AlertCircle, XCircle, AlertTriangle, Info, Eye, Check, CheckCircle, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Card } from '@/app/components/ui/card';
import { cn } from '@/lib/utils';

type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertStatus = 'new' | 'acknowledged' | 'resolved';

interface Alert {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  source: string;
  affectedSystem: string;
  timestamp: string;
  isRead: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    severity: 'critical',
    status: 'new',
    title: 'Network Interface Down',
    description: 'Primary WAN interface eth0 on router RTR-CORE-01 is down. Failover to backup link active.',
    source: 'Network Monitoring',
    affectedSystem: 'RTR-CORE-01 (192.168.1.1)',
    timestamp: '2025-01-27T14:23:15Z',
    isRead: false,
  },
  {
    id: 'ALT-002',
    severity: 'critical',
    status: 'new',
    title: 'High Packet Loss Detected',
    description: 'Packet loss exceeding 15% detected on link to regional hub. Customer impact reported.',
    source: 'Network Monitoring',
    affectedSystem: 'Link-Regional-Hub-A',
    timestamp: '2025-01-27T14:18:42Z',
    isRead: false,
  },
  {
    id: 'ALT-003',
    severity: 'warning',
    status: 'acknowledged',
    title: 'Bandwidth Utilization High',
    description: 'Bandwidth utilization on primary uplink has exceeded 85% for the past 30 minutes.',
    source: 'Capacity Management',
    affectedSystem: 'Uplink-Primary-01',
    timestamp: '2025-01-27T13:45:22Z',
    isRead: true,
  },
  {
    id: 'ALT-004',
    severity: 'warning',
    status: 'new',
    title: 'ONT Signal Degradation',
    description: 'ONT-12453 signal strength has degraded to -28 dBm. Customer service may be affected.',
    source: 'Device Monitoring',
    affectedSystem: 'ONT-12453 (Subscriber: John Smith)',
    timestamp: '2025-01-27T13:12:08Z',
    isRead: false,
  },
  {
    id: 'ALT-005',
    severity: 'info',
    status: 'resolved',
    title: 'Scheduled Maintenance Completed',
    description: 'Planned firmware upgrade on distribution switches completed successfully.',
    source: 'Maintenance',
    affectedSystem: 'SW-DIST-01, SW-DIST-02',
    timestamp: '2025-01-27T12:00:00Z',
    isRead: true,
  },
  {
    id: 'ALT-006',
    severity: 'critical',
    status: 'acknowledged',
    title: 'OLT Power Supply Failure',
    description: 'Redundant power supply on OLT-North-01 has failed. Operating on single PSU.',
    source: 'Hardware Monitoring',
    affectedSystem: 'OLT-North-01',
    timestamp: '2025-01-27T11:34:56Z',
    isRead: true,
  },
  {
    id: 'ALT-007',
    severity: 'warning',
    status: 'acknowledged',
    title: 'Temperature Threshold Exceeded',
    description: 'Equipment rack temperature in CO-Building-A exceeded 28°C.',
    source: 'Environmental Monitoring',
    affectedSystem: 'Rack-A-12 (CO-Building-A)',
    timestamp: '2025-01-27T10:22:14Z',
    isRead: true,
  },
  {
    id: 'ALT-008',
    severity: 'info',
    status: 'resolved',
    title: 'Configuration Backup Completed',
    description: 'Automatic configuration backup completed for all network devices.',
    source: 'System',
    affectedSystem: 'All Network Devices',
    timestamp: '2025-01-27T09:00:00Z',
    isRead: true,
  },
];

const severityConfig = {
  critical: {
    label: 'Critical',
    icon: XCircle,
    color: 'text-[#E60000]',
    bg: 'bg-[#E60000]/10',
    border: 'border-[#E60000]/20',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    color: 'text-[#DC6300]',
    bg: 'bg-[#DC6300]/10',
    border: 'border-[#DC6300]/20',
  },
  info: {
    label: 'Info',
    icon: Info,
    color: 'text-[#147FFF]',
    bg: 'bg-[#147FFF]/10',
    border: 'border-[#147FFF]/20',
  },
};

const statusConfig = {
  new: {
    label: 'New',
    color: 'bg-[#E60000] text-white',
  },
  acknowledged: {
    label: 'Acknowledged',
    color: 'bg-[#DC6300] text-white',
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-[#21DB00] text-white',
  },
};

export function AlertsContent() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSelectAlert = (id: string) => {
    setSelectedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedAlerts.size === filteredAlerts.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(filteredAlerts.map(a => a.id)));
    }
  };

  const markAsRead = (ids: string[]) => {
    setAlerts(prev => prev.map(alert => 
      ids.includes(alert.id) ? { ...alert, isRead: true } : alert
    ));
  };

  const markAsAcknowledged = (ids: string[]) => {
    setAlerts(prev => prev.map(alert => 
      ids.includes(alert.id) ? { ...alert, status: 'acknowledged', isRead: true } : alert
    ));
  };

  const markAsResolved = (ids: string[]) => {
    setAlerts(prev => prev.map(alert => 
      ids.includes(alert.id) ? { ...alert, status: 'resolved', isRead: true } : alert
    ));
  };

  const deleteAlerts = (ids: string[]) => {
    setAlerts(prev => prev.filter(alert => !ids.includes(alert.id)));
    setSelectedAlerts(new Set());
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.affectedSystem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const alertCounts = {
    total: alerts.length,
    new: alerts.filter(a => a.status === 'new').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    unread: alerts.filter(a => !a.isRead).length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Network Alerts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and manage network alerts and incidents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-secondary border-border text-foreground hover:bg-[var(--btn-secondary-hover)]"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{alertCounts.total}</p>
              </div>
              <Bell className="w-8 h-8 text-[var(--focus)]" />
            </div>
          </div>
          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Alerts</p>
                <p className="text-2xl font-semibold text-[var(--error)] mt-1">{alertCounts.new}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-[var(--error)]" />
            </div>
          </div>
          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-semibold text-[var(--error)] mt-1">{alertCounts.critical}</p>
              </div>
              <XCircle className="w-8 h-8 text-[var(--error)]" />
            </div>
          </div>
          <div className="bg-secondary border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-semibold text-foreground mt-1">{alertCounts.unread}</p>
              </div>
              <Eye className="w-8 h-8 text-[var(--focus)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-background border border-border rounded-lg p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts by title, description, or affected system..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border text-foreground"
              />
            </div>
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px] bg-background border-border text-foreground">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-background border-border text-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedAlerts.size > 0 && (
        <div className="bg-[var(--focus)]/10 border border-[var(--focus)]/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground">
              {selectedAlerts.size} alert{selectedAlerts.size > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => markAsRead(Array.from(selectedAlerts))}
                className="bg-secondary border-border text-foreground hover:bg-[var(--btn-secondary-hover)]"
              >
                <Eye className="w-4 h-4 mr-2" />
                Mark as Read
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => markAsAcknowledged(Array.from(selectedAlerts))}
                className="bg-secondary border-border text-foreground hover:bg-[var(--btn-secondary-hover)]"
              >
                <Check className="w-4 h-4 mr-2" />
                Acknowledge
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => markAsResolved(Array.from(selectedAlerts))}
                className="bg-secondary border-border text-foreground hover:bg-[var(--btn-secondary-hover)]"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteAlerts(Array.from(selectedAlerts))}
                className="bg-secondary border-border text-[var(--error)] hover:bg-[var(--btn-secondary-hover)]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedAlerts(new Set())}
                className="bg-secondary border-border text-foreground hover:bg-[var(--btn-secondary-hover)]"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <Card className="bg-card border-border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                  <Checkbox
                    checked={selectedAlerts.size === filteredAlerts.length && filteredAlerts.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="border-muted-foreground"
                  />
                </TableHead>
                <TableHead className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">SEVERITY</TableHead>
                <TableHead className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">STATUS</TableHead>
                <TableHead className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">ALERT DETAILS</TableHead>
                <TableHead className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">AFFECTED SYSTEM</TableHead>
                <TableHead className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">TIME</TableHead>
                <TableHead className="text-left py-3 px-4 text-xs font-medium text-muted-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No alerts found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert) => {
                  const SeverityIcon = severityConfig[alert.severity].icon;
                  const isSelected = selectedAlerts.has(alert.id);

                  return (
                    <TableRow
                      key={alert.id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                        !alert.isRead ? 'bg-[var(--focus)]/5' : ''
                      } ${isSelected ? 'bg-[var(--focus)]/10' : ''}`}
                    >
                      {/* Checkbox */}
                      <TableCell className="py-3 px-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectAlert(alert.id)}
                          className="border-muted-foreground"
                        />
                      </TableCell>

                      {/* Severity */}
                      <TableCell className="py-3 px-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${severityConfig[alert.severity].bg} ${severityConfig[alert.severity].border}`}>
                          <SeverityIcon className={`w-4 h-4 ${severityConfig[alert.severity].color}`} />
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig[alert.status].color}`}>
                          {statusConfig[alert.status].label}
                        </span>
                      </TableCell>

                      {/* Alert Details */}
                      <TableCell className="py-3 px-4">
                        <div className="flex items-start gap-2">
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-[var(--focus)] rounded-full mt-1.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground mb-1">{alert.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              <span className="text-[var(--focus)]">{alert.id}</span> • {alert.source}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Affected System */}
                      <TableCell className="py-3 px-4">
                        <p className="text-sm text-foreground font-mono">{alert.affectedSystem}</p>
                      </TableCell>

                      {/* Time */}
                      <TableCell className="py-3 px-4">
                        <p className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</p>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => markAsRead([alert.id])}>
                              <Eye className="w-4 h-4 mr-2" />
                              Mark as Read
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => markAsAcknowledged([alert.id])}>
                              <Check className="w-4 h-4 mr-2" />
                              Acknowledge
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => markAsResolved([alert.id])}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark as Resolved
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteAlerts([alert.id])}
                              className="text-[var(--error)]"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Alert
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Results Summary */}
        {filteredAlerts.length > 0 && (
          <div className="mt-4 pb-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}