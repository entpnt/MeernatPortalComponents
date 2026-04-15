import { useState } from 'react';
import { Modal, ModalSection, ModalActions } from '@/app/components/ui/modal';
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

export function AddVendorModal({ open, onOpenChange }: AddVendorModalProps) {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorType: '',
    contactEmail: '',
    contactPhone: '',
    clerkOrgId: '',
    address: '',
    // Networks
    jamestown: false,
    orangeburg: true,
    fiberco: false,
    // Services
    installationEnabled: true,
    salesEnabled: false,
    supportEnabled: false,
    // Status & Metadata
    isActive: true,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vendor created:', formData);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Vendor"
      description="Create a new vendor partner with network access and service configuration."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <ModalSection
          title="Basic Information"
          description="Core vendor identification and contact details"
        >
          {/* Vendor Name */}
          <div className="space-y-2">
            <Label htmlFor="vendorName" className="text-foreground">
              Vendor Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="vendorName"
              placeholder="e.g., Acme Installation Services"
              value={formData.vendorName}
              onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
              className="bg-input-background border-input text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Vendor Type */}
          <div className="space-y-2">
            <Label htmlFor="vendorType" className="text-foreground">
              Vendor Type <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.vendorType} onValueChange={(value) => setFormData({ ...formData, vendorType: value })}>
              <SelectTrigger className="bg-input-background border-input text-foreground">
                <SelectValue placeholder="Network Installer..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
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
              <Label htmlFor="contactEmail" className="text-foreground">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contact@vendor.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="bg-input-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-foreground">Contact Phone</Label>
              <Input
                id="contactPhone"
                placeholder="(555) 123-4567"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="bg-input-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Clerk Organization ID */}
          <div className="space-y-2">
            <Label htmlFor="clerkOrgId" className="text-foreground">Clerk Organization ID</Label>
            <Input
              id="clerkOrgId"
              placeholder="org_2abc123def456"
              value={formData.clerkOrgId}
              onChange={(e) => setFormData({ ...formData, clerkOrgId: e.target.value })}
              className="bg-input-background border-input text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              The Clerk organization ID for this vendor (e.g., org_2abc123def456)
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">Address</Label>
            <Textarea
              id="address"
              placeholder="Company address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-input-background border-input text-foreground placeholder:text-muted-foreground min-h-[80px]"
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="jamestown"
                checked={formData.jamestown}
                onCheckedChange={(checked) => setFormData({ ...formData, jamestown: !!checked })}
              />
              <Label htmlFor="jamestown" className="text-foreground cursor-pointer">
                Jamestown BPU
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="orangeburg"
                checked={formData.orangeburg}
                onCheckedChange={(checked) => setFormData({ ...formData, orangeburg: !!checked })}
              />
              <Label htmlFor="orangeburg" className="text-foreground cursor-pointer">
                Orangeburg Fiber
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="fiberco"
                checked={formData.fiberco}
                onCheckedChange={(checked) => setFormData({ ...formData, fiberco: !!checked })}
              />
              <Label htmlFor="fiberco" className="text-foreground cursor-pointer">
                FiberCo Networks
              </Label>
            </div>
          </div>
        </ModalSection>

        {/* Services Configuration */}
        <ModalSection
          title="Services Configuration"
          description="Enable services this vendor can perform"
          showDivider
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="installationEnabled"
                checked={formData.installationEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, installationEnabled: !!checked })}
              />
              <div>
                <Label htmlFor="installationEnabled" className="text-foreground cursor-pointer font-medium">
                  Installation Services
                </Label>
                <p className="text-xs text-muted-foreground">Allow this vendor to perform network installations</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="salesEnabled"
                checked={formData.salesEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, salesEnabled: !!checked })}
              />
              <div>
                <Label htmlFor="salesEnabled" className="text-foreground cursor-pointer font-medium">
                  Sales Services
                </Label>
                <p className="text-xs text-muted-foreground">Allow this vendor to manage sales activities</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="supportEnabled"
                checked={formData.supportEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, supportEnabled: !!checked })}
              />
              <div>
                <Label htmlFor="supportEnabled" className="text-foreground cursor-pointer font-medium">
                  Support Services
                </Label>
                <p className="text-xs text-muted-foreground">Allow this vendor to provide customer support</p>
              </div>
            </div>
          </div>
        </ModalSection>

        {/* Status & Additional Information */}
        <ModalSection
          title="Status & Additional Information"
          description="Vendor status and notes"
          showDivider
        >
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
            />
            <Label htmlFor="isActive" className="text-foreground cursor-pointer">
              Active Vendor
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or special instructions for this vendor"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-input-background border-input text-foreground placeholder:text-muted-foreground min-h-[100px]"
            />
          </div>
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
