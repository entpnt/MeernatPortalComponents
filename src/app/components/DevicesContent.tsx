import { useState } from 'react';
import { Search, MoreVertical, X, ChevronLeft, ChevronRight, RefreshCw, RotateCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Modal } from '@/app/components/ui/modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';

// Device interface
interface Device {
  id: string;
  customId: string;
  serial: string;
  description: string;
  type: string;
  installed: string;
  created: string;
  updated: string;
  status: string;
  globalUniqueId: string;
  product: string;
  firmwareVersion: string;
  networkSwitch: string;
  switchPort: string;
  location: {
    houseNumber: string;
    preDirectional: string;
    street: string;
    postDirectional: string;
    apartmentNumber: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude: string;
    longitude: string;
    elevation: string;
    uri: string;
  };
  ports: Array<{
    name: string;
    type: string;
    state: string;
    speed: string;
    throughputOut: string;
    throughputIn: string;
  }>;
  serviceProfiles: Array<{
    port: string;
    service: string;
    plan: string;
    type: string;
    sTag: string;
    cTag: string;
  }>;
  notes: string;
}

// Mock device data
const mockDevices: Device[] = [
  {
    id: '1',
    customId: '18_King_St.CDE8',
    serial: 'ISKT2308CDE8',
    description: '4 - Subscription for Heald_Jerry,18_King_St',
    type: 'ONU',
    installed: '2025-10-30 21:28:03',
    created: '10/20/2025',
    updated: '11/20/2025',
    status: 'Active',
    globalUniqueId: '4395a9da-adee-11f0-b4cb-52544d39564d',
    product: 'Kontron X24',
    firmwareVersion: '1.1.1',
    networkSwitch: 'English-OLT-02',
    switchPort: 'Port XGS/11/1',
    location: {
      houseNumber: '',
      preDirectional: '',
      street: '18 KING ST',
      postDirectional: '',
      apartmentNumber: '',
      city: 'Jamestown',
      state: 'New York',
      postalCode: '17401',
      country: 'United States',
      latitude: '42.091467',
      longitude: '-79.228877',
      elevation: '',
      uri: 'https://www.google.com/maps/place/42.0914665,-79.228877',
    },
    ports: [
      {
        name: '10GE',
        type: 'LAN',
        state: 'Enabled',
        speed: 'N/A',
        throughputOut: 'N/A',
        throughputIn: 'N/A',
      },
      {
        name: 'GE',
        type: 'LAN',
        state: 'Disabled',
        speed: 'N/A',
        throughputOut: 'N/A',
        throughputIn: 'N/A',
      },
      {
        name: 'WAN',
        type: 'WAN',
        state: 'Disabled',
        speed: 'N/A',
        throughputOut: 'N/A',
        throughputIn: 'N/A',
      },
    ],
    serviceProfiles: [
      { port: '10GE', service: '', plan: '', type: '', sTag: '', cTag: '' },
      { port: 'GE', service: '', plan: '', type: '', sTag: '', cTag: '' },
      { port: 'WAN', service: '', plan: '', type: '', sTag: '', cTag: '' },
    ],
    notes: '',
  },
  {
    id: '2',
    customId: 'ISKT23088B28',
    serial: 'ISKT23088B28',
    description: 'Kontron X24 ONU',
    type: 'ONU',
    installed: '',
    created: '09/15/2025',
    updated: '10/12/2025',
    status: 'Active',
    globalUniqueId: '5496b8eb-bdff-22g1-c5dc-63655e4a675e',
    product: 'Kontron X24',
    firmwareVersion: '1.1.1',
    networkSwitch: 'English-OLT-02',
    switchPort: 'Port XGS/11/2',
    location: {
      houseNumber: '',
      preDirectional: '',
      street: '22 MAPLE ST',
      postDirectional: '',
      apartmentNumber: '',
      city: 'Jamestown',
      state: 'New York',
      postalCode: '17401',
      country: 'United States',
      latitude: '42.095123',
      longitude: '-79.231456',
      elevation: '',
      uri: 'https://www.google.com/maps/place/42.095123,-79.231456',
    },
    ports: [
      {
        name: '10GE',
        type: 'LAN',
        state: 'Enabled',
        speed: 'N/A',
        throughputOut: 'N/A',
        throughputIn: 'N/A',
      },
      {
        name: 'GE',
        type: 'LAN',
        state: 'Disabled',
        speed: 'N/A',
        throughputOut: 'N/A',
        throughputIn: 'N/A',
      },
      {
        name: 'WAN',
        type: 'WAN',
        state: 'Disabled',
        speed: 'N/A',
        throughputOut: 'N/A',
        throughputIn: 'N/A',
      },
    ],
    serviceProfiles: [
      { port: '10GE', service: '', plan: '', type: '', sTag: '', cTag: '' },
      { port: 'GE', service: '', plan: '', type: '', sTag: '', cTag: '' },
      { port: 'WAN', service: '', plan: '', type: '', sTag: '', cTag: '' },
    ],
    notes: '',
  },
  {
    id: '3',
    customId: 'Steele-Do-Not-Remove',
    serial: 'ISKT2308C5E8',
    description: 'Kontron X24 ONU',
    type: 'ONU',
    installed: '',
    created: '08/10/2025',
    updated: '09/20/2025',
    status: 'Active',
    globalUniqueId: '6507c9fc-ceff-33h2-d6ed-74766f5b786f',
    product: 'Kontron X24',
    firmwareVersion: '1.1.1',
    networkSwitch: 'English-OLT-02',
    switchPort: 'Port XGS/11/3',
    location: {
      houseNumber: '',
      preDirectional: '',
      street: '45 ELM AVE',
      postDirectional: '',
      apartmentNumber: '',
      city: 'Jamestown',
      state: 'New York',
      postalCode: '17401',
      country: 'United States',
      latitude: '42.098765',
      longitude: '-79.234567',
      elevation: '',
      uri: 'https://www.google.com/maps/place/42.098765,-79.234567',
    },
    ports: [
      {
        name: '10GE',
        type: 'LAN',
        state: 'Enabled',
        speed: 'N/A',
        throughputOut: 'N/A',
        throughputIn: 'N/A',
      },
      {
        name: 'GE',
        type: 'LAN',
        state: 'Disabled',
        speed: 'N/A',
        throughputOut: 'N/A',
        throughputIn: 'N/A',
      },
      {
        name: 'WAN',
        type: 'WAN',
        state: 'Disabled',
        speed: 'N/A',
        throughputOut: 'N/A',
        throughputIn: 'N/A',
      },
    ],
    serviceProfiles: [
      { port: '10GE', service: '', plan: '', type: '', sTag: '', cTag: '' },
      { port: 'GE', service: '', plan: '', type: '', sTag: '', cTag: '' },
      { port: 'WAN', service: '', plan: '', type: '', sTag: '', cTag: '' },
    ],
    notes: '',
  },
];

