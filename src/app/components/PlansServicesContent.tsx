import { useState } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2, Power, Tag, TrendingUp, Calendar, DollarSign } from 'lucide-react';
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
import { ServicePlanModal } from '@/app/components/ServicePlanModal';

// Service Plan interface
interface ServicePlan {
  id: string;
  name: string;
  description: string;
  downloadSpeed: string;
  uploadSpeed: string;
  serviceType: 'Residential' | 'Business';
  dataCapType: 'Unlimited' | 'Capped';
  dataCap?: string;
  price: number;
  billingFrequency: 'Monthly' | 'Annual' | 'Quarterly';
  networks: string[];
  status: 'Active' | 'Inactive';
  subscriberCount: number;
  createdDate: string;
  lastModified: string;
}

// Promotion interface
interface Promotion {
  id: string;
  name: string;
  description: string;
  discountType: 'Percentage' | 'Fixed Amount';
  discountValue: number;
  durationType: 'Billing Cycles' | 'Date Range';
  durationValue: string;
  eligibility: 'New Customers' | 'Upgrades' | 'All Customers' | 'Specific Plans';
  applicablePlans: string[];
  networks: string[];
  status: 'Active' | 'Expired' | 'Scheduled';
  startDate: string;
  endDate: string;
  redemptionCount: number;
  revenueImpact: number;
  createdDate: string;
}

// Mock data for service plans
const mockPlans: ServicePlan[] = [
  {
    id: '1',
    name: 'Fiber 1000',
    description: 'High-speed fiber internet for residential use',
    downloadSpeed: '1000 Mbps',
    uploadSpeed: '1000 Mbps',
    serviceType: 'Residential',
    dataCapType: 'Unlimited',
    price: 79.99,
    billingFrequency: 'Monthly',
    networks: ['Orangeburg Fiber'],
    status: 'Active',
    subscriberCount: 1247,
    createdDate: '2024-01-15',
    lastModified: '2025-01-10',
  },
  {
    id: '2',
    name: 'Business Pro 500',
    description: 'Professional-grade internet for small businesses',
    downloadSpeed: '500 Mbps',
    uploadSpeed: '500 Mbps',
    serviceType: 'Business',
    dataCapType: 'Unlimited',
    price: 149.99,
    billingFrequency: 'Monthly',
    networks: ['Orangeburg Fiber', 'Jamestown BPU'],
    status: 'Active',
    subscriberCount: 342,
    createdDate: '2024-02-20',
    lastModified: '2025-01-15',
  },
  {
    id: '3',
    name: 'Basic 100',
    description: 'Affordable entry-level internet service',
    downloadSpeed: '100 Mbps',
    uploadSpeed: '100 Mbps',
    serviceType: 'Residential',
    dataCapType: 'Capped',
    dataCap: '1 TB',
    price: 39.99,
    billingFrequency: 'Monthly',
    networks: ['Orangeburg Fiber'],
    status: 'Active',
    subscriberCount: 823,
    createdDate: '2024-01-10',
    lastModified: '2024-12-01',
  },
  {
    id: '4',
    name: 'Enterprise 2000',
    description: 'Premium dedicated fiber for large businesses',
    downloadSpeed: '2000 Mbps',
    uploadSpeed: '2000 Mbps',
    serviceType: 'Business',
    dataCapType: 'Unlimited',
    price: 299.99,
    billingFrequency: 'Monthly',
    networks: ['Jamestown BPU'],
    status: 'Active',
    subscriberCount: 89,
    createdDate: '2024-03-01',
    lastModified: '2025-01-20',
  },
];

// Mock data for promotions
const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'New Year Special',
    description: '25% off for first 3 months',
    discountType: 'Percentage',
    discountValue: 25,
    durationType: 'Billing Cycles',
    durationValue: '3 cycles',
    eligibility: 'New Customers',
    applicablePlans: ['Fiber 1000', 'Basic 100'],
    networks: ['Orangeburg Fiber'],
    status: 'Active',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    redemptionCount: 234,
    revenueImpact: -4680,
    createdDate: '2024-12-15',
  },
  {
    id: '2',
    name: 'Business Upgrade Promo',
    description: '$50 off first month for upgrades',
    discountType: 'Fixed Amount',
    discountValue: 50,
    durationType: 'Billing Cycles',
    durationValue: '1 cycle',
    eligibility: 'Upgrades',
    applicablePlans: ['Business Pro 500', 'Enterprise 2000'],
    networks: ['Orangeburg Fiber', 'Jamestown BPU'],
    status: 'Active',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    redemptionCount: 67,
    revenueImpact: -3350,
    createdDate: '2025-01-10',
  },
  {
    id: '3',
    name: 'Summer Savings 2024',
    description: '15% off annual plans',
    discountType: 'Percentage',
    discountValue: 15,
    durationType: 'Date Range',
    durationValue: '3 months',
    eligibility: 'All Customers',
    applicablePlans: ['Fiber 1000', 'Business Pro 500'],
    networks: ['Orangeburg Fiber'],
    status: 'Expired',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    redemptionCount: 412,
    revenueImpact: -12360,
    createdDate: '2024-05-15',
  },
];

