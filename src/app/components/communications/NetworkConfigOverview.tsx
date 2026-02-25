import { Mail, Phone, MapPin, Calendar, TestTube } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';

export function NetworkConfigOverview() {
  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div>
        <h2 className="text-xl font-semibold text-[#F8FAFC] mb-2">Orangeburg Fiber Configuration Status</h2>
        <p className="text-sm text-[#94A3B8]">Email configuration status for Orangeburg Fiber</p>
      </div>

      {/* Configuration Status Card */}
      <Card className="bg-[#0F172A] border-[#1E293B] p-6 max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#147FFF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OF</span>
            </div>
            <div>
              <p className="text-base font-semibold text-[#F8FAFC]">Orangeburg Fiber</p>
              <p className="text-sm text-[#94A3B8]">Email configuration for this network</p>
            </div>
          </div>
          <Badge className="bg-[#10B981] text-white">
            <div className="w-2 h-2 bg-white rounded-full mr-2" />
            Active
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Support Email */}
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#94A3B8] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#64748B] mb-1">Support Email</p>
              <p className="text-sm font-medium text-[#F8FAFC]">help@orangeburgfiber.net</p>
            </div>
          </div>

          {/* Support Phone */}
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[#94A3B8] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#64748B] mb-1">Support Phone</p>
              <p className="text-sm font-medium text-[#F8FAFC]">803-973-0430</p>
            </div>
          </div>

          {/* Company Address */}
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#94A3B8] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#64748B] mb-1">Company Address</p>
              <p className="text-sm font-medium text-[#F8FAFC]">1949 West Printer's Row, Salt Lake City, UT 84119</p>
            </div>
          </div>

          {/* From Domain */}
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#94A3B8] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#64748B] mb-1">From Domain</p>
              <p className="text-sm font-medium text-[#F8FAFC]">orangeburgfiber.net</p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-[#94A3B8] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-[#64748B] mb-1">Last Updated</p>
              <p className="text-sm font-medium text-[#F8FAFC]">Nov 10, 2025, 4:03 PM</p>
            </div>
          </div>
        </div>

        {/* Test Button */}
        <div className="mt-6 pt-6 border-t border-[#1E293B]">
          <Button variant="outline" className="w-full border-[#1E293B] text-[#F8FAFC] hover:bg-[#1E293B]">
            <TestTube className="w-4 h-4 mr-2" />
            Test
          </Button>
        </div>
      </Card>
    </div>
  );
}