type TabType = 'info' | 'details' | 'service-profiles' | 'location' | 'ports' | 'messages';

export function DevicesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsPerPage, setResultsPerPage] = useState('50');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredDevices = mockDevices.filter(
    (device) =>
      device.customId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEntries = filteredDevices.length;
  const startEntry = (currentPage - 1) * parseInt(resultsPerPage) + 1;
  const endEntry = Math.min(currentPage * parseInt(resultsPerPage), totalEntries);
  const totalPages = Math.ceil(totalEntries / parseInt(resultsPerPage));

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
    setActiveTab('info');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
    setActiveTab('info');
  };

  const handleMenuAction = (action: string, device: Device) => {
    setOpenMenuId(null);
    
    switch (action) {
      case 'edit':
        handleDeviceClick(device);
        setActiveTab('details');
        break;
      case 'installed':
        console.log('Mark as Installed:', device.customId);
        break;
      case 'uninstalled':
        console.log('Mark as Uninstalled:', device.customId);
        break;
      case 'message':
        handleDeviceClick(device);
        setActiveTab('messages');
        break;
      case 'reset':
        console.log('Reset:', device.customId);
        break;
      case 'disable':
        console.log('Disable:', device.customId);
        break;
    }
  };

  return (
    <div className="p-8 bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Devices</h1>
          <p className="text-[var(--muted-foreground)]">
            Manage network devices and configurations • Orangeburg Fiber
          </p>
        </div>
        <Button className="bg-[#147FFF] text-white hover:bg-[#147FFF]/90">
          Import Devices
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          />
        </div>
      </div>

      {/* Devices Table */}
      <Card className="bg-[var(--card)] border-[var(--border)] overflow-hidden">
        {/* Table Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <MoreVertical className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span className="text-sm font-medium text-[var(--muted-foreground)]">View</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--muted-foreground)]">Show</span>
            <Select value={resultsPerPage} onValueChange={setResultsPerPage}>
              <SelectTrigger className="w-20 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-[var(--muted-foreground)]">entries per page</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                <th className="text-left py-4 px-6 text-sm font-medium text-[var(--muted-foreground)]">
                  Custom ID
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-[var(--muted-foreground)]">Serial</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-[var(--muted-foreground)]">
                  Description
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-[var(--muted-foreground)]">Type</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-[var(--muted-foreground)]">
                  Installed
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-[var(--muted-foreground)]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => (
                <tr
                  key={device.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--muted)]/30 cursor-pointer"
                  onClick={() => handleDeviceClick(device)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#21DB00] rounded-full"></div>
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {device.customId}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[var(--muted-foreground)]">{device.serial}</td>
                  <td className="py-4 px-6 text-sm text-[var(--muted-foreground)]">{device.description}</td>
                  <td className="py-4 px-6 text-sm text-[var(--muted-foreground)]">{device.type}</td>
                  <td className="py-4 px-6 text-sm text-[var(--muted-foreground)]">
                    {device.installed || '-'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === device.id ? null : device.id);
                        }}
                        className="p-2 hover:bg-[var(--muted)] rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-[var(--muted-foreground)]" />
                      </button>
                      
                      {openMenuId === device.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-[var(--popover)] border border-[var(--border)] rounded-lg shadow-lg z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuAction('edit', device);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors first:rounded-t-lg"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuAction('installed', device);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                            >
                              Mark as Installed
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuAction('uninstalled', device);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                            >
                              Mark as Uninstalled
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuAction('message', device);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                            >
                              Send Message
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuAction('reset', device);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                            >
                              Reset
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuAction('disable', device);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors last:rounded-b-lg"
                            >
                              Disable
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Showing {startEntry}-{endEntry} of {totalEntries}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded text-sm transition-colors ${
                    currentPage === page
                      ? 'bg-white text-[#020817] font-medium'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {page}
                </button>
              ))}</div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Device Management Modal */}
      {selectedDevice && (
        <DeviceManagementModal
          device={selectedDevice}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}

// Device Management Modal Component
interface DeviceManagementModalProps {
  device: Device;
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

function DeviceManagementModal({
  device,
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}: DeviceManagementModalProps) {
  const [formData, setFormData] = useState(device);

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving device data:', formData);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose} title={`Manage ${device.customId}`} maxWidth="3xl">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-[var(--border)] mb-6 sticky top-0 bg-[var(--background)] z-10 pb-3 -mx-1 px-1">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'info'
              ? 'text-[var(--primary)] border-[var(--primary)]'
              : 'text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]'
          }`}
        >
          Info
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'details'
              ? 'text-[var(--primary)] border-[var(--primary)]'
              : 'text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('service-profiles')}
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'service-profiles'
              ? 'text-[var(--primary)] border-[var(--primary)]'
              : 'text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]'
          }`}
        >
          Service Profiles
        </button>
        <button
          onClick={() => setActiveTab('location')}
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'location'
              ? 'text-[var(--primary)] border-[var(--primary)]'
              : 'text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]'
          }`}
        >
          Location
        </button>
        <button
          onClick={() => setActiveTab('ports')}
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'ports'
              ? 'text-[var(--primary)] border-[var(--primary)]'
              : 'text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]'
          }`}
        >
          Ports
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'messages'
              ? 'text-[var(--primary)] border-[var(--primary)]'
              : 'text-[var(--muted-foreground)] border-transparent hover:text-[var(--foreground)]'
          }`}
        >
          Messages
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && <InfoTab device={device} />}
      {activeTab === 'details' && (
        <DetailsTab device={formData} setDevice={setFormData} onSave={handleSave} onCancel={onClose} />
      )}
      {activeTab === 'service-profiles' && <ServiceProfilesTab device={device} onClose={onClose} />}
      {activeTab === 'location' && (
        <LocationTab device={formData} setDevice={setFormData} onSave={handleSave} onCancel={onClose} />
      )}
      {activeTab === 'ports' && <PortsTab device={device} />}
      {activeTab === 'messages' && <MessagesTab />}
    </Modal>
  );
}

// Info Tab
function InfoTab({ device }: { device: Device }) {
  return (
    <div className="space-y-6">
      {/* Note Banner with Action Buttons */}
      <div className="bg-[var(--muted)]/30 border border-[var(--border)] rounded-lg p-4 flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--foreground)]">Note:</span> This feature syncs device
          info. To sync flows, please visit the Flows tab.
        </p>
        <div className="flex gap-3 shrink-0">
          <Button
            variant="outline"
            className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>
          <Button
            variant="outline"
            className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            <RotateCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Device Info Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="text-sm text-[var(--muted-foreground)]">Installed</Label>
          <p className="text-sm font-medium text-[var(--foreground)] mt-1">{device.installed}</p>
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)]">Serial Number</Label>
          <p className="text-sm font-medium text-[var(--foreground)] mt-1">{device.serial}</p>
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)]">Custom ID</Label>
          <p className="text-sm font-medium text-[var(--foreground)] mt-1">{device.customId}</p>
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)]">Network Switch</Label>
          <div className="flex items-center gap-2 mt-1">
            <button className="text-sm font-medium text-[var(--primary)] hover:underline">
              {device.networkSwitch}
            </button>
          </div>
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)]">Switch Port</Label>
          <div className="flex items-center gap-2 mt-1">
            <button className="text-sm font-medium text-[var(--primary)] hover:underline">
              {device.switchPort}
            </button>
          </div>
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)]">Location</Label>
          <p className="text-sm font-medium text-[var(--foreground)] mt-1">
            {device.location.street} {device.location.city}, {device.location.state}{' '}
            {device.location.postalCode}
          </p>
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)]">Firmware Version</Label>
          <p className="text-sm font-medium text-[var(--foreground)] mt-1">{device.firmwareVersion}</p>
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)]">Status</Label>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-[#21DB00] rounded-full"></div>
            <p className="text-sm font-medium text-[var(--foreground)]">{device.status}</p>
          </div>
        </div>
      </div>

      {/* Device Visual */}
      <div className="mt-8 flex justify-center">
        <div className="relative bg-[var(--muted)] border-2 border-[var(--border)] rounded-lg p-6 w-full max-w-2xl">
          <div className="absolute top-2 right-2 px-3 py-1 bg-[#DC2626] text-white text-xs font-medium rounded">
            Offline
          </div>
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-xs text-[var(--muted-foreground)] mb-2">ON/OFF</p>
              <div className="w-12 h-12 bg-[var(--muted-foreground)] rounded-full border-4 border-[var(--border)]"></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--muted-foreground)] mb-2">Power</p>
              <div className="w-12 h-12 bg-[var(--muted)] rounded-full border-4 border-[var(--border)]"></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--muted-foreground)] mb-2">Rst</p>
              <div className="w-8 h-8 bg-[var(--muted-foreground)] rounded-full border-2 border-[var(--border)]"></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--muted-foreground)] mb-2">10GE</p>
              <div className="w-16 h-16 bg-[var(--primary)] rounded border-4 border-[var(--primary-hover)]"></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--muted-foreground)] mb-2">GE</p>
              <div className="w-16 h-16 bg-[#FFC107] rounded border-4 border-[#FF9800]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end pt-4 border-t border-[var(--border)]">
        <Button
          variant="outline"
          className="bg-[var(--muted-foreground)] border-[var(--muted-foreground)] text-white hover:bg-[var(--muted)]"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

// Details Tab
interface DetailsTabProps {
  device: Device;
  setDevice: (device: Device) => void;
  onSave: () => void;
  onCancel: () => void;
}

function DetailsTab({ device, setDevice, onSave, onCancel }: DetailsTabProps) {
  return (
    <div className="space-y-6">
      {/* Three Column Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">CREATED:</Label>
          <Input
            value={device.created}
            onChange={(e) => setDevice({ ...device, created: e.target.value })}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">UPDATED:</Label>
          <Input
            value={device.updated}
            onChange={(e) => setDevice({ ...device, updated: e.target.value })}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">INSTALLED:</Label>
          <Input
            value={device.installed}
            onChange={(e) => setDevice({ ...device, installed: e.target.value })}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">CUSTOM ID:</Label>
          <Input
            value={device.customId}
            onChange={(e) => setDevice({ ...device, customId: e.target.value })}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">STATUS:</Label>
          <Select value={device.status} onValueChange={(value) => setDevice({ ...device, status: value })}>
            <SelectTrigger className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">GLOBAL UNIQUE ID:</Label>
          <Input
            value={device.globalUniqueId}
            onChange={(e) => setDevice({ ...device, globalUniqueId: e.target.value })}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">SERIAL NUMBER</Label>
          <Input
            value={device.serial}
            onChange={(e) => setDevice({ ...device, serial: e.target.value })}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">TYPE:</Label>
          <Input
            value={device.type}
            onChange={(e) => setDevice({ ...device, type: e.target.value })}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">PRODUCT:</Label>
          <Input
            value={device.product}
            onChange={(e) => setDevice({ ...device, product: e.target.value })}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Fourth Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">FIRMWARE VERSION:</Label>
          <Input
            value={device.firmwareVersion}
            onChange={(e) => setDevice({ ...device, firmwareVersion: e.target.value })}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">NETWORK SWITCH:</Label>
          <div className="flex items-center gap-2">
            <Input
              value={device.networkSwitch}
              onChange={(e) => setDevice({ ...device, networkSwitch: e.target.value })}
              className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
            />
            <button className="p-2 bg-[var(--primary)] rounded hover:bg-[var(--primary-hover)]">
              <MoreVertical className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">SWITCH PORT</Label>
          <Input
            value={device.switchPort}
            onChange={(e) => setDevice({ ...device, switchPort: e.target.value })}
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">DESCRIPTION:</Label>
        <Textarea
          value={device.description}
          onChange={(e) => setDevice({ ...device, description: e.target.value })}
          className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] min-h-[100px]"
        />
      </div>

      {/* Notes */}
      <div>
        <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">NOTES:</Label>
        <Textarea
          value={device.notes}
          onChange={(e) => setDevice({ ...device, notes: e.target.value })}
          className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] min-h-[100px]"
          placeholder="Add notes here..."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button
          onClick={onCancel}
          variant="outline"
          className="bg-[var(--muted-foreground)] border-[var(--muted-foreground)] text-white hover:bg-[var(--muted)]"
        >
          Cancel
        </Button>
        <Button onClick={onSave} className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
          Save
        </Button>
      </div>
    </div>
  );
}

// Service Profiles Tab
function ServiceProfilesTab({ device, onClose }: { device: Device; onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Port</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Service</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Plan</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">S Tag</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">C Tag</th>
            </tr>
          </thead>
          <tbody>
            {device.serviceProfiles.map((profile, index) => (
              <tr key={index} className="border-b border-[var(--border)]">
                <td className="py-3 px-4 text-sm text-[var(--foreground)]">{profile.port}</td>
                <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">{profile.service || '-'}</td>
                <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">{profile.plan || '-'}</td>
                <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">{profile.type || '-'}</td>
                <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">{profile.sTag || '-'}</td>
                <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">{profile.cTag || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4 border-t border-[var(--border)]">
        <Button
          onClick={onClose}
          variant="outline"
          className="bg-[var(--muted-foreground)] border-[var(--muted-foreground)] text-white hover:bg-[var(--muted)]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Location Tab
interface LocationTabProps {
  device: Device;
  setDevice: (device: Device) => void;
  onSave: () => void;
  onCancel: () => void;
}

function LocationTab({ device, setDevice, onSave, onCancel }: LocationTabProps) {
  return (
    <div className="space-y-6">
      {/* First Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">HOUSE #</Label>
          <Input
            value={device.location.houseNumber}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, houseNumber: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">PRE DIRECTIONAL</Label>
          <Input
            value={device.location.preDirectional}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, preDirectional: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">STREET</Label>
          <Input
            value={device.location.street}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, street: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">POST DIRECTIONAL</Label>
          <Input
            value={device.location.postDirectional}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, postDirectional: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">APARTMENT #</Label>
          <Input
            value={device.location.apartmentNumber}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, apartmentNumber: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">CITY</Label>
          <Input
            value={device.location.city}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, city: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">STATE</Label>
          <Select
            value={device.location.state}
            onValueChange={(value) =>
              setDevice({
                ...device,
                location: { ...device.location, state: value },
              })
            }
          >
            <SelectTrigger className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="California">California</SelectItem>
              <SelectItem value="Texas">Texas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">POSTAL CODE</Label>
          <Input
            value={device.location.postalCode}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, postalCode: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Country */}
      <div>
        <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">COUNTRY</Label>
        <Select
          value={device.location.country}
          onValueChange={(value) =>
            setDevice({
              ...device,
              location: { ...device.location, country: value },
            })
          }
        >
          <SelectTrigger className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Mexico">Mexico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">LATITUDE</Label>
          <Input
            value={device.location.latitude}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, latitude: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">LONGITUDE</Label>
          <Input
            value={device.location.longitude}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, longitude: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Elevation and URI */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">ELEVATION</Label>
          <Input
            value={device.location.elevation}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, elevation: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <Label className="text-sm text-[var(--muted-foreground)] mb-2 block">URI</Label>
          <Input
            value={device.location.uri}
            onChange={(e) =>
              setDevice({
                ...device,
                location: { ...device.location, uri: e.target.value },
              })
            }
            className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button
          onClick={onCancel}
          variant="outline"
          className="bg-[var(--muted-foreground)] border-[var(--muted-foreground)] text-white hover:bg-[var(--muted)]"
        >
          Cancel
        </Button>
        <Button onClick={onSave} className="bg-[#21DB00] text-white hover:bg-[#1AC700] border-[#21DB00]">
          Save
        </Button>
      </div>
    </div>
  );
}

// Ports Tab
function PortsTab({ device }: { device: Device }) {
  const [ports, setPorts] = useState(device.ports);

  const togglePortState = (index: number) => {
    const newPorts = [...ports];
    newPorts[index].state = newPorts[index].state === 'Enabled' ? 'Disabled' : 'Enabled';
    setPorts(newPorts);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">State</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Speed</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">
                Throughput (Out/In)
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Action</th>
            </tr>
          </thead>
          <tbody>
            {ports.map((port, index) => (
              <tr key={index} className="border-b border-[var(--border)]">
                <td className="py-3 px-4 text-sm font-medium text-[var(--foreground)]">{port.name}</td>
                <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">{port.type}</td>
                <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">{port.state}</td>
                <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">{port.speed}</td>
                <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">{port.throughputOut}/{port.throughputIn}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-[#9333EA] rounded hover:bg-[#7C2CC9]">
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                    <Switch
                      checked={port.state === 'Enabled'}
                      onCheckedChange={() => togglePortState(index)}
                      className="data-[state=checked]:bg-[#21DB00]"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4 border-t border-[var(--border)]">
        <Button
          variant="outline"
          className="bg-[var(--muted-foreground)] border-[var(--muted-foreground)] text-white hover:bg-[var(--muted)]"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

// Messages Tab
function MessagesTab() {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Subtype</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Message</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Level</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[var(--muted-foreground)]">Sent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                No records found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4 border-t border-[var(--border)]">
        <Button
          variant="outline"
          className="bg-[var(--muted-foreground)] border-[var(--muted-foreground)] text-white hover:bg-[var(--muted)]"
        >
          Close
        </Button>
      </div>
    </div>
  );
}