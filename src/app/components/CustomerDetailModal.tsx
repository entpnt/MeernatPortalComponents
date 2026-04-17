import { X, User, Home, Phone, Mail, Calendar, Package, Wrench, Router, CheckCircle2, XCircle, Clock, DollarSign, FileText, Download, CreditCard, Tag, Activity, Power, Link, Wifi, AlertTriangle, BookOpen, ExternalLink, Zap, MessageSquare, Plus, Image as ImageIcon, ChevronLeft, ChevronRight, Trash2, Edit, MoreVertical, Pause, Ban, PlayCircle, Truck, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { TabMenu, TabContent } from '@/app/components/ui/tab-menu';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/app/components/ui/sheet';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { CustomerNotesTab } from '@/app/components/CustomerNotesTab';
import installPhoto1 from 'figma:asset/f727ffb06036f80973400ed4bce2f5f065b21d9d.png';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

export function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentInstallPhotos, setCurrentInstallPhotos] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Dialog states
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [editAddressDialogOpen, setEditAddressDialogOpen] = useState(false);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  // Form states
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendNotes, setSuspendNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelNotes, setCancelNotes] = useState('');
  const [changeProvider, setChangeProvider] = useState('');
  const [changePlan, setChangePlan] = useState('');
  const [changeNotes, setChangeNotes] = useState('');
  const [pauseStartDate, setPauseStartDate] = useState('');
  const [pauseEndDate, setPauseEndDate] = useState('');
  const [pauseNotes, setPauseNotes] = useState('');
  const [editAddressReason, setEditAddressReason] = useState('');
  const [editAddressValue, setEditAddressValue] = useState('');
  const [editAddressCity, setEditAddressCity] = useState('');
  const [makePrimaryDialogOpen, setMakePrimaryDialogOpen] = useState(false);
  const [addressToMakePrimary, setAddressToMakePrimary] = useState<any>(null);

  if (!customer) return null;

  // Map customer data to support both field naming conventions
  const customerName = customer.name || customer.customerName;
  const customerEmail = customer.email || 'Not provided';

  // Hierarchical data structure: Account -> Addresses -> Subscriptions/Devices/Installs
  const mockAddresses = [
    {
      id: 'ADDR-001',
      address: '123 Main Street, Unit A',
      city: 'Jamestown, NY 14701',
      isPrimary: true,
      subscriptions: [
        {
          id: 'SUB-001',
          provider: 'Orangeburg Fiber',
          plan: '1 Gigabit Internet',
          status: 'Active',
          startDate: '1/10/2026',
          monthlyRate: '$65.95',
          contractType: 'Month-to-Month',
          contractStatus: 'Active',
        },
        {
          id: 'SUB-002',
          provider: 'Sumo Fiber',
          plan: '500 Mbps Internet',
          status: 'Active',
          startDate: '2/1/2026',
          monthlyRate: '$45.00',
          contractType: '12-Month',
          contractStatus: 'Active',
        },
      ],
      devices: [
        {
          id: 'DEV-001',
          type: 'ONT',
          model: 'Calix 716GE-I',
          serialNumber: 'CXNK00112233',
          status: 'Online',
          ipAddress: '192.168.1.1',
          macAddress: 'A0:B1:C2:D3:E4:F5',
          lastSeen: '2 minutes ago'
        },
        {
          id: 'DEV-002',
          type: 'Router',
          model: 'Eero Pro 6E',
          serialNumber: 'EERO556677',
          status: 'Online',
          ipAddress: '192.168.1.254',
          macAddress: 'B1:C2:D3:E4:F5:A6',
          lastSeen: '1 minute ago'
        },
      ],
      installs: [
        {
          id: 'WO-2026-001',
          type: 'Initial Installation',
          status: 'Completed',
          scheduledDate: '1/10/2026',
          completedDate: '1/10/2026',
          technician: 'Mike Johnson',
          notes: 'Fiber drop installed successfully. ONT configured and tested.',
          photos: [
            { id: '1', url: installPhoto1, type: 'Drop Photo', caption: 'Fiber drop installation from pole to building', timestamp: '1/10/2026 10:30 AM' },
            { id: '2', url: installPhoto1, type: 'ONT Installation', caption: 'ONT mounted and configured in utility closet', timestamp: '1/10/2026 2:15 PM' },
            { id: '3', url: installPhoto1, type: 'Cable Management', caption: 'Clean cable routing to ONT location', timestamp: '1/10/2026 2:45 PM' },
            { id: '4', url: installPhoto1, type: 'Final Setup', caption: 'Speed test verification - 1Gbps achieved', timestamp: '1/10/2026 3:30 PM' },
          ],
        },
      ],
    },
    {
      id: 'ADDR-002',
      address: '456 Oak Avenue',
      city: 'Jamestown, NY 14701',
      isPrimary: false,
      subscriptions: [
        {
          id: 'SUB-003',
          provider: 'Orangeburg Fiber',
          plan: '2 Gigabit Internet',
          status: 'Active',
          startDate: '3/15/2026',
          monthlyRate: '$89.99',
          contractType: 'Property Access',
          contractStatus: 'Signed',
        },
      ],
      devices: [
        {
          id: 'DEV-003',
          type: 'ONT',
          model: 'Nokia G-010S-A',
          serialNumber: 'NOKA88990011',
          status: 'Online',
          ipAddress: '192.168.2.1',
          macAddress: 'C3:D4:E5:F6:A7:B8',
          lastSeen: '5 minutes ago'
        },
      ],
      installs: [
        {
          id: 'WO-2026-003',
          type: 'Initial Installation',
          status: 'Scheduled',
          scheduledDate: '3/15/2026',
          completedDate: null,
          technician: 'Sarah Williams',
          notes: 'New property installation for 2Gig service',
          photos: [],
        },
      ],
    },
    {
      id: 'ADDR-003',
      address: '789 Elm Street, Suite 200',
      city: 'Jamestown, NY 14701',
      isPrimary: false,
      subscriptions: [
        {
          id: 'SUB-004',
          provider: 'Orangeburg Fiber',
          plan: '1 Gigabit Internet',
          status: 'Pending',
          startDate: '4/1/2026',
          monthlyRate: '$65.95',
          contractType: 'Month-to-Month',
          contractStatus: 'Pending',
        },
      ],
      devices: [],
      installs: [],
    },
  ];

  // Initialize selected address (primary or first)
  const initializeSelectedAddress = () => {
    const primaryAddress = mockAddresses.find(addr => addr.isPrimary);
    return primaryAddress?.id || mockAddresses[0]?.id || null;
  };

  // Set selected address on mount if not set
  if (selectedAddressId === null && mockAddresses.length > 0) {
    setSelectedAddressId(initializeSelectedAddress());
  }

  // Get selected address data
  const selectedAddress = mockAddresses.find(addr => addr.id === selectedAddressId) || mockAddresses[0];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'online':
        return 'bg-[var(--success)]/10 text-[var(--success)]';
      case 'scheduled':
      case 'pending':
        return 'bg-[var(--warning)]/10 text-[var(--warning)]';
      case 'cancelled':
      case 'offline':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-secondary text-foreground';
    }
  };

  const openLightbox = (photos: any[], index: number) => {
    setCurrentInstallPhotos(photos);
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % currentInstallPhotos.length);
  };

  const previousPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + currentInstallPhotos.length) % currentInstallPhotos.length);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          className="w-[45vw] max-w-none p-0 flex flex-col"
        >
          {/* Header */}
          <SheetHeader className="px-6 py-5 border-b border-border">
            <SheetTitle className="text-2xl font-bold text-foreground">{customerName}</SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              {customer.accountId}
            </SheetDescription>
          </SheetHeader>

          {/* Tabs */}
          <div className="px-6 pt-4">
            <TabMenu
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={[
                { id: 'info', label: 'Customer Info', icon: User },
                { id: 'subscriptions', label: 'Subscriptions', icon: Package },
                { id: 'billing', label: 'Billing', icon: DollarSign },
                { id: 'installs', label: 'Install History', icon: Wrench },
                { id: 'devices', label: 'Devices & Diagnostics', icon: Router },
                { id: 'notes', label: 'Notes & Activity', icon: MessageSquare },
                { id: 'documents', label: 'Documents', icon: FileText },
              ]}
            />
          </div>

          {/* Address Selector */}
          {mockAddresses.length > 1 && activeTab !== 'info' && (
            <div className="px-6 pt-4 pb-2 border-b border-border">
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-[var(--muted-foreground)]" />
                <Select value={selectedAddressId || ''} onValueChange={setSelectedAddressId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an address" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAddresses.map((addr) => (
                      <SelectItem key={addr.id} value={addr.id}>
                        <div className="flex items-center gap-2">
                          <span>{addr.address}</span>
                          {addr.isPrimary && (
                            <span className="text-xs text-[var(--info)]">(Primary)</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Customer Info Tab */}
            <TabContent activeTab={activeTab} tabId="info">
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-5 pb-3 border-b border-border">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">Name</label>
                      <p className="text-sm text-foreground mt-2">{customerName}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">Email</label>
                      <p className="text-sm text-foreground mt-2">{customerEmail}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">Phone</label>
                      <p className="text-sm text-foreground mt-2">{customer.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">Account ID</label>
                      <p className="text-sm text-foreground mt-2">{customer.accountId}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">Service Addresses</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {mockAddresses.map((addr, index) => (
                      <div key={addr.id} className={index > 0 ? 'pt-6 border-t border-border' : ''}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-foreground">{addr.address}</p>
                              {addr.isPrimary && (
                                <span className="px-2 py-0.5 bg-[var(--info)]/10 text-[var(--info)] text-xs rounded-md font-medium">Primary</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{addr.city}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!addr.isPrimary && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setAddressToMakePrimary(addr);
                                  setMakePrimaryDialogOpen(true);
                                }}
                              >
                                Make Primary
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setEditingAddress(addr);
                                setEditAddressValue(addr.address);
                                setEditAddressCity(addr.city);
                                setEditAddressDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 text-[var(--muted-foreground)]" />
                            </Button>
                            {!addr.isPrimary && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:text-destructive">
                                <Trash2 className="w-4 h-4 text-[var(--muted-foreground)]" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs mt-3">
                          <div>
                            <span className="text-muted-foreground">Subscriptions:</span>
                            <span className="text-foreground ml-1 font-medium">{addr.subscriptions.length}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Devices:</span>
                            <span className="text-foreground ml-1 font-medium">{addr.devices.length}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Installs:</span>
                            <span className="text-foreground ml-1 font-medium">{addr.installs.length}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabContent>

            {/* Subscriptions Tab */}
            <TabContent activeTab={activeTab} tabId="subscriptions">
              <div className="space-y-6">
                {selectedAddress && selectedAddress.subscriptions.length > 0 ? (
                  selectedAddress.subscriptions.map((sub, subIndex) => (
                    <div key={sub.id} className={subIndex > 0 ? 'pt-6 border-t border-border' : ''}>
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-sm font-semibold text-foreground">{sub.plan}</h4>
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadge(sub.status)}`}>
                              {sub.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{sub.provider} • {sub.id}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSubscription(sub);
                            setEditMenuOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 mb-5">
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Start Date</label>
                          <p className="text-sm text-foreground mt-2">{sub.startDate}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Monthly Rate</label>
                          <p className="text-sm text-foreground mt-2">{sub.monthlyRate}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Contract Type</label>
                          <p className="text-sm text-foreground mt-2">{sub.contractType}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wide">Contract Status</label>
                          <p className="text-sm text-foreground mt-2">{sub.contractStatus}</p>
                        </div>
                      </div>

                      {/* Service Alerts */}
                      {sub.status.toLowerCase() === 'suspended' && (
                        <div className="flex items-start gap-3 p-3 bg-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-md mb-4">
                          <AlertTriangle className="w-4 h-4 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">Service Suspended</p>
                            <p className="text-xs text-muted-foreground mt-1">Reason: Payment past due • Suspended on 3/15/2026</p>
                          </div>
                          <Button variant="outline" size="sm" className="flex-shrink-0">
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Reactivate
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No subscriptions at this address</p>
                )}
              </div>
            </TabContent>

            {/* Billing Tab */}
            <TabContent activeTab={activeTab} tabId="billing">
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-5 pb-3 border-b border-border">Billing Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Current Balance</span>
                      <span className="text-sm font-semibold text-foreground">$0.00</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Next Bill Date</span>
                      <span className="text-sm font-semibold text-foreground">2/10/2026</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Monthly Total</span>
                      <span className="text-sm font-semibold text-foreground">$155.94</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-5 pb-3 border-b border-border">Recent Invoices</h3>
                  <div className="space-y-0">
                    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">Invoice #INV-2026-001</p>
                        <p className="text-xs text-muted-foreground mt-1">1/10/2026</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-foreground">$155.94</span>
                        <span className="px-2.5 py-1 bg-[var(--success)]/10 text-[var(--success)] text-xs rounded-md font-medium">Paid</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabContent>

            {/* Install History Tab */}
            <TabContent activeTab={activeTab} tabId="installs">
              <div className="space-y-6">
                {selectedAddress && selectedAddress.installs.length > 0 ? (
                  selectedAddress.installs.map((install, installIndex) => (
                          <div key={install.id} className={installIndex > 0 ? 'pt-6 border-t border-border' : ''}>
                            <div className="flex items-start justify-between mb-5">
                              <div>
                                <h4 className="text-sm font-semibold text-foreground">{install.type}</h4>
                                <p className="text-xs text-muted-foreground mt-1">Work Order: {install.id}</p>
                              </div>
                              <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadge(install.status)}`}>
                                {install.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mb-5">
                              <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wide">Scheduled Date</label>
                                <p className="text-sm text-foreground mt-2">{install.scheduledDate}</p>
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wide">Completed Date</label>
                                <p className="text-sm text-foreground mt-2">{install.completedDate || 'N/A'}</p>
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground uppercase tracking-wide">Technician</label>
                                <p className="text-sm text-foreground mt-2">{install.technician}</p>
                              </div>
                            </div>
                            {install.notes && (
                              <div className="mb-5">
                                <label className="text-xs text-muted-foreground uppercase tracking-wide">Notes</label>
                                <p className="text-sm text-foreground mt-2">{install.notes}</p>
                              </div>
                            )}

                            {/* Installation Photos */}
                            {install.photos && install.photos.length > 0 && (
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-3">
                                  <label className="text-xs text-muted-foreground flex items-center gap-2 uppercase tracking-wide">
                                    <ImageIcon className="w-4 h-4" />
                                    Installation Photos ({install.photos.length})
                                  </label>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {install.photos.map((photo: any, photoIndex: number) => (
                                    <div
                                      key={photo.id}
                                      className="relative group cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary transition-all"
                                      onClick={() => openLightbox(install.photos, photoIndex)}
                                    >
                                      <img
                                        src={photo.url}
                                        alt={photo.caption}
                                        className="w-full h-32 object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-center px-2">
                                          <p className="text-xs font-medium text-white mb-1">{photo.type}</p>
                                          <p className="text-xs text-white/80 line-clamp-2">{photo.caption}</p>
                                        </div>
                                      </div>
                                      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                                        {photoIndex + 1}/{install.photos.length}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No installation history at this address</p>
                )}
              </div>
            </TabContent>

            {/* Devices Tab */}
            <TabContent activeTab={activeTab} tabId="devices">
              <div className="space-y-6">
                {selectedAddress && selectedAddress.devices.length > 0 ? (
                  <>
                    {/* ONU Status - only show for addresses with ONT */}
                    {selectedAddress.devices.some(d => d.type === 'ONT') && (
                          <div className="mb-6 pb-6 border-b border-border">
                            <div className="flex items-start justify-between mb-5">
                              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[var(--info)]" />
                                ONU Status
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-[var(--success)] rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-[var(--success)]">Online</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Power className="w-4 h-4 text-[var(--success)]" />
                                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Power Status</label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                                  <p className="text-sm font-semibold text-foreground">Powered On</p>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Link className="w-4 h-4 text-[var(--success)]" />
                                  <label className="text-xs text-muted-foreground uppercase tracking-wide">OLT Link Status</label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                                  <p className="text-sm font-semibold text-foreground">Linked to OLT</p>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Zap className="w-4 h-4 text-[var(--success)]" />
                                  <label className="text-xs text-muted-foreground uppercase tracking-wide">Signal Strength</label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                                  <p className="text-sm font-semibold text-foreground">Excellent (-18 dBm)</p>
                                </div>
                              </div>
                            </div>
                      </div>
                    )}

                    {/* Device List */}
                    {selectedAddress.devices.map((device, deviceIndex) => (
                      <div key={device.id} className={deviceIndex > 0 ? 'pt-6 border-t border-border' : ''}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Router className="w-5 h-5 text-[var(--info)]" />
                            <div>
                              <h4 className="text-sm font-semibold text-foreground">{device.type}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{device.model}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadge(device.status)}`}>
                            {device.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                          <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wide">Serial Number</label>
                            <p className="text-sm text-foreground mt-2">{device.serialNumber}</p>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wide">IP Address</label>
                            <p className="text-sm text-foreground mt-2">{device.ipAddress}</p>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wide">MAC Address</label>
                            <p className="text-sm text-foreground mt-2">{device.macAddress}</p>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wide">Last Seen</label>
                            <p className="text-sm text-foreground mt-2">{device.lastSeen}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No devices at this address</p>
                )}
              </div>
            </TabContent>

            {/* Notes & Activity Tab */}
            <TabContent activeTab={activeTab} tabId="notes">
              <CustomerNotesTab customerId={customer.accountId} />
            </TabContent>

            {/* Documents Tab */}
            <TabContent activeTab={activeTab} tabId="documents">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-5 pb-3 border-b border-border">Customer Documents</h3>
                <div className="space-y-0">
                  <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[var(--info)]" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Property Access Agreement</p>
                        <p className="text-xs text-muted-foreground mt-1">Signed on 1/5/2026</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[var(--info)]" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Service Agreement</p>
                        <p className="text-xs text-muted-foreground mt-1">Signed on 1/5/2026</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </TabContent>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex justify-end gap-3 mt-auto">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="default">
              Save
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Suspend Service Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Suspend Service</DialogTitle>
            <DialogDescription>
              Suspend {selectedSubscription?.plan} service. This action can be reversed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="suspend-reason">Reason for Suspension *</Label>
              <Select value={suspendReason} onValueChange={setSuspendReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment-overdue">Payment Past Due</SelectItem>
                  <SelectItem value="customer-request">Customer Request</SelectItem>
                  <SelectItem value="fraud-investigation">Fraud Investigation</SelectItem>
                  <SelectItem value="policy-violation">Policy Violation</SelectItem>
                  <SelectItem value="temporary-hold">Temporary Service Hold</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="suspend-notes">Additional Notes</Label>
              <Textarea
                id="suspend-notes"
                placeholder="Add any additional details..."
                value={suspendNotes}
                onChange={(e) => setSuspendNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // Handle suspend logic here
                console.log('Suspending subscription:', selectedSubscription, suspendReason, suspendNotes);
                setSuspendDialogOpen(false);
                setSuspendReason('');
                setSuspendNotes('');
              }}
              disabled={!suspendReason}
            >
              Suspend Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Service Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Service</DialogTitle>
            <DialogDescription>
              Cancel {selectedSubscription?.plan} service. This action cannot be easily reversed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Reason for Cancellation *</Label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moving">Customer Moving</SelectItem>
                  <SelectItem value="price-too-high">Price Too High</SelectItem>
                  <SelectItem value="switching-provider">Switching to Another Provider</SelectItem>
                  <SelectItem value="poor-service">Poor Service Quality</SelectItem>
                  <SelectItem value="no-longer-needed">No Longer Needed</SelectItem>
                  <SelectItem value="financial-reasons">Financial Reasons</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cancel-notes">Additional Notes</Label>
              <Textarea
                id="cancel-notes"
                placeholder="Add any additional details..."
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Handle cancel logic here
                console.log('Canceling subscription:', selectedSubscription, cancelReason, cancelNotes);
                setCancelDialogOpen(false);
                setCancelReason('');
                setCancelNotes('');
              }}
              disabled={!cancelReason}
            >
              Cancel Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change/Modify Service Dialog */}
      <Dialog open={changeDialogOpen} onOpenChange={setChangeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modify Service</DialogTitle>
            <DialogDescription>
              Change provider or plan for {selectedSubscription?.plan}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="change-provider">Service Provider *</Label>
              <Select value={changeProvider} onValueChange={setChangeProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orangeburg">Orangeburg Fiber</SelectItem>
                  <SelectItem value="sumo">Sumo Fiber</SelectItem>
                  <SelectItem value="spectrum">Spectrum</SelectItem>
                  <SelectItem value="att">AT&T Fiber</SelectItem>
                  <SelectItem value="verizon">Verizon Fios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="change-plan">Service Plan *</Label>
              <Select value={changePlan} onValueChange={setChangePlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500mbps">500 Mbps Internet - $45.00/mo</SelectItem>
                  <SelectItem value="1gig">1 Gigabit Internet - $65.95/mo</SelectItem>
                  <SelectItem value="2gig">2 Gigabit Internet - $89.99/mo</SelectItem>
                  <SelectItem value="5gig">5 Gigabit Internet - $149.99/mo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="change-notes">Reason for Change</Label>
              <Textarea
                id="change-notes"
                placeholder="Why is the service being changed?"
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // Handle change logic here
                console.log('Changing subscription:', selectedSubscription, changeProvider, changePlan, changeNotes);
                setChangeDialogOpen(false);
                setChangeProvider('');
                setChangePlan('');
                setChangeNotes('');
              }}
              disabled={!changeProvider || !changePlan}
            >
              Change Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pause Service Dialog */}
      <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pause Service</DialogTitle>
            <DialogDescription>
              Temporarily pause {selectedSubscription?.plan} service. Service will automatically resume on the end date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pause-start-date">Pause Start Date *</Label>
              <Input
                id="pause-start-date"
                type="date"
                value={pauseStartDate}
                onChange={(e) => setPauseStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pause-end-date">Resume Date *</Label>
              <Input
                id="pause-end-date"
                type="date"
                value={pauseEndDate}
                onChange={(e) => setPauseEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pause-notes">Reason for Pause</Label>
              <Textarea
                id="pause-notes"
                placeholder="Why is the service being paused?"
                value={pauseNotes}
                onChange={(e) => setPauseNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPauseDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // Handle pause logic here
                console.log('Pausing subscription:', selectedSubscription, pauseStartDate, pauseEndDate, pauseNotes);
                setPauseDialogOpen(false);
                setPauseStartDate('');
                setPauseEndDate('');
                setPauseNotes('');
              }}
              disabled={!pauseStartDate || !pauseEndDate}
            >
              Pause Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={editAddressDialogOpen} onOpenChange={setEditAddressDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update address information for this account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-address">Street Address *</Label>
              <Input
                id="edit-address"
                placeholder="123 Main Street"
                value={editAddressValue}
                onChange={(e) => setEditAddressValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city">City, State ZIP *</Label>
              <Input
                id="edit-city"
                placeholder="Jamestown, NY 14701"
                value={editAddressCity}
                onChange={(e) => setEditAddressCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address-reason">Reason for Change *</Label>
              <Select value={editAddressReason} onValueChange={setEditAddressReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer-moved">Customer Moved</SelectItem>
                  <SelectItem value="correction-typo">Correction/Typo</SelectItem>
                  <SelectItem value="format-standardization">Address Format Standardization</SelectItem>
                  <SelectItem value="unit-number-added">Unit/Apartment Number Added</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAddressDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // Handle edit address logic here
                console.log('Editing address:', editingAddress, editAddressValue, editAddressCity, editAddressReason);
                setEditAddressDialogOpen(false);
                setEditAddressReason('');
                setEditAddressValue('');
                setEditAddressCity('');
              }}
              disabled={!editAddressValue || !editAddressCity || !editAddressReason}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subscription Menu Dialog */}
      <Dialog open={editMenuOpen} onOpenChange={setEditMenuOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Choose an action for {selectedSubscription?.plan}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <button
              onClick={() => {
                setEditMenuOpen(false);
                setChangeDialogOpen(true);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-[var(--muted)] rounded-md transition-colors border border-border"
            >
              <Edit className="w-5 h-5 text-[var(--muted-foreground)]" />
              <div className="text-left">
                <div className="font-medium">Modify Service</div>
                <div className="text-xs text-muted-foreground">Change provider or plan</div>
              </div>
            </button>
            <button
              onClick={() => {
                setEditMenuOpen(false);
                setPauseDialogOpen(true);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-[var(--muted)] rounded-md transition-colors border border-border"
            >
              <Pause className="w-5 h-5 text-[var(--muted-foreground)]" />
              <div className="text-left">
                <div className="font-medium">Pause Service</div>
                <div className="text-xs text-muted-foreground">Temporarily pause with dates</div>
              </div>
            </button>
            <button
              onClick={() => {
                setEditMenuOpen(false);
                setSuspendDialogOpen(true);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-[var(--muted)] rounded-md transition-colors border border-border"
            >
              <AlertCircle className="w-5 h-5 text-[var(--muted-foreground)]" />
              <div className="text-left">
                <div className="font-medium">Suspend Service</div>
                <div className="text-xs text-muted-foreground">Suspend with reason tracking</div>
              </div>
            </button>
            <button
              onClick={() => {
                setEditMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-[var(--muted)] rounded-md transition-colors border border-border"
            >
              <Truck className="w-5 h-5 text-[var(--muted-foreground)]" />
              <div className="text-left">
                <div className="font-medium">Schedule Move</div>
                <div className="text-xs text-muted-foreground">Move service to new address</div>
              </div>
            </button>
            <div className="border-t border-border my-2"></div>
            <button
              onClick={() => {
                setEditMenuOpen(false);
                setCancelDialogOpen(true);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors border border-destructive/20"
            >
              <Ban className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Cancel Service</div>
                <div className="text-xs text-destructive/80">Permanently cancel subscription</div>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Make Primary Address Dialog */}
      <Dialog open={makePrimaryDialogOpen} onOpenChange={setMakePrimaryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Make Primary Address</DialogTitle>
            <DialogDescription>
              Set {addressToMakePrimary?.address} as the primary address for this account
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will update the primary service address for all billing and communication purposes. The current primary address will remain on the account but will no longer be marked as primary.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMakePrimaryDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                // Handle make primary logic here
                console.log('Making address primary:', addressToMakePrimary);
                setMakePrimaryDialogOpen(false);
                setAddressToMakePrimary(null);
              }}
            >
              Make Primary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo Lightbox Modal */}
      {lightboxOpen && currentInstallPhotos.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Arrows */}
          {currentInstallPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previousPhoto();
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Photo Container */}
          <div className="max-w-5xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentInstallPhotos[currentPhotoIndex].url}
              alt={currentInstallPhotos[currentPhotoIndex].caption}
              className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
            />

            {/* Photo Info */}
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white font-semibold">{currentInstallPhotos[currentPhotoIndex].type}</p>
                  <p className="text-white/80 text-sm mt-1">{currentInstallPhotos[currentPhotoIndex].caption}</p>
                </div>
                <span className="text-white/60 text-sm">
                  {currentPhotoIndex + 1} / {currentInstallPhotos.length}
                </span>
              </div>
              <p className="text-white/60 text-xs">{currentInstallPhotos[currentPhotoIndex].timestamp}</p>
            </div>

            {/* Thumbnail Strip */}
            {currentInstallPhotos.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {currentInstallPhotos.map((photo: any, index: number) => (
                  <button
                    key={photo.id}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentPhotoIndex
                        ? 'border-primary scale-105'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img src={photo.url} alt={photo.type} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
