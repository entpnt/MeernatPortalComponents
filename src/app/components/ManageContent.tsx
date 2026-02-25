import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Search, HelpCircle, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { TabMenu } from '@/app/components/ui/tab-menu';

interface ManageContentProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export function ManageContent({ activeSection, onNavigate }: ManageContentProps) {
  const getPageTitle = () => {
    switch (activeSection) {
      case 'device-import-config':
        return 'Device Import Configuration';
      case 'enabled-features':
        return 'Enabled Features';
      case 'external-configuration':
        return 'External Configuration';
      case 'manufacturer':
        return 'Manufacturer';
      case 'locations':
        return 'Locations';
      case 'network':
        return 'Network';
      case 'sdn':
        return 'SDN';
      case 'service-types':
        return 'Service Types';
      default:
        return 'Manage';
    }
  };

  const getPageDescription = () => {
    switch (activeSection) {
      case 'device-import-config':
        return 'Configure device import settings and parameters';
      case 'enabled-features':
        return 'Manage enabled features for the system';
      case 'external-configuration':
        return 'External system configuration settings';
      case 'manufacturer':
        return 'Manage manufacturer information';
      case 'locations':
        return 'Configure location settings';
      case 'network':
        return 'Network configuration and settings';
      case 'sdn':
        return 'Software-defined networking configuration';
      case 'service-types':
        return 'Manage service type definitions';
      default:
        return 'Device management and configuration settings';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'device-import-config':
        return <DeviceImportConfiguration />;
      case 'external-configuration':
        return <ExternalConfiguration />;
      case 'network':
        return <NetworkPage />;
      case 'sdn':
        return <SDNPage />;
      case 'enabled-features':
        return <EnabledFeaturesPage />;
      case 'locations':
        return <LocationsPage />;
      case 'manufacturer':
        return <ManufacturerPage />;
      case 'service-types':
        return <ServiceTypesPage />;
      default:
        return (
          <div className="p-8">
            <p className="text-sm text-[#94A3B8]">Content for {getPageTitle()}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="p-8 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{getPageTitle()}</h1>
            <p className="text-muted-foreground">{getPageDescription()}</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        {renderContent()}
      </div>
    </div>
  );
}

function DeviceImportConfiguration() {
  const [configTab, setConfigTab] = useState('vbg');

  return (
    <div className="px-8 pb-8">
      {/* Tabs */}
      <TabMenu
        activeTab={configTab}
        onTabChange={setConfigTab}
        tabs={[
          { id: 'vbg', label: 'VBG' },
          { id: 'network-switch', label: 'Network Switch' },
          { id: 'product', label: 'Product' },
        ]}
      />

      {/* VBG Tab Content */}
      {configTab === 'vbg' && <ConfigurationForm />}

      {/* Network Switch Tab Content */}
      {configTab === 'network-switch' && (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-[var(--focus)] animate-spin" />
        </div>
      )}

      {/* Product Tab Content */}
      {configTab === 'product' && (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-[var(--focus)] animate-spin" />
        </div>
      )}
    </div>
  );
}

function ConfigurationForm() {
  return (
    <>
      {/* Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 - Toggles and Basic Settings */}
        <div className="space-y-6">
          {/* Apply Defaults */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Apply Defaults
            </label>
            <div className="flex items-center gap-3">
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--success)]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
              <span className="text-sm font-medium text-[var(--success)]">YES</span>
            </div>
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Manufacturer
            </label>
            <div className="relative">
              <input
                type="text"
                value="Virtual Gateway Labs Inc"
                className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
                readOnly
              />
            </div>
          </div>

          {/* SNMP Server */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              SNMP Server
            </label>
            <input
              type="text"
              defaultValue="100.0.0.2"
              className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
            />
          </div>
        </div>

        {/* Column 2 - Install Settings */}
        <div className="space-y-6">
          {/* Install Bootstrap Flows */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Install Bootstrap Flows
            </label>
            <div className="flex items-center gap-3">
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--success)]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
              <span className="text-sm font-medium text-[var(--success)]">YES</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Product
            </label>
            <div className="relative">
              <input
                type="text"
                value="VGL MB105"
                className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
                readOnly
              />
            </div>
          </div>

          {/* Sync UOS_Hostname */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Sync UOS_Hostname
            </label>
            <div className="flex items-center gap-3">
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--success)]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </button>
              <span className="text-sm font-medium text-[var(--success)]">YES</span>
            </div>
          </div>
        </div>

        {/* Column 3 - Device Manager and Server */}
        <div className="space-y-6">
          {/* Install Device Manager */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Install Device_Manager
            </label>
            <div className="flex items-center gap-3">
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#E60000]">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
              </button>
              <span className="text-sm font-medium text-[#E60000]">NO</span>
            </div>
          </div>

          {/* SDN Server */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              SDN Server
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Select SDN Server"
                className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Settings Section */}
      <div className="mt-8 pt-8 border-t border-[#1E293B]">
        <h3 className="text-lg font-semibold text-[#F8FAFC] mb-6">Additional Settings</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Password
            </label>
            <input
              type="password"
              defaultValue="admin"
              className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
            />
          </div>

          {/* Reset Delay */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Reset Delay
            </label>
            <input
              type="number"
              defaultValue="5"
              className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Username
            </label>
            <input
              type="text"
              defaultValue="admin"
              className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              State
            </label>
            <select
              className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
              defaultValue="New York"
            >
              <option>New York</option>
              <option>California</option>
              <option>Texas</option>
            </select>
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Postal Code
            </label>
            <input
              type="text"
              defaultValue="17401"
              className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-2 uppercase">
              Country
            </label>
            <select
              className="w-full px-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
              defaultValue="United States"
            >
              <option>United States</option>
              <option>Canada</option>
              <option>Mexico</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white px-8">
          Save Configuration
        </Button>
      </div>
    </>
  );
}

function ExternalConfiguration() {
  const [activeTab, setActiveTab] = useState('dns');
  const [dnsTab, setDnsTab] = useState('compliance');

  return (
    <div className="px-8 pb-8">
      {/* Top Level Tabs */}
      <TabMenu
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'dns', label: 'DNS' },
          { id: 'ldap', label: 'LDAP' },
          { id: 'ntp', label: 'NTP' },
          { id: 'radius', label: 'RADIUS' },
          { id: 'redis', label: 'REDIS' },
        ]}
      />

