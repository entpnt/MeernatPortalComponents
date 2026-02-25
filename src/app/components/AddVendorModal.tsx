import { useState } from 'react';
import { Info } from 'lucide-react';
import { Modal, ModalSection, ModalActions, ModalInfoBox } from '@/app/components/ui/modal';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface AddVendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NetworkOption {
  id: string;
  name: string;
  networkId: string;
  location: string;
}

const availableNetworks: NetworkOption[] = [
  {
    id: '1',
    name: 'Jamestown BPU',
    networkId: 'jamestown_bpu',
    location: 'Jamestown, NY',
  },
  {
    id: '2',
    name: 'Orangeburg Fiber',
    networkId: 'subscribers',
    location: 'Orangeburg, SC',
  },
];

export function AddVendorModal({ open, onOpenChange }: AddVendorModalProps) {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorType: '',
    contactEmail: '',
    contactPhone: '',
    clerkOrgId: '',
    address: '',
    networks: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vendor created:', formData);
    onOpenChange(false);
  };

  const handleNetworkToggle = (networkId: string) => {
    setFormData(prev => ({
      ...prev,
      networks: prev.networks.includes(networkId)
        ? prev.networks.filter(id => id !== networkId)
        : [...prev.networks, networkId],
    }));
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Vendor"
      description="Create a new vendor and assign networks."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <ModalSection
          title="Basic Information"
          description="Core vendor identification and contact details"
        >
          {/* Vendor Name */}
          <div className="space-y-2">
            <Label htmlFor="vendorName" className="text-[#F8FAFC]">
              Vendor Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="vendorName"
              placeholder="e.g., Acme Installation Services"
              value={formData.vendorName}
              onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
              className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
            />
          </div>

          {/* Vendor Type */}
          <div className="space-y-2">
            <Label htmlFor="vendorType" className="text-[#F8FAFC]">
              Vendor Type <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.vendorType} onValueChange={(value) => setFormData({ ...formData, vendorType: value })}>
              <SelectTrigger className="bg-[#020817] border-[#1E293B] text-[#F8FAFC]">
                <SelectValue placeholder="Network Installer..." />
              </SelectTrigger>
              <SelectContent className="bg-[#0F172A] border-[#1E293B]">
                <SelectItem value="network-installer">Network Installer</SelectItem>
                <SelectItem value="network-construction">Network Construction</SelectItem>
                <SelectItem value="independent-sales">Independent Sales</SelectItem>
                <SelectItem value="equipment-supplier">Equipment Supplier</SelectItem>
                <SelectItem value="consulting">Consulting Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-[#F8FAFC]">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contact@vendor.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-[#F8FAFC]">Contact Phone</Label>
              <Input
                id="contactPhone"
                placeholder="(555) 123-4567"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
            </div>
          </div>

          {/* Clerk Organization ID */}
          <div className="space-y-2">
            <Label htmlFor="clerkOrgId" className="text-[#F8FAFC]">Clerk Organization ID</Label>
            <Input
              id="clerkOrgId"
              placeholder="org_2abc123def456"
              value={formData.clerkOrgId}
              onChange={(e) => setFormData({ ...formData, clerkOrgId: e.target.value })}
              className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
            />
            <p className="text-xs text-[#64748B]">
              The Clerk organization ID for this vendor (e.g., org_2abc123def456)
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-[#F8FAFC]">Address</Label>
            <Textarea
              id="address"
              placeholder="Company address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B] min-h-[80px]"
            />
          </div>
        </ModalSection>

        {/* Network Assignment */}
        <ModalSection
          title="Network Assignment"
          description="Select which networks this vendor should have access to"
          showDivider
        >
          <div className="space-y-3">
            {availableNetworks.map((network) => (
              <div key={network.id} className="flex items-start space-x-3">
                <Checkbox
                  id={`network-${network.id}`}
                  checked={formData.networks.includes(network.id)}
                  onCheckedChange={() => handleNetworkToggle(network.id)}
                  className="mt-1 border-[#1E293B] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`network-${network.id}`}
                    className="text-[#F8FAFC] font-medium cursor-pointer"
                  >
                    {network.name}
                  </Label>
                  <p className="text-sm text-[#64748B]">
                    {network.networkId} • {network.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <ModalInfoBox
            title="Network Access"
            description="Access permissions are controlled by user roles in Clerk. Network assignment determines which networks the vendor can access, while their specific permissions are based on their role within the organization."
            icon={<Info className="w-5 h-5 text-[#147FFF]" />}
          />
        </ModalSection>

        {/* Actions */}
        <ModalActions
          onCancel={() => onOpenChange(false)}
          submitText="Create Vendor"
        />
      </form>
    </Modal>
  );
}
