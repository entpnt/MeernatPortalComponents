import { useState } from 'react';
import { Search, Download, X, ChevronDown, ArrowUpDown, Filter, ArrowLeft, GripVertical, Eye, EyeOff, ChevronLeft, ChevronRight, Users, TrendingUp, TrendingDown, DollarSign, Columns as ColumnsIcon, BarChart3 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DataTable, Column } from '@/app/components/DataTable';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import { ColumnManager } from '@/app/components/ColumnManager';
import { CustomerDetailModal } from '@/app/components/CustomerDetailModal';
import { Popover, PopoverTrigger, PopoverContent } from '@/app/components/ui/popover';

// Mock data for the subscriber list
const subscriberData = [
  {
    accountId: 'JB-2026-710645',
    fullAddress: '17 Durant Avenue, Jamestown, NY 14701',
    currentStatus: 'Completed',
    statusAtSignup: 'Completed',
    ownership: 'owner',
    addressCreated: '1/26/2026',
    customerName: 'Josef Bollman',
    serialNumber: 'ISKT4A2B9C',
    serviceProvider: 'Sumo Fiber',
    planName: '2 Gigabit Internet',
    subscriptionStatus: 'Active',
    contract: 'Property Access : Signed',
    installationStatus: 'pending',
  },
  {
    accountId: 'JB-2026-672123',
    fullAddress: '329 East Elmwood Avenue, Falconer, NY 14733',
    currentStatus: 'planned',
    statusAtSignup: 'planned',
    ownership: 'owner',
    addressCreated: '1/26/2026',
    customerName: 'Tom Sears',
    serialNumber: 'ISKT7F3K8D',
    serviceProvider: 'N/A',
    planName: 'N/A',
    subscriptionStatus: 'Pending',
    contract: 'Property Access : Signed',
    installationStatus: 'N/A',
  },
  {
    accountId: 'JB-2026-571258',
    fullAddress: '25 Maple Street, Jamestown, NY 14701',
    currentStatus: 'Completed',
    statusAtSignup: 'Completed',
    ownership: 'owner',
    addressCreated: '1/25/2026',
    customerName: 'Brian Marino',
    serialNumber: 'ISKT1M5N2P',
    serviceProvider: 'N/A',
    planName: 'N/A',
    subscriptionStatus: 'Active',
    contract: 'No Contract',
    installationStatus: 'N/A',
  },
  {
    accountId: 'JB-2026-326724',
    fullAddress: '42 Wicks Avenue, Jamestown, NY 14701',
    currentStatus: 'planned',
    statusAtSignup: 'planned',
    ownership: 'owner',
    addressCreated: '1/23/2026',
    customerName: 'Deborah Ohls',
    serialNumber: 'ISKT9Q6R4T',
    serviceProvider: 'N/A',
    planName: 'N/A',
    subscriptionStatus: 'Pending',
    contract: 'No Contract',
    installationStatus: 'N/A',
  },
  {
    accountId: 'JB-2026-858617',
    fullAddress: '365 S MAIN ST, JAMESTOWN, NY 14701',
    currentStatus: 'planned',
    statusAtSignup: 'planned',
    ownership: 'N/A',
    addressCreated: '1/23/2026',
    customerName: 'Patricia Collins',
    serialNumber: 'ISKT3V8W7X',
    serviceProvider: 'N/A',
    planName: 'N/A',
    subscriptionStatus: 'Pending',
    contract: 'No Contract',
    installationStatus: 'N/A',
  },
  {
    accountId: 'JB-2026-758596',
    fullAddress: '13 Harris Avenue, Jamestown, NY 14701',
    currentStatus: 'Completed',
    statusAtSignup: 'Completed',
    ownership: 'owner',
    addressCreated: '1/23/2026',
    customerName: 'Alan Abbott',
    serialNumber: 'ISKT5Y2Z1A',
    serviceProvider: 'N/A',
    planName: 'N/A',
    subscriptionStatus: 'Active',
    contract: 'No Contract',
    installationStatus: 'N/A',
  },
  {
    accountId: 'JB-2026-714553',
    fullAddress: '40 HAMMOND ST, JAMESTOWN, NY 14701',
    currentStatus: 'planned',
    statusAtSignup: 'planned',
    ownership: 'owner',
    addressCreated: '1/22/2026',
    customerName: 'Izaac Rhome',
    serialNumber: 'ISKT6B4C8E',
    serviceProvider: 'N/A',
    planName: 'N/A',
    subscriptionStatus: 'Pending',
    contract: 'Property Access : Signed',
    installationStatus: 'N/A',
  },
];