      {/* DNS Tab Content */}
      {activeTab === 'dns' && (
        <div>
          <h2 className="text-lg font-semibold text-[#F8FAFC] mb-4">DNS Configurations</h2>
          
          {/* DNS Sub-tabs */}
          <TabMenu
            activeTab={dnsTab}
            onTabChange={setDnsTab}
            tabs={[
              { id: 'compliance', label: 'Compliance DNS' },
              { id: 'walled-garden', label: 'Walled Garden DNS' },
            ]}
          />

          {dnsTab === 'compliance' && (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 text-[#147FFF] animate-spin" />
            </div>
          )}

          {dnsTab === 'walled-garden' && (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 text-[#147FFF] animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* LDAP Tab Content */}
      {activeTab === 'ldap' && (
        <div className="flex items-center justify-center py-32">
          <p className="text-[#94A3B8]">LDAP configuration content</p>
        </div>
      )}

      {/* NTP Tab Content */}
      {activeTab === 'ntp' && (
        <div className="flex items-center justify-center py-32">
          <p className="text-[#94A3B8]">NTP configuration content</p>
        </div>
      )}

      {/* RADIUS Tab Content */}
      {activeTab === 'radius' && (
        <div className="flex items-center justify-center py-32">
          <p className="text-[#94A3B8]">RADIUS configuration content</p>
        </div>
      )}

      {/* REDIS Tab Content */}
      {activeTab === 'redis' && (
        <div className="flex items-center justify-center py-32">
          <p className="text-[#94A3B8]">REDIS configuration content</p>
        </div>
      )}
    </div>
  );
}

function NetworkPage() {
  const [activeTab, setActiveTab] = useState('switches');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="px-8 pb-8">
      {/* Tabs */}
      <TabMenu
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'switches', label: 'Network Switches' },
          { id: 'system-rules', label: 'System Rules' },
        ]}
      />

      {/* Switches Tab */}
      {activeTab === 'switches' && (
        <>
          {/* Search Bar and Actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Search by network name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
              />
            </div>
            <div className="ml-auto flex gap-2">
              <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white">
                Import OLT
              </Button>
              <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white">
                Add Switch
              </Button>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <p className="text-base font-semibold text-[#F8FAFC] mb-2">
              There are currently 8 network switches available for searching
            </p>
            <p className="text-sm text-[#94A3B8]">
              Please enter a search term to load results
            </p>
          </div>
        </>
      )}

      {/* System Rules Tab */}
      {activeTab === 'system-rules' && (
        <div className="flex items-center justify-center py-32">
          <p className="text-[#94A3B8]">System rules content</p>
        </div>
      )}
    </div>
  );
}

function SDNPage() {
  const [activeTab, setActiveTab] = useState('controllers');

  const controllers = [
    { name: 'FlowOps Beta', type: 'Openflow', controller: 'Manual' },
    { name: 'Kontron OLT', type: 'OLT', controller: 'OLT' },
  ];

  return (
    <div className="px-8 pb-8">
      {/* Tabs */}
      <TabMenu
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'controllers', label: 'Controllers' },
          { id: 'pon-network', label: 'PON Network' },
        ]}
      />

      {/* Controllers Tab */}
      {activeTab === 'controllers' && (
        <>
          {/* Search Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Search Controllers"
                className="w-full pl-10 pr-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-right mb-4">
            <span className="text-sm text-[#94A3B8]">Showing {controllers.length} entries</span>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Controller</TableHead>
                  <TableHead className="text-muted-foreground text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controllers.map((item, index) => (
                  <TableRow key={index} className="border-border hover:bg-muted">
                    <TableCell className="text-foreground">{item.name}</TableCell>
                    <TableCell className="text-foreground">{item.type}</TableCell>
                    <TableCell className="text-foreground">{item.controller}</TableCell>
                    <TableCell className="text-right">
                      <button className="p-2 rounded bg-[#147FFF] hover:bg-[#1068CC] transition-colors">
                        <Edit2 className="w-4 h-4 text-white" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      {/* PON Network Tab */}
      {activeTab === 'pon-network' && (
        <div className="flex items-center justify-center py-32">
          <p className="text-[#94A3B8]">PON Network content</p>
        </div>
      )}
    </div>
  );
}

function EnabledFeaturesPage() {
  const features = [
    { name: 'ACH PAYMENT', enabled: false, badges: ['Requires Setup', 'Requires Stripe'] },
    { name: 'BILLING', enabled: false, badges: ['Requires Setup', 'Requires Stripe'] },
    { name: 'CREATE ACCOUNT', enabled: true, badges: [] },
    { name: 'MANAGED BILLING', enabled: false, badges: ['Requires Setup', 'Requires Stripe'] },
    { name: 'PDN MMS CONTROLLER', enabled: true, badges: ['Requires Setup'] },
    { name: 'PAUSE SERVICE', enabled: false, badges: [] },
    { name: 'SDN NETWORK', enabled: true, badges: ['Requires Setup'] },
    { name: 'USER REVIEWS', enabled: false, badges: [] },
    { name: 'VBG INSURANCE', enabled: false, badges: ['Requires Setup', 'Requires Stripe'] },
  ];

  return (
    <div className="px-8 pb-8">
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-4 py-3 border-b border-border">
            <div className="w-48">
              <span className="text-sm font-medium text-[#F8FAFC] uppercase">{feature.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                feature.enabled ? 'bg-[var(--success)]' : 'bg-[#64748B]'
              }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  feature.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}></span>
              </button>
              <span className={`text-sm font-medium ${
                feature.enabled ? 'text-[var(--success)]' : 'text-[#94A3B8]'
              }`}>
                {feature.enabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <div className="flex gap-2">
              {feature.badges.map((badge, badgeIndex) => (
                <span
                  key={badgeIndex}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    badge === 'Requires Setup'
                      ? 'bg-[#FFA500]/10 text-[#FFA500]'
                      : 'bg-[var(--success)]/10 text-[var(--success)]'
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-start">
        <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white px-8">
          Save
        </Button>
      </div>
    </div>
  );
}

function LocationsPage() {
  const [activeTab, setActiveTab] = useState('structure');

  const locations = [
    'Allen Substation',
    'Central Office',
    'English Substation',
    'Steele Substation',
  ];

  return (
    <div className="px-8 pb-8">
      {/* Tabs */}
      <TabMenu
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: 'structure', label: 'Structure' },
          { id: 'rack', label: 'Rack' },
        ]}
      />

      {/* Structure Tab */}
      {activeTab === 'structure' && (
        <>
          {/* Add Structure Button */}
          <div className="flex justify-end mb-6">
            <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white">
              Add Structure
            </Button>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location, index) => (
                  <TableRow key={index} className="border-border hover:bg-muted">
                    <TableCell className="text-foreground">{location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button className="p-2 rounded bg-[#FFA500] hover:bg-[#FF8C00] transition-colors">
                          <Edit2 className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 rounded bg-[#E60000] hover:bg-[#CC0000] transition-colors">
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      {/* Rack Tab */}
      {activeTab === 'rack' && (
        <div className="flex items-center justify-center py-32">
          <p className="text-[#94A3B8]">Rack content</p>
        </div>
      )}
    </div>
  );
}

function ManufacturerPage() {
  const manufacturers = [
    { name: 'Venoen', acronym: 'venoen', id: '6124c525-bc8c-4720-8d1a-13234c034349', status: 'ACTIVE' },
    { name: 'Aaeon - Keep', acronym: 'aaeon', id: 'bd876c6e-db90-11ea-bae1-365141315955', status: 'ACTIVE' },
    { name: 'Kontron', acronym: 'kontron', id: '088ce39a-3b2a-11ef-b039-4d4642564458', status: 'ACTIVE' },
    { name: 'FiberStore', acronym: 'fs', id: '319f50e4-f7e0-11e8-b402-535338563844', status: 'ACTIVE' },
    { name: 'Aaeon - Merge', acronym: 'aaeon', id: '3b185b20-055d-11ea-9860-565852325555a', status: 'ACTIVE' },
    { name: 'Virtual Gateway Labs Inc', acronym: 'vgl', id: 'b76195bc-49e9-11e7-bc6c-583242593945', status: 'ACTIVE' },
    { name: 'Centec', acronym: 'centec', id: '97ed49d9-f46e-4986-9b4b-bc3b4ccea4c8', status: 'ACTIVE' },
  ];

  return (
    <div className="px-8 pb-8">
      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-3 py-2 bg-[var(--popover)] border border-[var(--border)] rounded-lg text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
          />
        </div>
        <button className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] hover:bg-[#1E293B] transition-colors">
          <HelpCircle className="w-4 h-4 text-[#94A3B8]" />
        </button>
      </div>

      {/* Table */}
      <Card className="bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Acronym</TableHead>
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manufacturers.map((item, index) => (
              <TableRow key={index} className="border-border hover:bg-muted">
                <TableCell className="text-foreground">{item.name}</TableCell>
                <TableCell className="text-foreground">{item.acronym}</TableCell>
                <TableCell className="text-foreground font-mono text-xs">{item.id}</TableCell>
                <TableCell className="text-foreground">{item.status}</TableCell>
                <TableCell className="text-right">
                  <button className="p-2 rounded bg-[#9333EA] hover:bg-[#7E22CE] transition-colors">
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function ServiceTypesPage() {
  const serviceTypes = [
    {
      name: 'Internet Service',
      description: 'An Internet Service Provider (ISP) will provide access to the internet. This access can include email, web sites, and other internet based services.',
      display: 'Yes',
    },
    {
      name: 'Service Walledgarden',
      description: 'Service Walledgarden',
      display: 'No',
    },
  ];

  return (
    <div className="px-8 pb-8">
      {/* Add ServiceType Button */}
      <div className="flex justify-end mb-6">
        <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white">
          Add ServiceType
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-card border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Description</TableHead>
              <TableHead className="text-muted-foreground">Display</TableHead>
              <TableHead className="text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceTypes.map((item, index) => (
              <TableRow key={index} className="border-border hover:bg-muted">
                <TableCell className="text-foreground">{item.name}</TableCell>
                <TableCell className="text-foreground">{item.description}</TableCell>
                <TableCell className="text-foreground">{item.display}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <button className="p-2 rounded bg-[#FFA500] hover:bg-[#FF8C00] transition-colors">
                      <Edit2 className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 rounded bg-[#E60000] hover:bg-[#CC0000] transition-colors">
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}