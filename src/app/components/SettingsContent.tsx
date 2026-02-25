import { FileText, Network, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

interface SettingsContentProps {
  onNavigate: (section: string) => void;
}

export function SettingsContent({ onNavigate }: SettingsContentProps) {
  const settingsSections = [
    {
      id: 'vendors',
      title: 'Vendor Management',
      description: 'Manage vendor relationships, contracts, and partner operations',
      icon: FileText,
      iconColor: '#FF6B35',
    },
    {
      id: 'networks',
      title: 'Network Management',
      description: 'Configure network infrastructure and manage system networks',
      icon: Network,
      iconColor: '#147FFF',
    },
    {
      id: 'automated-services',
      title: 'Automated Services',
      description: 'Configure billing service schedules, batch sizes, and automation parameters',
      icon: Settings,
      iconColor: '#A855F7',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-[#F8FAFC]">Application Settings</h1>
        <p className="text-[#94A3B8]">Configure and manage your application settings and administrative tools.</p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.id} className="bg-[#020817] border-[#1E293B] hover:border-[#147FFF] transition-colors">
              <CardHeader className="space-y-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${section.iconColor}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: section.iconColor }} />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-[#F8FAFC]">{section.title}</CardTitle>
                  <CardDescription className="text-[#94A3B8] text-sm">
                    {section.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => onNavigate(section.id)}
                  className="w-full bg-white text-[#020817] hover:bg-[#F8FAFC]"
                >
                  Configure →
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="bg-[#0F172A] border-[#1E293B] mt-8">
        <CardContent className="py-8 text-center">
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">Need Help with Settings?</h3>
          <p className="text-[#94A3B8] text-sm">
            If you need access to additional administrative settings or have questions about configuration, please contact your system administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