const defaultColumns: Column[] = [
  { id: 'accountId', label: 'Account ID', visible: true },
  { id: 'fullAddress', label: 'Full Address', visible: true },
  { id: 'currentStatus', label: 'Current Status', visible: true },
  { id: 'statusAtSignup', label: 'Status at Signup', visible: true },
  { id: 'ownership', label: 'Ownership Status', visible: true },
  { id: 'addressCreated', label: 'Address Created', visible: true },
  { id: 'customerName', label: 'Customer Name', visible: true },
  { id: 'serialNumber', label: 'Serial Number', visible: true },
  { id: 'serviceProvider', label: 'Service Provider', visible: true },
  { id: 'planName', label: 'Plan Name', visible: true },
  { id: 'subscriptionStatus', label: 'Account Status', visible: true },
  { 
    id: 'contract', 
    label: 'Contract', 
    visible: true,
    cellRenderer: (value: string) => {
      return (
        <div className="space-y-1">
          {value.split(':').map((part, i) => (
            <div key={i} className={i === 0 ? 'text-[#F8FAFC]' : 'text-[#21DB00]'}>
              {part.trim()}
            </div>
          ))}
        </div>
      );
    }
  },
  { id: 'installationStatus', label: 'Installation Status', visible: true },
];

type AccountFilterType = 'all' | 'active' | 'pending' | 'cancelled';

