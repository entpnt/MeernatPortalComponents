import { X, User, Home, Phone, Mail, Calendar, Package, Wrench, Router, CheckCircle2, XCircle, Clock, DollarSign, FileText, Download, CreditCard, Tag, Activity, Power, Link, Wifi, AlertTriangle, BookOpen, ExternalLink, Zap, MessageSquare, Plus, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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

  if (!customer) return null;

  // Map customer data to support both field naming conventions
  const customerName = customer.name || customer.customerName;
  const customerEmail = customer.email || 'Not provided';
  const customerAddress = customer.address || customer.fullAddress;

  const mockSubscriptions = [
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
      photos: [
        { id: '1', url: installPhoto1, type: 'Drop Photo', caption: 'Fiber drop installation from pole to building', timestamp: '1/10/2026 10:30 AM' },
        { id: '2', url: installPhoto1, type: 'ONT Installation', caption: 'ONT mounted and configured in utility closet', timestamp: '1/10/2026 2:15 PM' },
        { id: '3', url: installPhoto1, type: 'Cable Management', caption: 'Clean cable routing to ONT location', timestamp: '1/10/2026 2:45 PM' },
        { id: '4', url: installPhoto1, type: 'Final Setup', caption: 'Speed test verification - 1Gbps achieved', timestamp: '1/10/2026 3:30 PM' },
      ],
    },
    {
      id: 'WO-2026-002',
      type: 'Service Upgrade',
      status: 'Scheduled',
      scheduledDate: '2/5/2026',
      completedDate: null,
      technician: 'TBD',
      notes: 'Upgrade to 2Gig service',
      photos: [],
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
  ];

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
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">Status</label>
                      <p className="text-sm text-foreground mt-2">{customer.subscriptionStatus || customer.status || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-5 pb-3 border-b border-border">Service Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">Address</label>
                      <p className="text-sm text-foreground mt-2">{customerAddress}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide">City, State ZIP</label>
                      <p className="text-sm text-foreground mt-2">{customer.city || 'Jamestown, NY 14701'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabContent>

            {/* Subscriptions Tab */}
            <TabContent activeTab={activeTab} tabId="subscriptions">
              <div className="space-y-6">
                {mockSubscriptions.map((sub, index) => (
                  <div key={sub.id} className={index > 0 ? 'pt-6 border-t border-border' : ''}>
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{sub.plan}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{sub.provider}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadge(sub.status)}`}>
                        {sub.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
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
                  </div>
                ))}
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
                {mockInstalls.map((install, index) => (
                  <div key={install.id} className={index > 0 ? 'pt-6 border-t border-border' : ''}>
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{install.type}</h3>
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
                          <label className="text-xs text-muted-foreground flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Installation Photos ({install.photos.length})
                          </label>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {install.photos.map((photo: any, index: number) => (
                            <div
                              key={photo.id}
                              className="relative group cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary transition-all"
                              onClick={() => openLightbox(install.photos, index)}
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
                                {index + 1}/{install.photos.length}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabContent>

            {/* Devices Tab */}
            <TabContent activeTab={activeTab} tabId="devices">
              <div className="space-y-8">
                {/* ONU Status */}
                <div>
                  <div className="flex items-start justify-between mb-5 pb-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[var(--info)]" />
                      ONU Status
                    </h3>
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

                {/* Devices List */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-5 pb-3 border-b border-border">Connected Devices</h3>
                  <div className="space-y-6">
                    {mockDevices.map((device, index) => (
                      <div key={device.id} className={index > 0 ? 'pt-6 border-t border-border' : ''}>
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
                  </div>
                </div>
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
              Edit Customer
            </Button>
          </div>
        </SheetContent>
      </Sheet>

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
