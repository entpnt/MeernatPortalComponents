import { useState } from 'react';
import { Mail, Phone, MapPin, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { AddVendorModal } from '@/app/components/AddVendorModal';

interface Vendor {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Inactive';
  email: string;
  phone: string;
  address: string;
  networkAccess: string[];
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'ACME Test Install Partner',
    type: 'Network Installer',
    status: 'Active',
    email: 'hmiller@entpnt.com',
    phone: '555-0001',
    address: '456 Builder Ave, Work Town, WT 67890',
    networkAccess: ['Jamestown BPU'],
  },
  {
    id: '2',
    name: 'Construction Corp',
    type: 'Network Construction',
    status: 'Active',
    email: 'info@constructioncorp.com',
    phone: '555-0002',
    address: '456 Builder Ave, Work Town, WT 67890',
    networkAccess: ['Orangeburg Fiber'],
  },
  {
    id: '3',
    name: 'National On Demand',
    type: 'Network Installer',
    status: 'Active',
    email: 'contact@nationalondemand.com',
    phone: '555-0001',
    address: '123 Installation St, Tech City, TC 12345',
    networkAccess: ['Orangeburg Fiber', 'Jamestown BPU'],
  },
  {
    id: '4',
    name: 'Orangeburg Sales Team',
    type: 'Independent Sales',
    status: 'Active',
    email: 'sales@indsales.test',
    phone: '555-0003',
    address: '789 Sales Blvd, Commerce City, CC 11111',
    networkAccess: ['Orangeburg Fiber'],
  },
];

interface VendorManagementProps {
  onNavigateBack: () => void;
}

export function VendorManagement({ onNavigateBack }: VendorManagementProps) {
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Network Installer':
        return 'bg-[#147FFF]/20 text-[#147FFF] border-[#147FFF]/30';
      case 'Network Construction':
        return 'bg-[#21DB00]/20 text-[#21DB00] border-[#21DB00]/30';
      case 'Independent Sales':
        return 'bg-[#A855F7]/20 text-[#A855F7] border-[#A855F7]/30';
      default:
        return 'bg-[#94A3B8]/20 text-[#94A3B8] border-[#94A3B8]/30';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onNavigateBack}
        className="text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Settings
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#F8FAFC]">Vendor Management</h1>
          <p className="text-[#94A3B8]">Manage your organization's vendors and their network assignments</p>
        </div>
        <Button
          className="bg-[#147FFF] hover:bg-[#1066CC] text-white"
          onClick={() => setIsAddVendorModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="bg-[#020817] border-[#1E293B] hover:border-[#147FFF]/50 transition-colors">
            <CardHeader className="space-y-3 pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-semibold text-[#F8FAFC]">{vendor.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getTypeColor(vendor.type)} variant="outline">
                      {vendor.type}
                    </Badge>
                    <Badge className="bg-[#21DB00]/20 text-[#21DB00] border-[#21DB00]/30" variant="outline">
                      {vendor.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#147FFF]"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#DC2626]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Contact Information */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-[#94A3B8]">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{vendor.address}</span>
                </div>
              </div>

              {/* Network Access */}
              <div className="pt-3 border-t border-[#1E293B]">
                <div className="text-xs font-medium text-[#F8FAFC] mb-2">
                  Network Access ({vendor.networkAccess.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.networkAccess.map((network) => (
                    <Badge
                      key={network}
                      variant="secondary"
                      className="bg-[#1E293B] text-[#F8FAFC] text-xs border-none"
                    >
                      {network}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Vendor Modal */}
      <AddVendorModal
        open={isAddVendorModalOpen}
        onOpenChange={setIsAddVendorModalOpen}
      />
    </div>
  );
}