export function PlansServicesContent() {
  const [activeTab, setActiveTab] = useState<'plans' | 'promotions'>('plans');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<ServicePlan | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsEditMode(false);
    setIsPlanModalOpen(true);
  };

  const handleEditPlan = (plan: ServicePlan) => {
    setSelectedPlan(plan);
    setIsEditMode(true);
    setIsPlanModalOpen(true);
  };

  const handleCreatePromotion = () => {
    setSelectedPromotion(null);
    setIsEditMode(false);
    setIsPromotionModalOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsEditMode(true);
    setIsPromotionModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Plans & Services</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Manage your service catalog, pricing, and promotional offerings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--primary)]/10">
              <Tag className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Total Plans</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{mockPlans.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Power className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Active Plans</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {mockPlans.filter(p => p.status === 'Active').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Active Promos</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {mockPromotions.filter(p => p.status === 'Active').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <DollarSign className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Total Subscribers</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {mockPlans.reduce((sum, plan) => sum + plan.subscriberCount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-[var(--border)] bg-[var(--card)]">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'plans' | 'promotions')}>
          <div className="border-b border-[var(--border)] px-6 pt-6">
            <TabsList className="bg-[var(--muted)]">
              <TabsTrigger value="plans">Service Plans</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
            </TabsList>
          </div>

          {/* Service Plans Tab */}
          <TabsContent value="plans" className="p-6 space-y-4">
            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <Input
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleCreatePlan} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Plan
              </Button>
            </div>

            {/* Plans Table */}
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--muted)]/50 hover:bg-[var(--muted)]/50">
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Networks</TableHead>
                    <TableHead>Subscribers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-[var(--foreground)]">{plan.name}</div>
                          <div className="text-sm text-[var(--muted-foreground)]">{plan.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          plan.serviceType === 'Business' 
                            ? 'bg-purple-500/10 text-purple-500' 
                            : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {plan.serviceType}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-[var(--foreground)]">↓ {plan.downloadSpeed}</div>
                          <div className="text-[var(--muted-foreground)]">↑ {plan.uploadSpeed}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[var(--foreground)]">${plan.price.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[var(--muted-foreground)]">{plan.billingFrequency}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {plan.networks.map((network, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 rounded bg-[var(--muted)] text-[var(--foreground)]">
                              {network}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[var(--foreground)]">{plan.subscriberCount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          plan.status === 'Active' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-gray-500/10 text-gray-500'
                        }`}>
                          {plan.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[var(--popover)] border-[var(--border)]">
                            <DropdownMenuItem 
                              onClick={() => handleEditPlan(plan)}
                              className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Plan
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer">
                              <Power className="w-4 h-4 mr-2" />
                              {plan.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 cursor-pointer">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Plan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="p-6 space-y-4">
            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <Input
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleCreatePromotion} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </div>

            {/* Promotions Table */}
            <div className="border border-[var(--border)] rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--muted)]/50 hover:bg-[var(--muted)]/50">
                    <TableHead>Promotion Name</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Eligibility</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Redemptions</TableHead>
                    <TableHead>Revenue Impact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPromotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-[var(--foreground)]">{promo.name}</div>
                          <div className="text-sm text-[var(--muted-foreground)]">{promo.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[var(--foreground)]">
                          {promo.discountType === 'Percentage' 
                            ? `${promo.discountValue}%` 
                            : `$${promo.discountValue}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[var(--muted-foreground)]">{promo.durationValue}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded bg-[var(--muted)] text-[var(--foreground)]">
                          {promo.eligibility}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-[var(--foreground)]">{promo.startDate}</div>
                          <div className="text-[var(--muted-foreground)]">{promo.endDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[var(--foreground)]">{promo.redemptionCount}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${promo.revenueImpact < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          ${Math.abs(promo.revenueImpact).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          promo.status === 'Active' 
                            ? 'bg-green-500/10 text-green-500' 
                            : promo.status === 'Expired'
                            ? 'bg-gray-500/10 text-gray-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {promo.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[var(--popover)] border-[var(--border)]">
                            <DropdownMenuItem 
                              onClick={() => handleEditPromotion(promo)}
                              className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Promotion
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer">
                              <Calendar className="w-4 h-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 cursor-pointer">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Promotion
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Plan Modal */}
      <ServicePlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        plan={selectedPlan}
        isEditMode={isEditMode}
      />

      {/* Promotion Modal */}
      <PromotionModal
        isOpen={isPromotionModalOpen}
        onClose={() => setIsPromotionModalOpen(false)}
        promotion={selectedPromotion}
        isEditMode={isEditMode}
      />
    </div>
  );
}

// Promotion Modal Component
interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion | null;
  isEditMode: boolean;
}

function PromotionModal({ isOpen, onClose, promotion, isEditMode }: PromotionModalProps) {
  const [formData, setFormData] = useState({
    name: promotion?.name || '',
    description: promotion?.description || '',
    discountType: promotion?.discountType || 'Percentage',
    discountValue: promotion?.discountValue || 0,
    durationType: promotion?.durationType || 'Billing Cycles',
    durationValue: promotion?.durationValue || '',
    eligibility: promotion?.eligibility || 'New Customers',
    applicablePlans: promotion?.applicablePlans || [],
    networks: promotion?.networks || [],
    startDate: promotion?.startDate || '',
    endDate: promotion?.endDate || '',
  });

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title={isEditMode ? 'Edit Promotion' : 'Create Promotion'}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Basic Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promo-name">Promotion Name *</Label>
              <Input
                id="promo-name"
                placeholder="e.g., New Year Special"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-description">Description</Label>
              <Textarea
                id="promo-description"
                placeholder="Describe the promotion details"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Discount Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Discount Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount-type">Discount Type *</Label>
              <Select value={formData.discountType} onValueChange={(value) => setFormData({ ...formData, discountType: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                  <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-value">
                Discount Value * {formData.discountType === 'Percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                id="discount-value"
                type="number"
                placeholder={formData.discountType === 'Percentage' ? '25' : '50.00'}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Duration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration-type">Duration Type *</Label>
              <Select value={formData.durationType} onValueChange={(value) => setFormData({ ...formData, durationType: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Billing Cycles">Billing Cycles</SelectItem>
                  <SelectItem value="Date Range">Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration-value">
                {formData.durationType === 'Billing Cycles' ? 'Number of Cycles' : 'Duration'}
              </Label>
              <Input
                id="duration-value"
                placeholder={formData.durationType === 'Billing Cycles' ? '3' : '3 months'}
                value={formData.durationValue}
                onChange={(e) => setFormData({ ...formData, durationValue: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date *</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date *</Label>
              <Input
                id="end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Eligibility */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Eligibility</h3>
          <div className="space-y-2">
            <Label htmlFor="eligibility">Who can use this promotion? *</Label>
            <Select value={formData.eligibility} onValueChange={(value) => setFormData({ ...formData, eligibility: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New Customers">New Customers Only</SelectItem>
                <SelectItem value="Upgrades">Plan Upgrades Only</SelectItem>
                <SelectItem value="All Customers">All Customers</SelectItem>
                <SelectItem value="Specific Plans">Specific Plans</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applicable Plans */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Applicable Plans</h3>
          <div className="space-y-2">
            <p className="text-sm text-[var(--muted-foreground)]">
              Select which service plans this promotion applies to
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch id="plan-fiber1000" />
                <Label htmlFor="plan-fiber1000" className="cursor-pointer">Fiber 1000</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="plan-basic100" />
                <Label htmlFor="plan-basic100" className="cursor-pointer">Basic 100</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="plan-business500" />
                <Label htmlFor="plan-business500" className="cursor-pointer">Business Pro 500</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Network Assignment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Network Assignment</h3>
          <div className="space-y-3">
            <p className="text-sm text-[var(--muted-foreground)]">
              Select which network(s) this promotion applies to
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch id="promo-network-orangeburg" />
                <Label htmlFor="promo-network-orangeburg" className="cursor-pointer">Orangeburg Fiber</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="promo-network-jamestown" />
                <Label htmlFor="promo-network-jamestown" className="cursor-pointer">Jamestown BPU</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
          >
            {isEditMode ? 'Save Changes' : 'Create Promotion'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}