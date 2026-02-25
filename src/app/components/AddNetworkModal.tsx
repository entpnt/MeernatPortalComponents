import { useState } from 'react';
import { Info } from 'lucide-react';
import { Modal, ModalSection, ModalActions, ModalInfoBox } from '@/app/components/ui/modal';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface AddNetworkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddNetworkModal({ open, onOpenChange }: AddNetworkModalProps) {
  const [formData, setFormData] = useState({
    organization: '',
    databaseSchemaName: '',
    internalName: '',
    displayName: '',
    location: '',
    description: '',
    hasInstallationRequests: false,
    hasServiceSubscriptions: true,
    hasContracts: false,
    hasOnboarding: true,
    email: '',
    phone: '',
    hours: '',
    facebook: '',
    twitter: '',
    instagram: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Network created:', formData);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Network"
      description="Create a new network with database schema and feature configuration."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <ModalSection
          title="Basic Information"
          description="Core network identification and display settings"
        >
          {/* Organization */}
          <div className="space-y-2">
            <Label htmlFor="organization" className="text-[#F8FAFC]">
              Organization <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.organization} onValueChange={(value) => setFormData({ ...formData, organization: value })}>
              <SelectTrigger className="bg-[#020817] border-[#1E293B] text-[#F8FAFC]">
                <SelectValue placeholder="Jamestown BPU Fiber" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F172A] border-[#1E293B]">
                <SelectItem value="jamestown">Jamestown BPU Fiber</SelectItem>
                <SelectItem value="orangeburg">Orangeburg Fiber</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-[#64748B]">Choose which organization this network belongs to</p>
          </div>

          {/* Database Schema Name & Internal Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="databaseSchemaName" className="text-[#F8FAFC]">
                Database Schema Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="databaseSchemaName"
                placeholder="e.g., subscribers, jamestown_bpu"
                value={formData.databaseSchemaName}
                onChange={(e) => setFormData({ ...formData, databaseSchemaName: e.target.value })}
                className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
              <p className="text-xs text-[#64748B]">Must be lowercase, start with letter, use underscores only</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="internalName" className="text-[#F8FAFC]">
                Internal Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="internalName"
                placeholder="e.g., subscribers, jamestown_bpu"
                value={formData.internalName}
                onChange={(e) => setFormData({ ...formData, internalName: e.target.value })}
                className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-[#F8FAFC]">
              Display Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="displayName"
              placeholder="e.g., Orangeburg Fiber, Jamestown BPU"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
            />
            <p className="text-xs text-[#64748B]">User-friendly name shown in the interface</p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#F8FAFC]">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Orangeburg, SC"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#F8FAFC]">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the network and services"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B] min-h-[80px]"
            />
          </div>
        </ModalSection>

        {/* Reporting Features */}
        <ModalSection
          title="Reporting Features"
          description="Control which data appears in reports and analytics for this network"
          showDivider
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-[#F8FAFC] font-medium">Has Installation Requests</Label>
                <p className="text-xs text-[#64748B]">Include installation request data in reports and analytics</p>
              </div>
              <Switch
                checked={formData.hasInstallationRequests}
                onCheckedChange={(checked) => setFormData({ ...formData, hasInstallationRequests: checked })}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-[#F8FAFC] font-medium">Has Service Subscriptions</Label>
                <p className="text-xs text-[#64748B]">Include service subscription data in reports and analytics</p>
              </div>
              <Switch
                checked={formData.hasServiceSubscriptions}
                onCheckedChange={(checked) => setFormData({ ...formData, hasServiceSubscriptions: checked })}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-[#F8FAFC] font-medium">Has Contracts</Label>
                <p className="text-xs text-[#64748B]">Include contract and signature data in reports and analytics</p>
              </div>
              <Switch
                checked={formData.hasContracts}
                onCheckedChange={(checked) => setFormData({ ...formData, hasContracts: checked })}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-[#F8FAFC] font-medium">Has Onboarding</Label>
                <p className="text-xs text-[#64748B]">Include onboarding progress data in reports and analytics</p>
              </div>
              <Switch
                checked={formData.hasOnboarding}
                onCheckedChange={(checked) => setFormData({ ...formData, hasOnboarding: checked })}
              />
            </div>
          </div>
        </ModalSection>

        {/* Contact Information */}
        <ModalSection
          title="Contact Information"
          description="General contact information"
          showDivider
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F8FAFC]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#F8FAFC]">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours" className="text-[#F8FAFC]">Hours</Label>
            <Input
              id="hours"
              placeholder="Mon-Fri 8AM-5PM EST"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
            />
          </div>
        </ModalSection>

        {/* Social Links */}
        <ModalSection
          title="Social Links"
          description="Social media links (optional)"
          showDivider
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-[#F8FAFC]">Facebook</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/your..."
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-[#F8FAFC]">Twitter</Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/your..."
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-[#F8FAFC]">Instagram</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/your..."
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
            </div>
          </div>

          <ModalInfoBox
            title="Database Schema"
            description="After creating this network, you'll need to set up the corresponding database schema and tables."
            icon={<Info className="w-5 h-5 text-[#147FFF]" />}
          />
        </ModalSection>

        {/* Actions */}
        <ModalActions
          onCancel={() => onOpenChange(false)}
          submitText="Create Network"
        />
      </form>
    </Modal>
  );
}
