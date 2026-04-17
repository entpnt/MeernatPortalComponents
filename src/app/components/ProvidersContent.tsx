import { useState } from 'react';
import { Search, X, MoreVertical, Eye, Copy, MessageSquare, Trash2, Info } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Modal } from '@/app/components/ui/modal';
import { TabMenu } from '@/app/components/ui/tab-menu';
import { ViewButton } from '@/app/components/ui/view-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

interface Provider {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  hasPortal: boolean;
  createdAt: string;
  updatedAt: string;
  type: string;
  autoApprove: string;
  description: string;
  image?: string;
}

const mockProviders: Provider[] = [
  {
    id: 'be20ae4e-7736-11ed-8d27-514a5a314e5a',
    name: 'Fiberspark',
    status: 'ACTIVE',
    hasPortal: true,
    createdAt: '2025-09-25 23:17:03',
    updatedAt: '2026-01-23 09:52:10',
    type: 'Service',
    autoApprove: 'Service, Serviceplan',
    description: 'Fiberspark is a new Internet Service Provider bringing fiber optic connectivity to off campus student housing in the Northeastern U.S. Fiberspark\'s mission is to provide a better alternative than the cable monopoly for Internet service and our fiber infrastructure enables order of magnitude faster download/upload speeds. The incumbent providers employ copper networks built specifically for telephone and television systems, which are unable to adequately handle modern connectivity needs. We strive to provide connectivity that never slows down or crashes.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=200&fit=crop',
  },
  {
    id: '8f9a1b2c-3d4e-5f6a-7b8c-9d0e1f2a3b4c',
    name: 'Sumo Fiber',
    status: 'ACTIVE',
    hasPortal: true,
    createdAt: '2025-08-15 14:22:11',
    updatedAt: '2026-01-20 10:15:30',
    type: 'Service',
    autoApprove: 'Service',
    description: 'Sumo Fiber provides high-speed fiber optic internet services to residential and commercial customers.',
  },
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    name: 'Test Provider',
    status: 'ACTIVE',
    hasPortal: false,
    createdAt: '2025-10-01 08:30:45',
    updatedAt: '2026-01-15 16:45:20',
    type: 'Service',
    autoApprove: 'None',
    description: 'Test provider for internal testing and development purposes.',
  },
];

const mockWebhooks = [
  {
    provider: 'Fiberspark',
    service: 'Fiberspark Jamestown',
    method: 'POST',
    type: 'UNSUBSCRIBE',
    created: '2025-11-26 12:15:10',
  },
  {
    provider: 'Fiberspark',
    service: 'Fiberspark Jamestown',
    method: 'POST',
    type: 'SUBSCRIBE',
    created: '2025-11-26 12:15:01',
  },
  {
    provider: 'Fiberspark',
    service: 'Fiberspark Jamestown',
    method: 'POST',
    type: 'PLAN_CHANGE',
    created: '2025-11-26 11:31:50',
  },
  {
    provider: 'Fiberspark',
    service: 'Fiberspark Jamestown',
    method: 'POST',
    type: 'PRE_SUBSCRIBE',
    created: '2025-12-30 10:24:31',
  },
];

const mockServices = {
  available: [
    {
      name: 'Fiberspark Sherburne 2',
      displayType: 'PRIVATE',
      accountTypes: 'COMMERCIAL, DEMO, RESIDENTIAL, RESIDENTIAL MULTI',
    },
    {
      name: 'Fiberspark Sherburne',
      displayType: 'PUBLIC',
      accountTypes: 'COMMERCIAL, DEMO, RESIDENTIAL, RESIDENTIAL MULTI',
    },
  ],
  active: [
    {
      name: 'Fiberspark Jamestown',
      serviceType: 'Internet Service',
      displayType: 'PUBLIC',
      accountTypes: 'COMMERCIAL, DEMO, RESIDENTIAL, RESIDENTIAL MULTI',
      pendingApprovals: 'None',
    },
  ],
};

