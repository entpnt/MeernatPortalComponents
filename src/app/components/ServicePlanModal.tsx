import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
import { Button } from '@/app/components/ui/button';

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

interface ServicePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ServicePlan | null;
  isEditMode: boolean;
}

export function ServicePlanModal({ isOpen, onClose, plan, isEditMode }: ServicePlanModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'fcc-label'>('basic');
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    description: plan?.description || '',
    downloadSpeed: plan?.downloadSpeed || '',
    uploadSpeed: plan?.uploadSpeed || '',
    serviceType: plan?.serviceType || 'Residential',
    dataCapType: plan?.dataCapType || 'Unlimited',
    dataCap: plan?.dataCap || '',
    price: plan?.price || 0,
    billingFrequency: plan?.billingFrequency || 'Monthly',
    networks: plan?.networks || [],
    status: plan?.status || 'Active',
  });

  const [fccData, setFccData] = useState({
    providerName: 'Orangeburg Fiber',
    hasIntroductoryRate: false,
    introductoryMonths: '',
    priceAfterIntroductory: '',
    contractLength: '',
    termsOfContractUrl: '',
    // Provider Monthly Fees
    providerFees: [{ description: '', amount: '' }],
    // One-Time Purchase Fees
    oneTimeFees: [{ description: '', amount: '' }],
    earlyTerminationFee: '',
    governmentTaxes: 'Varies by Location',
    governmentTaxesAmount: '',
    // Discounts & Bundles
    discountsDescription: '',
    discountsUrl: '',
    // Speeds
    typicalDownloadSpeed: '',
    typicalUploadSpeed: '',
    typicalLatency: '',
    // Data
    dataIncluded: '',
    additionalDataCharges: '',
    dataUsageUrl: '',
    // Policies
    networkManagementUrl: '',
    privacyPolicyUrl: '',
    // Customer Support
    supportPhone: '',
    supportWebsite: '',
  });

  const addProviderFee = () => {
    setFccData({
      ...fccData,
      providerFees: [...fccData.providerFees, { description: '', amount: '' }],
    });
  };

  const removeProviderFee = (index: number) => {
    setFccData({
      ...fccData,
      providerFees: fccData.providerFees.filter((_, i) => i !== index),
    });
  };

  const updateProviderFee = (index: number, field: 'description' | 'amount', value: string) => {
    const updatedFees = [...fccData.providerFees];
    updatedFees[index][field] = value;
    setFccData({ ...fccData, providerFees: updatedFees });
  };

  const addOneTimeFee = () => {
    setFccData({
      ...fccData,
      oneTimeFees: [...fccData.oneTimeFees, { description: '', amount: '' }],
    });
  };

  const removeOneTimeFee = (index: number) => {
    setFccData({
      ...fccData,
      oneTimeFees: fccData.oneTimeFees.filter((_, i) => i !== index),
    });
  };

  const updateOneTimeFee = (index: number, field: 'description' | 'amount', value: string) => {
    const updatedFees = [...fccData.oneTimeFees];
    updatedFees[index][field] = value;
    setFccData({ ...fccData, oneTimeFees: updatedFees });
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title={isEditMode ? 'Edit Service Plan' : 'Create Service Plan'}
      maxWidth="4xl"
    >
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basic' | 'fcc-label')}>
        <TabsList className="bg-[var(--muted)] mb-6">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="fcc-label">FCC Broadband Label</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6 mt-0">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name *</Label>
                <Input
                  id="plan-name"
                  placeholder="e.g., Fiber 1000"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-type">Service Type *</Label>
                <Select value={formData.serviceType} onValueChange={(value) => setFormData({ ...formData, serviceType: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the plan features and benefits"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Speed Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Speed Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="download-speed">Download Speed *</Label>
                <Input
                  id="download-speed"
                  placeholder="e.g., 1000 Mbps"
                  value={formData.downloadSpeed}
                  onChange={(e) => setFormData({ ...formData, downloadSpeed: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-speed">Upload Speed *</Label>
                <Input
                  id="upload-speed"
                  placeholder="e.g., 1000 Mbps"
                  value={formData.uploadSpeed}
                  onChange={(e) => setFormData({ ...formData, uploadSpeed: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Data Cap Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Data Cap</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data-cap-type">Data Cap Type *</Label>
                <Select value={formData.dataCapType} onValueChange={(value) => setFormData({ ...formData, dataCapType: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unlimited">Unlimited</SelectItem>
                    <SelectItem value="Capped">Capped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.dataCapType === 'Capped' && (
                <div className="space-y-2">
                  <Label htmlFor="data-cap">Data Cap Limit</Label>
                  <Input
                    id="data-cap"
                    placeholder="e.g., 1 TB"
                    value={formData.dataCap}
                    onChange={(e) => setFormData({ ...formData, dataCap: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing-frequency">Billing Frequency *</Label>
                <Select value={formData.billingFrequency} onValueChange={(value) => setFormData({ ...formData, billingFrequency: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Network Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Network Assignment</h3>
            <div className="space-y-3">
              <p className="text-sm text-[var(--muted-foreground)]">
                Select which network(s) this plan applies to. This ensures proper provisioning and prevents cross-network conflicts.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch id="network-orangeburg" />
                  <Label htmlFor="network-orangeburg" className="cursor-pointer">Orangeburg Fiber</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="network-jamestown" />
                  <Label htmlFor="network-jamestown" className="cursor-pointer">Jamestown BPU</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Status</h3>
            <div className="flex items-center gap-2">
              <Switch 
                id="plan-status" 
                checked={formData.status === 'Active'}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'Active' : 'Inactive' })}
              />
              <Label htmlFor="plan-status" className="cursor-pointer">
                {formData.status === 'Active' ? 'Plan is Active' : 'Plan is Inactive'}
              </Label>
            </div>
          </div>
        </TabsContent>

        {/* FCC Broadband Label Tab */}
        <TabsContent value="fcc-label" className="space-y-6 mt-0">
          {/* Provider & Plan Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Provider & Plan Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider-name">Provider Name *</Label>
                <Input
                  id="provider-name"
                  value={fccData.providerName}
                  onChange={(e) => setFccData({ ...fccData, providerName: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Monthly Price Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Monthly Price</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch 
                  id="has-intro-rate"
                  checked={fccData.hasIntroductoryRate}
                  onCheckedChange={(checked) => setFccData({ ...fccData, hasIntroductoryRate: checked })}
                />
                <Label htmlFor="has-intro-rate" className="cursor-pointer">
                  This monthly price is an introductory rate
                </Label>
              </div>
              {fccData.hasIntroductoryRate && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="intro-months">Time Introductory Rate Applies</Label>
                    <Input
                      id="intro-months"
                      placeholder="e.g., 12 months"
                      value={fccData.introductoryMonths}
                      onChange={(e) => setFccData({ ...fccData, introductoryMonths: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price-after-intro">Price After Introductory Rate</Label>
                    <Input
                      id="price-after-intro"
                      type="number"
                      placeholder="0.00"
                      value={fccData.priceAfterIntroductory}
                      onChange={(e) => setFccData({ ...fccData, priceAfterIntroductory: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract-length">Length of Contract</Label>
                    <Input
                      id="contract-length"
                      placeholder="e.g., 24 months"
                      value={fccData.contractLength}
                      onChange={(e) => setFccData({ ...fccData, contractLength: e.target.value })}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="terms-url">Link to Terms of Contract</Label>
                <Input
                  id="terms-url"
                  placeholder="https://www.example.com/terms-of-contract"
                  value={fccData.termsOfContractUrl}
                  onChange={(e) => setFccData({ ...fccData, termsOfContractUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Additional Charges & Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Additional Charges & Terms</h3>
            
            {/* Provider Monthly Fees */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Provider Monthly Fees</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProviderFee}
                  className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Fee
                </Button>
              </div>
              {fccData.providerFees.map((fee, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Fee description"
                    value={fee.description}
                    onChange={(e) => updateProviderFee(index, 'description', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="$0.00"
                    value={fee.amount}
                    onChange={(e) => updateProviderFee(index, 'amount', e.target.value)}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProviderFee(index)}
                    className="text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* One-Time Purchase Fees */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>One-Time Purchase Fees</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOneTimeFee}
                  className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Fee
                </Button>
              </div>
              {fccData.oneTimeFees.map((fee, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Fee description"
                    value={fee.description}
                    onChange={(e) => updateOneTimeFee(index, 'description', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="$0.00"
                    value={fee.amount}
                    onChange={(e) => updateOneTimeFee(index, 'amount', e.target.value)}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOneTimeFee(index)}
                    className="text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Other Fees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="early-termination">Early Termination Fee</Label>
                <Input
                  id="early-termination"
                  placeholder="$0.00"
                  value={fccData.earlyTerminationFee}
                  onChange={(e) => setFccData({ ...fccData, earlyTerminationFee: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gov-taxes">Government Taxes</Label>
                <div className="flex gap-2">
                  <Select 
                    value={fccData.governmentTaxes} 
                    onValueChange={(value) => setFccData({ ...fccData, governmentTaxes: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Included">Included</SelectItem>
                      <SelectItem value="Varies by Location">Varies by Location</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="$0.00"
                    value={fccData.governmentTaxesAmount}
                    onChange={(e) => setFccData({ ...fccData, governmentTaxesAmount: e.target.value })}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Discounts & Bundles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Discounts & Bundles</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discounts-desc">Description</Label>
                <Textarea
                  id="discounts-desc"
                  placeholder="Visit the link below for available billing discounts and pricing options..."
                  value={fccData.discountsDescription}
                  onChange={(e) => setFccData({ ...fccData, discountsDescription: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discounts-url">Link to Discounts Information</Label>
                <Input
                  id="discounts-url"
                  placeholder="https://www.example.com/discounts"
                  value={fccData.discountsUrl}
                  onChange={(e) => setFccData({ ...fccData, discountsUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Speeds Provided with Plan */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Speeds Provided with Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typical-download">Typical Download Speed (Mbps)</Label>
                <Input
                  id="typical-download"
                  type="number"
                  placeholder="1000"
                  value={fccData.typicalDownloadSpeed}
                  onChange={(e) => setFccData({ ...fccData, typicalDownloadSpeed: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="typical-upload">Typical Upload Speed (Mbps)</Label>
                <Input
                  id="typical-upload"
                  type="number"
                  placeholder="1000"
                  value={fccData.typicalUploadSpeed}
                  onChange={(e) => setFccData({ ...fccData, typicalUploadSpeed: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="typical-latency">Typical Latency (ms)</Label>
                <Input
                  id="typical-latency"
                  type="number"
                  placeholder="10"
                  value={fccData.typicalLatency}
                  onChange={(e) => setFccData({ ...fccData, typicalLatency: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Data Included with Monthly Price */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Data Included with Monthly Price</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data-included">Data Included (GB)</Label>
                <Input
                  id="data-included"
                  placeholder="e.g., 1000 or Unlimited"
                  value={fccData.dataIncluded}
                  onChange={(e) => setFccData({ ...fccData, dataIncluded: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additional-data">Charges for Additional Data Usage</Label>
                <Input
                  id="additional-data"
                  placeholder="e.g., $10/GB"
                  value={fccData.additionalDataCharges}
                  onChange={(e) => setFccData({ ...fccData, additionalDataCharges: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-usage-url">Link to Data Usage Information</Label>
              <Input
                id="data-usage-url"
                placeholder="https://www.example.com/data-usage"
                value={fccData.dataUsageUrl}
                onChange={(e) => setFccData({ ...fccData, dataUsageUrl: e.target.value })}
              />
            </div>
          </div>

          {/* Network Management & Privacy Policy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Policies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="network-mgmt-url">Network Management Policy URL</Label>
                <Input
                  id="network-mgmt-url"
                  placeholder="https://www.example.com/network-management"
                  value={fccData.networkManagementUrl}
                  onChange={(e) => setFccData({ ...fccData, networkManagementUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="privacy-url">Privacy Policy URL</Label>
                <Input
                  id="privacy-url"
                  placeholder="https://www.example.com/privacy"
                  value={fccData.privacyPolicyUrl}
                  onChange={(e) => setFccData({ ...fccData, privacyPolicyUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Customer Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="support-phone">Phone</Label>
                <Input
                  id="support-phone"
                  placeholder="(555) 555-5555"
                  value={fccData.supportPhone}
                  onChange={(e) => setFccData({ ...fccData, supportPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-website">Website</Label>
                <Input
                  id="support-website"
                  placeholder="https://www.example.com"
                  value={fccData.supportWebsite}
                  onChange={(e) => setFccData({ ...fccData, supportWebsite: e.target.value })}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)] mt-6">
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
            {isEditMode ? 'Save Changes' : 'Create Plan'}
          </Button>
        </div>
      </Tabs>
    </Modal>
  );
}
