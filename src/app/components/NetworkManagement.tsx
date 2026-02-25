import { useState } from 'react';
import { Network as NetworkIcon, Edit, Trash2, Plus, EyeOff, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { AddNetworkModal } from '@/app/components/AddNetworkModal';

interface NetworkFeature {
  id: string;
  label: string;
  enabled: boolean;
}

interface Network {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  networkId: string;
  location: string;
  features: NetworkFeature[];
}

const mockNetworks: Network[] = [
  {
    id: '1',
    name: 'Jamestown BPU',
    status: 'Active',
    networkId: 'jamestown_bpu',
    location: 'Jamestown, IN',
    features: [
      { id: 'contracts', label: 'Has Contracts', enabled: true },
      { id: 'onboarding', label: 'Has Onboarding', enabled: true },
      { id: 'dynamic-plans', label: 'Use Dynamic Plans', enabled: true },
      { id: 'inquiry-collect', label: 'Inquiry Collect Fields', enabled: true },
      { id: 'commitment-notice', label: 'Show Commitment Notice', enabled: true },
      { id: 'future-service', label: 'Future Service Behavior', enabled: true },
      { id: 'uses-verification', label: 'Enable Uses Verification', enabled: true },
      { id: 'signup-stepper', label: 'Show Signup Stepper Icons', enabled: true },
      { id: 'installation-requests', label: 'Has Installation Requests', enabled: true },
      { id: 'service-subscriptions', label: 'Has Service Subscriptions', enabled: true },
      { id: 'address-completion', label: 'Address Completion Enabled', enabled: true },
      { id: 'inquiry-availability', label: 'Collect Inquiry At Availability Check', enabled: true },
    ],
  },
  {
    id: '2',
    name: 'Orangeburg Fiber',
    status: 'Active',
    networkId: 'subscribers',
    location: 'Orangeburg, SC',
    features: [
      { id: 'contracts', label: 'Has Contracts', enabled: true },
      { id: 'onboarding', label: 'Has Onboarding', enabled: true },
      { id: 'dynamic-plans', label: 'Use Dynamic Plans', enabled: true },
      { id: 'inquiry-collect', label: 'Inquiry Collect Fields', enabled: true },
      { id: 'commitment-notice', label: 'Show Commitment Notice', enabled: true },
      { id: 'future-service', label: 'Future Service Behavior', enabled: true },
      { id: 'uses-verification', label: 'Enable Uses Verification', enabled: true },
      { id: 'signup-stepper', label: 'Show Signup Stepper Icons', enabled: true },
      { id: 'installation-requests', label: 'Has Installation Requests', enabled: true },
      { id: 'service-subscriptions', label: 'Has Service Subscriptions', enabled: true },
      { id: 'address-completion', label: 'Address Completion Enabled', enabled: true },
      { id: 'inquiry-availability', label: 'Collect Inquiry At Availability Check', enabled: true },
    ],
  },
];

interface NetworkManagementProps {
  onNavigateBack: () => void;
}

export function NetworkManagement({ onNavigateBack }: NetworkManagementProps) {
  const [networks] = useState<Network[]>(mockNetworks);
  const [isAddNetworkModalOpen, setIsAddNetworkModalOpen] = useState(false);

  const getEnabledCount = (features: NetworkFeature[]) => {
    return features.filter(f => f.enabled).length;
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
          <h1 className="text-2xl md:text-3xl font-bold text-[#F8FAFC]">Network Management</h1>
          <p className="text-[#94A3B8]">Manage your organization's networks and configurations</p>
        </div>
        <Button
          className="bg-[#147FFF] hover:bg-[#1066CC] text-white"
          onClick={() => setIsAddNetworkModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Network
        </Button>
      </div>

      {/* Network Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {networks.map((network) => (
          <Card key={network.id} className="bg-[#020817] border-[#1E293B] hover:border-[#147FFF]/50 transition-colors">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#F8FAFC]">{network.name}</h3>
                    <Badge className="bg-[#21DB00]/20 text-[#21DB00] border-[#21DB00]/30" variant="outline">
                      {network.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-[#94A3B8]">
                    <div className="flex items-center gap-2">
                      <NetworkIcon className="w-4 h-4" />
                      <span>{network.networkId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 flex items-center justify-center">📍</span>
                      <span>{network.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#94A3B8]"
                  >
                    <EyeOff className="w-4 h-4" />
                  </Button>
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
              {/* Features Summary */}
              <div className="pb-2">
                <div className="text-xs font-medium text-[#F8FAFC] mb-3">
                  Features ({getEnabledCount(network.features)}/{network.features.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {network.features.map((feature) => (
                    <Badge
                      key={feature.id}
                      variant="secondary"
                      className={
                        feature.enabled
                          ? 'bg-[#1E293B] text-[#F8FAFC] text-xs border-none'
                          : 'bg-[#0F172A] text-[#64748B] text-xs border-none opacity-50'
                      }
                    >
                      {feature.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Network Modal */}
      <AddNetworkModal
        open={isAddNetworkModalOpen}
        onOpenChange={setIsAddNetworkModalOpen}
      />
    </div>
  );
}