const mockPlans = {
  active: [
    { name: 'Fiberspark 1 GIG', service: 'Fiberspark Jamestown', serviceType: 'Internet Service', pendingApprovals: 'None' },
    { name: 'Fiberspark Standard', service: 'Fiberspark Jamestown', serviceType: 'Internet Service', pendingApprovals: 'None' },
    { name: 'Fiberspark 2 GIG', service: 'Fiberspark Jamestown', serviceType: 'Internet Service', pendingApprovals: 'None' },
    { name: 'Fiberspark Economy', service: 'Fiberspark Jamestown', serviceType: 'Internet Service', pendingApprovals: 'None' },
  ],
};

export function ProvidersContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const filteredProviders = mockProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (provider: Provider) => {
    setSelectedProvider(provider);
    setActiveTab('details');
    setModalOpen(true);
  };

  const handleCopyId = (provider: Provider) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(provider.id).then(() => {
          alert(`Copied ID for ${provider.name}`);
        }).catch(() => {
          // Fallback to traditional method
          fallbackCopyTextToClipboard(provider.id, provider.name);
        });
      } else {
        // Use fallback method
        fallbackCopyTextToClipboard(provider.id, provider.name);
      }
    } catch (err) {
      // Use fallback method
      fallbackCopyTextToClipboard(provider.id, provider.name);
    }
  };

  const fallbackCopyTextToClipboard = (text: string, providerName: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert(`Copied ID for ${providerName}`);
      } else {
        alert('Failed to copy ID');
      }
    } catch (err) {
      alert('Failed to copy ID');
    }
    document.body.removeChild(textArea);
  };

  const handleMessage = (provider: Provider) => {
    // Navigate to messaging or open message modal
    alert(`Message ${provider.name}`);
  };

  const handleDelete = (provider: Provider) => {
    if (confirm(`Are you sure you want to delete ${provider.name}?`)) {
      // Handle delete logic
      alert(`Delete ${provider.name}`);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">Providers</h1>
          <p className="text-[#94A3B8]">Manage service providers and integrations</p>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-[#94A3B8] hover:text-[#F8FAFC]" />
              </button>
            )}
          </div>
          <Button variant="outline">
            Create Provider
          </Button>
          <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white">
            Load Provider
          </Button>
        </div>

        {/* Providers Table */}
        <Card className="bg-card border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Provider Status</TableHead>
                <TableHead className="text-muted-foreground">Has Provider Portal</TableHead>
                <TableHead className="text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map((provider) => (
                <TableRow key={provider.id} className="border-border hover:bg-muted/50">
                  <TableCell className="text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--success)]"></div>
                      {provider.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{provider.status}</TableCell>
                  <TableCell className="text-foreground">{provider.hasPortal ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded hover:bg-secondary transition-colors">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                        <DropdownMenuItem
                          onClick={() => {
                            handleViewDetails(provider);
                          }}
                          className="hover:bg-secondary cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCopyId(provider)}
                          className="hover:bg-secondary cursor-pointer"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy ID of {provider.name}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleMessage(provider)}
                          className="hover:bg-secondary cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message {provider.name}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(provider)}
                          className="hover:bg-secondary cursor-pointer text-[var(--error)]"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete {provider.name}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Results Count */}
        <div className="mt-4 text-sm text-[#94A3B8]">
          Showing {filteredProviders.length} of {mockProviders.length} entries
        </div>

        {/* Provider Details Modal */}
        {selectedProvider && (
          <Modal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title={`Manage ${selectedProvider.name}`}
            maxWidth="5xl"
            titleAction={
              selectedProvider.hasPortal ? (
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1E293B] border border-[#1E293B] rounded-lg text-sm text-[#94A3B8] hover:bg-[#2D3F5E] transition-colors">
                      <span className="font-semibold">Provider has Portal</span>
                      <Info className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    align="end"
                    className="max-w-xs bg-[#1E293B] border border-[#334155] text-[#CBD5E1] p-3 shadow-lg"
                    sideOffset={8}
                  >
                    Because the provider has their own portal, some functionality is not available in this portal. Other functionality requires provider approval before changes take effect.
                  </TooltipContent>
                </Tooltip>
              ) : undefined
            }
          >
            {/* Tabs */}
            <TabMenu
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={[
                { id: 'details', label: 'Details' },
                { id: 'contacts', label: 'Contacts' },
                { id: 'services', label: 'Services' },
                { id: 'plans', label: 'Plans' },
                { id: 'webhooks', label: 'Webhooks' },
              ]}
            />

            {/* Tab Content */}
            <div className="mt-6 overflow-x-auto -mx-6 px-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">
                        CREATED: {selectedProvider.createdAt}
                      </h3>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">
                        UPDATED: {selectedProvider.updatedAt}
                      </h3>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
                        Name
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedProvider.name}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-[#147FFF]"
                      />
                    </div>

                    {/* ID */}
                    <div>
                      <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
                        ID
                      </label>
                      <input
                        type="text"
                        value={selectedProvider.id}
                        readOnly
                        className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#94A3B8] text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {/* Status */}
                    <div>
                      <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
                        Status
                      </label>
                      <select
                        defaultValue={selectedProvider.status}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-[#147FFF]"
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
                        Type
                      </label>
                      <select
                        defaultValue={selectedProvider.type}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-[#147FFF]"
                      >
                        <option>Service</option>
                        <option>Network</option>
                      </select>
                    </div>

                    {/* Auto Approve */}
                    <div>
                      <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
                        Auto Approve
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedProvider.autoApprove}
                        className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-[#147FFF]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
                      Description
                    </label>
                    <textarea
                      defaultValue={selectedProvider.description}
                      rows={5}
                      className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-[#147FFF] resize-none"
                    />
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
                      Image
                    </label>
                    <div className="flex items-center gap-4">
                      <Button className="bg-[#64748B] hover:bg-[#475569] text-white">
                        Choose File
                      </Button>
                      <span className="text-sm text-[#94A3B8]">No file chosen</span>
                      <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white">
                        Upload
                      </Button>
                      <Button className="bg-[#E60000] hover:bg-[#CC0000] text-white">
                        Delete Image
                      </Button>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-2">
                      Image dimensions should be 254 x 111
                    </p>
                    {selectedProvider.image && (
                      <div className="mt-4">
                        <img
                          src={selectedProvider.image}
                          alt={selectedProvider.name}
                          className="h-20 rounded border border-[#1E293B]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white px-8">
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div>
                  <Card className="bg-card border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground">Name</TableHead>
                          <TableHead className="text-muted-foreground">Address</TableHead>
                          <TableHead className="text-muted-foreground">Type</TableHead>
                          <TableHead className="text-muted-foreground text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-border">
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No Records Found
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Card>
                  <div className="mt-4 flex justify-start">
                    <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white">
                      Add
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-8 -mx-6">
                  {/* Services Available */}
                  <div className="px-6">
                    <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Services Available</h3>
                  </div>
                  <div className="overflow-x-auto px-6">
                    <Card className="bg-card border-border min-w-max">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground whitespace-nowrap">Name</TableHead>
                            <TableHead className="text-muted-foreground whitespace-nowrap">Display Type</TableHead>
                            <TableHead className="text-muted-foreground whitespace-nowrap">Account Types</TableHead>
                            <TableHead className="text-muted-foreground text-right whitespace-nowrap">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockServices.available.map((service, idx) => (
                            <TableRow key={idx} className="border-border hover:bg-muted">
                              <TableCell className="text-foreground whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-[#21DB00]"></div>
                                  {service.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-foreground whitespace-nowrap">{service.displayType}</TableCell>
                              <TableCell className="text-foreground whitespace-nowrap">{service.accountTypes}</TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                <ViewButton onClick={() => alert('View service details')} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>

                  {/* Active Services */}
                  <div className="px-6">
                    <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Active Services</h3>
                  </div>
                  <div className="overflow-x-auto px-6">
                    <Card className="bg-card border-border min-w-max">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground whitespace-nowrap">Name</TableHead>
                            <TableHead className="text-muted-foreground whitespace-nowrap">Service Type</TableHead>
                            <TableHead className="text-muted-foreground whitespace-nowrap">Display Type</TableHead>
                            <TableHead className="text-muted-foreground whitespace-nowrap">Account Types</TableHead>
                            <TableHead className="text-muted-foreground whitespace-nowrap">Pending Approvals</TableHead>
                            <TableHead className="text-muted-foreground text-right whitespace-nowrap">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockServices.active.map((service, idx) => (
                            <TableRow key={idx} className="border-border hover:bg-muted">
                              <TableCell className="text-foreground whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-[#21DB00]"></div>
                                  {service.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-foreground whitespace-nowrap">{service.serviceType}</TableCell>
                              <TableCell className="text-foreground whitespace-nowrap">{service.displayType}</TableCell>
                              <TableCell className="text-foreground whitespace-nowrap">{service.accountTypes}</TableCell>
                              <TableCell className="text-foreground whitespace-nowrap">{service.pendingApprovals}</TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                <div className="flex gap-2 justify-end">
                                  <ViewButton onClick={() => alert('View service details')} />
                                  <Tooltip delayDuration={200}>
                                    <TooltipTrigger asChild>
                                      <button className="p-2 rounded bg-[#147FFF] hover:bg-[#1068CC] transition-colors">
                                        <Copy className="w-4 h-4 text-white" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent 
                                      side="bottom"
                                      className="bg-[#1E293B] border border-[#334155] text-[#CBD5E1] shadow-lg"
                                    >
                                      Copy ID of {selectedProvider.name} to {service.name}
                                    </TooltipContent>
                                  </Tooltip>
                                  <button className="p-2 rounded bg-[#E60000] hover:bg-[#CC0000] transition-colors">
                                    <X className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'plans' && (
                <div className="space-y-8">
                  {/* Available Plans */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Available Plans</h3>
                    <Card className="bg-card border-border">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground">Name</TableHead>
                            <TableHead className="text-muted-foreground">Service</TableHead>
                            <TableHead className="text-muted-foreground">Service Type</TableHead>
                            <TableHead className="text-muted-foreground">Pending Approvals</TableHead>
                            <TableHead className="text-muted-foreground text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="border-border">
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                              No records found
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Card>
                  </div>

                  {/* Active Plans */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Active Plans</h3>
                    <Card className="bg-card border-border">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground">Name</TableHead>
                            <TableHead className="text-muted-foreground">Service</TableHead>
                            <TableHead className="text-muted-foreground">Service Type</TableHead>
                            <TableHead className="text-muted-foreground">Pending Approvals</TableHead>
                            <TableHead className="text-muted-foreground text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPlans.active.map((plan, idx) => (
                            <TableRow key={idx} className="border-border hover:bg-muted">
                              <TableCell className="text-foreground">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-[#21DB00]"></div>
                                  {plan.name}
                                </div>
                              </TableCell>
                              <TableCell className="text-foreground">{plan.service}</TableCell>
                              <TableCell className="text-foreground">{plan.serviceType}</TableCell>
                              <TableCell className="text-foreground">{plan.pendingApprovals}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <ViewButton onClick={() => alert('View plan details')} />
                                  <button className="p-2 rounded bg-[#147FFF] hover:bg-[#1068CC] transition-colors">
                                    <Copy className="w-4 h-4 text-white" />
                                  </button>
                                  <button className="p-2 rounded bg-[#E60000] hover:bg-[#CC0000] transition-colors">
                                    <X className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'webhooks' && (
                <div>
                  <Card className="bg-card border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground">Provider &gt; Service &gt; Plan</TableHead>
                          <TableHead className="text-muted-foreground">Method</TableHead>
                          <TableHead className="text-muted-foreground">Type</TableHead>
                          <TableHead className="text-muted-foreground">Created</TableHead>
                          <TableHead className="text-muted-foreground text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockWebhooks.map((webhook, idx) => (
                          <TableRow key={idx} className="border-border hover:bg-muted">
                            <TableCell className="text-foreground">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#21DB00]"></div>
                                {webhook.provider} &gt; {webhook.service}
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground">{webhook.method}</TableCell>
                            <TableCell className="text-foreground">{webhook.type}</TableCell>
                            <TableCell className="text-foreground">{webhook.created}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <ViewButton onClick={() => alert('View webhook details')} />
                                <button className="p-2 rounded bg-[#147FFF] hover:bg-[#1068CC] transition-colors">
                                  <Copy className="w-4 h-4 text-white" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}