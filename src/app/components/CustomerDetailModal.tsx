import { X, User, Home, Phone, Mail, Calendar, Package, Wrench, Router, CheckCircle2, XCircle, Clock, DollarSign, FileText, Download, CreditCard, Tag, Activity, Power, Link, Wifi, AlertTriangle, BookOpen, ExternalLink, Zap, MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { TabMenu, TabContent } from '@/app/components/ui/tab-menu';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { CustomerNotesTab } from '@/app/components/CustomerNotesTab';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

export function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  const [activeTab, setActiveTab] = useState('info');

  if (!isOpen || !customer) return null;

  const tabs = [
    { id: 'info', label: 'Customer Info', icon: User },
    { id: 'subscriptions', label: 'Subscriptions', icon: Package },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'installs', label: 'Install History', icon: Wrench },
    { id: 'devices', label: 'Devices & Diagnostics', icon: Router },
    { id: 'notes', label: 'Notes & Activity', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  // Mock data - in real app this would come from API
  const mockSubscriptions = [
    {
      id: 'SUB-001',
      provider: 'Sumo Fiber',
      plan: '2 Gigabit Internet',
      status: 'Active',
      startDate: '12/15/2025',
      monthlyRate: '$89.99',
      contractType: 'Property Access',
      contractStatus: 'Signed',
    },
  ];

  const mockInstalls = [
    {
      id: 'WO-2026-001',
      type: 'Initial Installation',
      status: 'Completed',
      scheduledDate: '1/10/2026',
      completedDate: '1/10/2026',
      technician: 'Mike Johnson',
      notes: 'Fiber drop installed successfully. ONT configured and tested.',
    },
    {
      id: 'WO-2026-002',
      type: 'Service Upgrade',
      status: 'Scheduled',
      scheduledDate: '2/5/2026',
      completedDate: null,
      technician: 'TBD',
      notes: 'Upgrade to 2Gig service',
    },
  ];

  const mockDevices = [
    {
      id: 'DEV-001',
      type: 'ONT',
      model: 'Calix 716GE-I',
      serialNumber: 'CXNK00112233',
      status: 'Online',
      ipAddress: '192.168.1.1',
      macAddress: 'A0:B1:C2:D3:E4:F5',
      lastSeen: '2 minutes ago',
      uptime: '45 days',
    },
    {
      id: 'DEV-002',
      type: 'Router',
      model: 'TP-Link AX3000',
      serialNumber: 'TPL987654321',
      status: 'Online',
      ipAddress: '192.168.1.254',
      macAddress: 'B1:C2:D3:E4:F5:A0',
      lastSeen: '1 minute ago',
      uptime: '30 days',
    },
    {
      id: 'DEV-003',
      type: 'Extender',
      model: 'TP-Link RE505X',
      serialNumber: 'TPL555666777',
      status: 'Offline',
      ipAddress: 'N/A',
      macAddress: 'C2:D3:E4:F5:A0:B1',
      lastSeen: '3 hours ago',
      uptime: 'N/A',
    },
  ];

  const mockBillingHistory = [
    {
      id: 'INV-2026-001',
      date: '1/15/2026',
      description: '2 Gigabit Internet - Monthly Service',
      amount: '$89.99',
      status: 'Paid',
      dueDate: '1/15/2026',
      paidDate: '1/14/2026',
      paymentMethod: 'Auto-pay (Visa ****1234)',
    },
    {
      id: 'INV-2025-012',
      date: '12/15/2025',
      description: '2 Gigabit Internet - Monthly Service',
      amount: '$89.99',
      status: 'Paid',
      dueDate: '12/15/2025',
      paidDate: '12/14/2025',
      paymentMethod: 'Auto-pay (Visa ****1234)',
    },
    {
      id: 'INV-2025-011',
      date: '11/15/2025',
      description: '2 Gigabit Internet - Monthly Service',
      amount: '$89.99',
      status: 'Paid',
      dueDate: '11/15/2025',
      paidDate: '11/13/2025',
      paymentMethod: 'Auto-pay (Visa ****1234)',
    },
  ];

  const mockPromotion = {
    active: true,
    name: 'New Customer Discount',
    description: '$10 off monthly service for 12 months',
    discount: '$10.00',
    remainingMonths: 11,
    expirationDate: '12/15/2026',
  };

  const mockDocuments = [
    {
      id: 'DOC-001',
      type: 'Property Access Agreement',
      signedDate: '12/10/2025',
      status: 'Signed',
      fileName: 'property-access-agreement-2025.pdf',
    },
    {
      id: 'DOC-002',
      type: 'Service Agreement',
      signedDate: '12/10/2025',
      status: 'Signed',
      fileName: 'service-agreement-2025.pdf',
    },
    {
      id: 'DOC-003',
      type: 'Installation Waiver',
      signedDate: '1/10/2026',
      status: 'Signed',
      fileName: 'installation-waiver-2026.pdf',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'online':
        return 'text-[var(--success)] bg-[var(--success)]/10';
      case 'pending':
      case 'scheduled':
        return 'text-[var(--warning)] bg-[var(--warning)]/10';
      case 'offline':
      case 'cancelled':
        return 'text-[var(--error)] bg-[var(--error)]/10';
      default:
        return 'text-[#64748B] bg-[#64748B]/10';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">{customer.customerName}</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">{customer.accountId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <TabMenu
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs.map(tab => ({ id: tab.id, label: tab.label }))}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Customer Info Tab */}
          <TabContent activeTab={activeTab} tabId="info">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="bg-[var(--secondary)] border-[var(--border)] p-4">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Full Name</label>
                      <p className="text-sm text-[var(--foreground)] mt-1">{customer.customerName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Email</label>
                      <p className="text-sm text-[var(--foreground)] mt-1 flex items-center gap-2">
                        <Mail className="w-3 h-3 text-[var(--muted-foreground)]" />
                        {customer.customerName.toLowerCase().replace(' ', '.')}@email.com
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Phone</label>
                      <p className="text-sm text-[var(--foreground)] mt-1 flex items-center gap-2">
                        <Phone className="w-3 h-3 text-[var(--muted-foreground)]" />
                        (716) 555-0123
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Customer Since</label>
                      <p className="text-sm text-[var(--foreground)] mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-[var(--muted-foreground)]" />
                        {customer.addressCreated}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Service Address */}
                <Card className="bg-[var(--secondary)] border-[var(--border)] p-4">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Service Address
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Address</label>
                      <p className="text-sm text-[var(--foreground)] mt-1">{customer.fullAddress}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Ownership Status</label>
                      <p className="text-sm text-[var(--foreground)] mt-1 capitalize">{customer.ownership || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Current Status</label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(customer.currentStatus)}`}>
                          {customer.currentStatus}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Status at Signup</label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(customer.statusAtSignup)}`}>
                          {customer.statusAtSignup}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabContent>

          {/* Subscriptions Tab */}
          <TabContent activeTab={activeTab} tabId="subscriptions">
            <div className="space-y-4">
              {mockSubscriptions.map((subscription) => (
                <Card key={subscription.id} className="bg-[var(--secondary)] border-[var(--border)] p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">{subscription.plan}</h3>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">{subscription.provider}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Subscription ID</label>
                      <p className="text-sm text-[var(--foreground)] mt-1">{subscription.id}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Start Date</label>
                      <p className="text-sm text-[var(--foreground)] mt-1">{subscription.startDate}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Monthly Rate</label>
                      <p className="text-sm text-[var(--foreground)] mt-1 font-semibold">{subscription.monthlyRate}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Contract</label>
                      <p className="text-sm text-[var(--foreground)] mt-1">{subscription.contractType}</p>
                      <p className="text-xs text-[var(--success)] mt-0.5">{subscription.contractStatus}</p>
                    </div>
                  </div>
                </Card>
              ))}
              {mockSubscriptions.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--muted-foreground)]">No active subscriptions</p>
                </div>
              )}
            </div>
          </TabContent>

          {/* Billing Tab */}
          <TabContent activeTab={activeTab} tabId="billing">
            <div className="space-y-6">
              {/* Active Promotion */}
              {mockPromotion.active && (
                <Card className="bg-[var(--secondary)] border-[var(--border)] p-4 border-l-4 border-l-[var(--success)]">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--success)]/10 rounded-lg">
                      <Tag className="w-5 h-5 text-[var(--success)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--foreground)]">{mockPromotion.name}</h3>
                          <p className="text-xs text-[var(--muted-foreground)] mt-1">{mockPromotion.description}</p>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[var(--success)]/10 text-[var(--success)]">
                          Active
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <label className="text-xs text-[var(--muted-foreground)]">Discount Amount</label>
                          <p className="text-sm text-[var(--foreground)] mt-1 font-semibold">{mockPromotion.discount}/month</p>
                        </div>
                        <div>
                          <label className="text-xs text-[var(--muted-foreground)]">Remaining Months</label>
                          <p className="text-sm text-[var(--foreground)] mt-1">{mockPromotion.remainingMonths} months</p>
                        </div>
                        <div>
                          <label className="text-xs text-[var(--muted-foreground)]">Expires</label>
                          <p className="text-sm text-[var(--foreground)] mt-1">{mockPromotion.expirationDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Billing History */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Billing History
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Invoice Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Paid Date</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBillingHistory.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <span className="text-sm font-mono text-[var(--foreground)]">{invoice.id}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-[var(--foreground)]">{invoice.description}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-[var(--foreground)]">{invoice.date}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-[var(--foreground)]">{invoice.dueDate}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-[var(--foreground)]">{invoice.paidDate}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-[var(--foreground)]">{invoice.paymentMethod}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-semibold text-[var(--foreground)]">{invoice.amount}</span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="text-xs">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabContent>

          {/* Install History Tab */}
          <TabContent activeTab={activeTab} tabId="installs">
            <div className="space-y-4">
              {mockInstalls.map((install) => (
                <Card key={install.id} className="bg-[var(--secondary)] border-[var(--border)] p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">{install.type}</h3>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">Work Order: {install.id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(install.status)}`}>
                      {install.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Scheduled Date</label>
                      <p className="text-sm text-[var(--foreground)] mt-1">{install.scheduledDate}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Completed Date</label>
                      <p className="text-sm text-[var(--foreground)] mt-1">{install.completedDate || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Technician</label>
                      <p className="text-sm text-[var(--foreground)] mt-1">{install.technician}</p>
                    </div>
                  </div>
                  {install.notes && (
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)]">Notes</label>
                      <p className="text-sm text-[var(--foreground)] mt-1">{install.notes}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabContent>

          {/* Devices Tab */}
          <TabContent activeTab={activeTab} tabId="devices">
            <div className="space-y-6">
              {/* ONU Status Card */}
              <Card className="bg-[var(--secondary)] border-[var(--border)] p-5">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#147FFF]" />
                    ONU Status
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[var(--success)] rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-[var(--success)]">Online</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-[var(--background)] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Power className="w-4 h-4 text-[var(--success)]" />
                      <label className="text-xs text-[var(--muted-foreground)]">Power Status</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                      <p className="text-sm font-semibold text-[var(--foreground)]">Powered On</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--background)] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Link className="w-4 h-4 text-[var(--success)]" />
                      <label className="text-xs text-[var(--muted-foreground)]">OLT Link Status</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                      <p className="text-sm font-semibold text-[var(--foreground)]">Linked to OLT</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--background)] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-[#147FFF]" />
                      <label className="text-xs text-[var(--muted-foreground)]">Last Seen</label>
                    </div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">2 minutes ago</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Uptime: 45 days</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">ONU Model</label>
                    <p className="text-sm text-[var(--foreground)] font-medium">Calix 716GE-I</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Serial Number</label>
                    <p className="text-sm text-[var(--foreground)] font-mono">CXNK00112233</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">IP Address</label>
                    <p className="text-sm text-[var(--foreground)] font-mono">192.168.1.1</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">MAC Address</label>
                    <p className="text-sm text-[var(--foreground)] font-mono">A0:B1:C2:D3:E4:F5</p>
                  </div>
                </div>
              </Card>

              {/* Service Assignment Validation Card */}
              <Card className="bg-[var(--secondary)] border-[var(--border)] p-5">
                <h3 className="text-base font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#147FFF]" />
                  Service Assignment Validation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-[var(--background)] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                      <label className="text-xs text-[var(--muted-foreground)]">Service Assignment</label>
                    </div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">Properly Assigned</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">Service matched to ONU</p>
                  </div>

                  <div className="p-3 bg-[var(--background)] rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                      <label className="text-xs text-[var(--muted-foreground)]">Service State</label>
                    </div>
                    <p className="text-sm font-semibold text-[var(--success)]">Active</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">Service provisioned and live</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">ONU Port In Use</label>
                    <p className="text-sm text-[var(--foreground)] font-medium">Port 1 (GE)</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Service Plan</label>
                    <p className="text-sm text-[var(--foreground)] font-medium">2 Gigabit Internet</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Provisioning Status</label>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                      <p className="text-sm font-medium text-[var(--success)]">Synchronized</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[var(--success)] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">CRM/NOC Reconciliation Status</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        Service records match network provisioning. No discrepancies detected.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Router & Equipment Documentation Card */}
              <Card className="bg-[var(--secondary)] border-[var(--border)] p-5">
                <h3 className="text-base font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#147FFF]" />
                  Router & Equipment Documentation
                </h3>

                <div className="space-y-4">
                  {/* Router Documentation */}
                  <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--secondary)] rounded-lg">
                          <Wifi className="w-5 h-5 text-[#147FFF]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">Customer Router</p>
                          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">TP-Link AX3000 WiFi 6</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge('online')}`}>
                        Online
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-[var(--muted-foreground)]">MAC Address</label>
                        <p className="text-xs text-[var(--foreground)] font-mono mt-1">B1:C2:D3:E4:F5:A0</p>
                      </div>
                      <div>
                        <label className="text-xs text-[var(--muted-foreground)]">Connection Type</label>
                        <p className="text-xs text-[var(--foreground)] mt-1">Direct to ONU Port 1</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button variant="outline" size="sm" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        LED Behavior Guide
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        Setup & Mesh Guide
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        Troubleshooting Steps
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        User Manual (PDF)
                      </Button>
                    </div>
                  </div>

                  {/* ONU Documentation */}
                  <div className="p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--secondary)] rounded-lg">
                          <Router className="w-5 h-5 text-[#147FFF]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--foreground)]">ONU Device</p>
                          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Calix 716GE-I GigaCenter</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge('online')}`}>
                        Online
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-[var(--muted-foreground)]">Serial Number</label>
                        <p className="text-xs text-[var(--foreground)] font-mono mt-1">CXNK00112233</p>
                      </div>
                      <div>
                        <label className="text-xs text-[var(--muted-foreground)]">Firmware Version</label>
                        <p className="text-xs text-[var(--foreground)] mt-1">v4.2.8 (Latest)</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button variant="outline" size="sm" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        LED Status Meanings
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        Basic Troubleshooting
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        Technical Specifications
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1.5" />
                        Installation Guide
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Connected Devices Table */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                  <Router className="w-4 h-4" />
                  All Connected Devices
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>MAC Address</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead>Uptime</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDevices.map((device) => (
                        <TableRow key={device.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[var(--background)] rounded-lg">
                                <Router className="w-4 h-4 text-[#147FFF]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[var(--foreground)]">{device.model}</p>
                                <p className="text-xs text-[var(--muted-foreground)]">{device.type}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-mono text-[var(--foreground)]">{device.serialNumber}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-mono text-[var(--foreground)]">{device.ipAddress}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-mono text-[var(--foreground)]">{device.macAddress}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[var(--muted-foreground)]" />
                              <span className="text-sm text-[var(--foreground)]">{device.lastSeen}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-[var(--foreground)]">{device.uptime}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {device.status.toLowerCase() === 'online' ? (
                                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                              ) : (
                                <XCircle className="w-4 h-4 text-[var(--error)]" />
                              )}
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(device.status)}`}>
                                {device.status}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabContent>

          {/* Documents Tab */}
          <TabContent activeTab={activeTab} tabId="documents">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Signed Documents
              </h3>
              {mockDocuments.map((document) => (
                <Card key={document.id} className="bg-[var(--secondary)] border-[var(--border)] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-[var(--background)] rounded-lg">
                        <FileText className="w-5 h-5 text-[#147FFF]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[var(--foreground)]">{document.type}</h4>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">{document.fileName}</p>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <label className="text-xs text-[var(--muted-foreground)]">Document ID</label>
                            <p className="text-xs text-[var(--foreground)] mt-1">{document.id}</p>
                          </div>
                          <div>
                            <label className="text-xs text-[var(--muted-foreground)]">Signed Date</label>
                            <p className="text-xs text-[var(--foreground)] mt-1">{document.signedDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(document.status)}`}>
                        {document.status}
                      </span>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {mockDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-3" />
                  <p className="text-sm text-[var(--muted-foreground)]">No documents available</p>
                </div>
              )}
            </div>
          </TabContent>

          {/* Notes Tab */}
          <TabContent activeTab={activeTab} tabId="notes">
            <CustomerNotesTab customer={customer} />
          </TabContent>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-[#147FFF] text-white hover:bg-[#147FFF]/90">
            Edit Customer
          </Button>
        </div>
      </div>
    </div>
  );
}