export function AllSubscribersContent() {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [accountFilter, setAccountFilter] = useState<AccountFilterType>('all');
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [entriesPerPage, setEntriesPerPage] = useState('50');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 131; // 1302 total / 10 per page (example)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isColumnSheetOpen, setIsColumnSheetOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    currentStatus: [],
    subscriptionStatus: [],
    installationStatus: [],
    contractType: [],
    contractStatus: [],
  });

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters(prev => {
      const categoryFilters = prev[category] || [];
      const newFilters = categoryFilters.includes(value)
        ? categoryFilters.filter((v: string) => v !== value)
        : [...categoryFilters, value];
      return { ...prev, [category]: newFilters };
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      currentStatus: [],
      subscriptionStatus: [],
      installationStatus: [],
      contractType: [],
      contractStatus: [],
    });
  };

  const getTotalActiveFilters = () => {
    return Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-[var(--success)] bg-[var(--success)]/10';
      case 'planned':
        return 'text-[#64748B] bg-[#64748B]/10';
      case 'pending':
        return 'text-[var(--warning)] bg-[var(--warning)]/10';
      case 'active':
        return 'text-[var(--success)] bg-[var(--success)]/10';
      case 'cancelled':
        return 'text-[var(--error)] bg-[var(--error)]/10';
      default:
        return 'text-[#64748B] bg-[#64748B]/10';
    }
  };

  // Filter data based on account filter
  const getFilteredData = () => {
    switch (accountFilter) {
      case 'active':
        return subscriberData.filter(sub => sub.subscriptionStatus.toLowerCase() === 'active');
      case 'pending':
        return subscriberData.filter(sub => sub.subscriptionStatus.toLowerCase() === 'pending');
      case 'cancelled':
        return subscriberData.filter(sub => sub.subscriptionStatus.toLowerCase() === 'cancelled');
      default:
        return subscriberData;
    }
  };

  const filteredData = getFilteredData();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">All Accounts</h1>
              <p className="text-[var(--muted-foreground)]">Comprehensive directory of all customer accounts</p>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)] bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 border border-[var(--border)] rounded-lg transition-colors"
              title={showStats ? "Hide Statistics" : "Show Statistics"}
            >
              {showStats ? <EyeOff className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
              {showStats ? "Hide Stats" : "Show Stats"}
            </button>
          </div>

          {/* Account Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[var(--border)]">
            <button
              onClick={() => setAccountFilter('all')}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                accountFilter === 'all'
                  ? 'text-[var(--foreground)] bg-[var(--secondary)] rounded-t-lg'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              All Accounts
            </button>
            <button
              onClick={() => setAccountFilter('active')}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                accountFilter === 'active'
                  ? 'text-[var(--foreground)] bg-[var(--secondary)] rounded-t-lg'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setAccountFilter('pending')}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                accountFilter === 'pending'
                  ? 'text-[var(--foreground)] bg-[var(--secondary)] rounded-t-lg'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setAccountFilter('cancelled')}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                accountFilter === 'cancelled'
                  ? 'text-[var(--foreground)] bg-[var(--secondary)] rounded-t-lg'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Account Statistics */}
          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Active */}
              <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm text-[var(--muted-foreground)]">Total Active</div>
                  <Users className="w-5 h-5 text-[var(--muted-foreground)]" />
                </div>
                <div className="text-3xl font-bold text-[var(--foreground)] mb-1">0</div>
                <div className="text-sm text-[var(--muted-foreground)]">Active accounts</div>
              </Card>

              {/* New This Month */}
              <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm text-[var(--muted-foreground)]">New This Month</div>
                  <TrendingUp className="w-5 h-5 text-[var(--success)]" />
                </div>
                <div className="text-3xl font-bold text-[var(--success)] mb-1">+0</div>
                <div className="text-sm text-[var(--muted-foreground)]">New activations</div>
              </Card>

              {/* Churned This Month */}
              <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm text-[var(--muted-foreground)]">Churned This Month</div>
                  <TrendingDown className="w-5 h-5 text-[var(--error)]" />
                </div>
                <div className="text-3xl font-bold text-[var(--error)] mb-1">-0</div>
                <div className="text-sm text-[var(--muted-foreground)]">Net 0 accounts</div>
              </Card>

              {/* Monthly Revenue */}
              <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm text-[var(--muted-foreground)]">Monthly Revenue</div>
                  <DollarSign className="w-5 h-5 text-[var(--muted-foreground)]" />
                </div>
                <div className="text-3xl font-bold text-[var(--foreground)] mb-1">$0</div>
                <div className="text-sm text-[var(--muted-foreground)]">Recurring revenue</div>
              </Card>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3 bg-[var(--input-background)] border border-[var(--border)] rounded-lg px-4 py-3">
                  <Search className="w-5 h-5 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none text-sm"
                  />
                </div>
                <Button
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className="bg-[#147FFF] text-white hover:bg-[#147FFF]/90 px-6"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Search
                </Button>
              </div>

              {/* Advanced Search Panel */}
              {showAdvancedSearch && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">Advanced Search Filters</h3>
                    <div className="flex items-center gap-3">
                      {getTotalActiveFilters() > 0 && (
                        <span className="text-sm text-[var(--muted-foreground)]">{getTotalActiveFilters()} total active</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Accounts */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[var(--foreground)]">Accounts</h4>
                        <span className="text-xs text-[var(--muted-foreground)]">0 active</span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-[var(--muted-foreground)]">Account ID</label>
                        <Input
                          placeholder="Search account..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                        <label className="text-xs text-[var(--muted-foreground)]">Customer Name</label>
                        <Input
                          placeholder="Search name..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                        <label className="text-xs text-[var(--muted-foreground)]">Email</label>
                        <Input
                          placeholder="Search email..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                        <label className="text-xs text-[var(--muted-foreground)]">Phone</label>
                        <Input
                          placeholder="Search phone..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                        <label className="text-xs text-[var(--muted-foreground)]">Device Serial Number</label>
                        <Input
                          placeholder="Search serial..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                        <label className="text-xs text-[var(--muted-foreground)]">MAC Address</label>
                        <Input
                          placeholder="Search MAC..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                      </div>
                    </div>

                    {/* Address & Onboarding */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[var(--foreground)]">Address & Onboarding</h4>
                        <span className="text-xs text-[var(--muted-foreground)]">{activeFilters.currentStatus.length} active</span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-[var(--muted-foreground)]">Full Address</label>
                        <Input
                          placeholder="Search address..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                        <label className="text-xs text-[var(--muted-foreground)]">Address Type</label>
                        <Select>
                          <SelectTrigger className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm h-9">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                            <SelectItem value="all" className="text-[#F8FAFC]">All Types</SelectItem>
                            <SelectItem value="residential" className="text-[#F8FAFC]">Residential</SelectItem>
                            <SelectItem value="commercial" className="text-[#F8FAFC]">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                        <label className="text-xs text-[var(--muted-foreground)]">Ownership</label>
                        <Select>
                          <SelectTrigger className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm h-9">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                            <SelectItem value="all" className="text-[#F8FAFC]">All</SelectItem>
                            <SelectItem value="owner" className="text-[#F8FAFC]">Owner</SelectItem>
                            <SelectItem value="renter" className="text-[#F8FAFC]">Renter</SelectItem>
                          </SelectContent>
                        </Select>
                        <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Current Status</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.currentStatus.includes('Completed')}
                              onCheckedChange={() => toggleFilter('currentStatus', 'Completed')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Completed
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.currentStatus.includes('Planned')}
                              onCheckedChange={() => toggleFilter('currentStatus', 'Planned')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Planned
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.currentStatus.includes('Pending')}
                              onCheckedChange={() => toggleFilter('currentStatus', 'Pending')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Pending
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Subscriptions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[var(--foreground)]">Subscriptions</h4>
                        <span className="text-xs text-[var(--muted-foreground)]">{activeFilters.subscriptionStatus.length} active</span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-[var(--muted-foreground)]">Service Provider</label>
                        <Input
                          placeholder="Search provider..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                        <label className="text-xs text-[var(--muted-foreground)]">Plan Name</label>
                        <Input
                          placeholder="Search plan..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                        <label className="text-xs text-[var(--muted-foreground)]">Service Type</label>
                        <Input
                          placeholder="Search service type..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                        <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Subscription Status</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.subscriptionStatus.includes('Pending')}
                              onCheckedChange={() => toggleFilter('subscriptionStatus', 'Pending')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Pending
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.subscriptionStatus.includes('Active')}
                              onCheckedChange={() => toggleFilter('subscriptionStatus', 'Active')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Active
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.subscriptionStatus.includes('Suspended')}
                              onCheckedChange={() => toggleFilter('subscriptionStatus', 'Suspended')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Suspended
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.subscriptionStatus.includes('Cancelled')}
                              onCheckedChange={() => toggleFilter('subscriptionStatus', 'Cancelled')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Cancelled
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Installation */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[var(--foreground)]">Installation</h4>
                        <span className="text-xs text-[var(--muted-foreground)]">{activeFilters.installationStatus.length} active</span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Installation Status</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.installationStatus.includes('Pending')}
                              onCheckedChange={() => toggleFilter('installationStatus', 'Pending')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Pending
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.installationStatus.includes('Scheduled')}
                              onCheckedChange={() => toggleFilter('installationStatus', 'Scheduled')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Scheduled
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.installationStatus.includes('InProgress')}
                              onCheckedChange={() => toggleFilter('installationStatus', 'InProgress')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            In Progress
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.installationStatus.includes('Completed')}
                              onCheckedChange={() => toggleFilter('installationStatus', 'Completed')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Completed
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.installationStatus.includes('Cancelled')}
                              onCheckedChange={() => toggleFilter('installationStatus', 'Cancelled')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Cancelled
                          </label>
                        </div>
                        <label className="text-xs text-[var(--muted-foreground)] mt-3">Work Order ID</label>
                        <Input
                          placeholder="Search work order..."
                          className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm"
                        />
                        <label className="text-xs text-[var(--muted-foreground)]">Net Work Order</label>
                        <Select>
                          <SelectTrigger className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm h-9">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                            <SelectItem value="all" className="text-[#F8FAFC]">All</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Contracts */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[var(--foreground)]">Contracts</h4>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {activeFilters.contractType.length + activeFilters.contractStatus.length} active
                        </span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Contract Type</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.contractType.includes('PropertyAccess')}
                              onCheckedChange={() => toggleFilter('contractType', 'PropertyAccess')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Property Access
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.contractType.includes('FreeInstall')}
                              onCheckedChange={() => toggleFilter('contractType', 'FreeInstall')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Free Install
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.contractType.includes('ServiceAgreement')}
                              onCheckedChange={() => toggleFilter('contractType', 'ServiceAgreement')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Service Agreement
                          </label>
                        </div>
                        <label className="text-xs text-[var(--muted-foreground)] mb-1 block mt-3">Contract Status</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.contractStatus.includes('Pending')}
                              onCheckedChange={() => toggleFilter('contractStatus', 'Pending')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Pending
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.contractStatus.includes('Signed')}
                              onCheckedChange={() => toggleFilter('contractStatus', 'Signed')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Signed
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.contractStatus.includes('Expired')}
                              onCheckedChange={() => toggleFilter('contractStatus', 'Expired')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Expired
                          </label>
                          <label className="flex items-center gap-2 text-sm text-[#E2E8F0] cursor-pointer hover:text-[#F8FAFC]">
                            <Checkbox
                              checked={activeFilters.contractStatus.includes('Cancelled')}
                              onCheckedChange={() => toggleFilter('contractStatus', 'Cancelled')}
                              className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                            />
                            Cancelled
                          </label>
                        </div>
                        <label className="text-xs text-[var(--muted-foreground)] mt-3">Ownership</label>
                        <Select>
                          <SelectTrigger className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)] text-sm h-9">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                            <SelectItem value="all" className="text-[#F8FAFC]">All</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button className="bg-[#147FFF] hover:bg-[#1068CC] text-white">
                      <Search className="w-4 h-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsColumnSheetOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)] bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 border border-[var(--border)] rounded-lg transition-colors"
                >
                  <ColumnsIcon className="w-4 h-4" />
                  Columns
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)] bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 border border-[var(--border)] rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--muted-foreground)]">Show</span>
                  <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                    <SelectTrigger className="h-8 w-20 bg-[var(--secondary)] border-[var(--border)] text-[var(--foreground)] text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--popover)] border-[var(--border)]">
                      <SelectItem value="20" className="text-[var(--foreground)]">20</SelectItem>
                      <SelectItem value="50" className="text-[var(--foreground)]">50</SelectItem>
                      <SelectItem value="100" className="text-[var(--foreground)]">100</SelectItem>
                      <SelectItem value="200" className="text-[var(--foreground)]">200</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-[var(--muted-foreground)]">entries per page</span>
                </div>
              </div>
            </div>
            
            <DataTable
              columns={columns}
              data={filteredData}
              onColumnsChange={setColumns}
              totalCount={filteredData.length}
              showColumnManager={false}
              showPagination={false}
              onRowClick={setSelectedCustomer}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 px-4 pb-4">
              <div className="text-sm text-[var(--muted-foreground)]">
                Showing 1-7 of 1,302
              </div>
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
                  {[1, 2, 3, 4, 5].map((page) => (
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
                  ))}
                </div>

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
        </div>
      </div>

      {/* Customer Detail Modal */}
      <CustomerDetailModal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
      />

      {/* Column Manager Sheet */}
      <Sheet open={isColumnSheetOpen} onOpenChange={setIsColumnSheetOpen}>
        <SheetContent className="bg-[var(--card)] border-l border-[var(--border)] w-[400px] sm:w-[500px] p-0">
          <SheetHeader className="px-6 py-4 border-b border-[var(--border)]">
            <SheetTitle className="text-lg font-semibold text-[var(--foreground)]">
              Manage Columns
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-73px)] overflow-hidden">
            <ColumnManager columns={columns} onColumnsChange={setColumns} />
          </div>
        </SheetContent>
      </Sheet>
    </DndProvider>
  );
}