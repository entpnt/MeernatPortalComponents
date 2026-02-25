import { useState } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2, Calendar, TrendingUp, DollarSign, Users, Percent } from 'lucide-react';
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
import { Input } from '@/app/components/ui/input';

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
  {
    id: '4',
    name: 'Spring Bundle Deal',
    description: '20% off when bundling services',
    discountType: 'Percentage',
    discountValue: 20,
    durationType: 'Date Range',
    durationValue: '2 months',
    eligibility: 'All Customers',
    applicablePlans: ['Fiber 1000', 'Business Pro 500', 'Enterprise 2000'],
    networks: ['Orangeburg Fiber'],
    status: 'Scheduled',
    startDate: '2025-03-01',
    endDate: '2025-04-30',
    redemptionCount: 0,
    revenueImpact: 0,
    createdDate: '2025-01-20',
  },
];

export function BillingPromotions() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Billing Promotions</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Track and manage promotional campaigns and their impact on billing
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--primary)]/10">
              <Percent className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Active Promotions</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {mockPromotions.filter(p => p.status === 'Active').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Scheduled</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {mockPromotions.filter(p => p.status === 'Scheduled').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Total Redemptions</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {mockPromotions.reduce((sum, p) => sum + p.redemptionCount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <DollarSign className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Revenue Impact</p>
              <p className="text-2xl font-bold text-red-500">
                -${Math.abs(mockPromotions.reduce((sum, p) => sum + p.revenueImpact, 0)).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-[var(--border)] bg-[var(--card)]">
        <div className="p-6 space-y-4">
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
            <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
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
                          <DropdownMenuItem className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Promotion
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer">
                            <TrendingUp className="w-4 h-4 mr-2" />
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
        </div>
      </Card>
    </div>
  );
}
