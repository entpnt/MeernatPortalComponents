import { useState } from 'react';
import { 
  Mail, 
  RefreshCw, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { DataTable, Column } from '@/app/components/DataTable';

const mockLeads = [
  { id: 'OF-2025-848729', address: '3111 LANDING WAY, ORANGEBURG, SC 29118', name: 'W. Spencer Davis', email: 'wsdsvis@ymail.com', phone: '+12029573631', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-845149', address: '103 CHOCO PALM CT, ORANGEBURG, SC 29118', name: 'Stephon Edwards II', email: 'dlhrfm12@gmail.com', phone: '+18034771558', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-882768', address: '1638 ENDERLY ST, ORANGEBURG, SC 29118', name: 'Felton Glaze', email: 'flexoglaze3@gmail.com', phone: '+18039287523', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-146162', address: '1360 ESSEX DR, ORANGEBURG, SC 29118', name: 'Pam Cox', email: 'pamcox69@gmail.com', phone: '+18392397788', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-185738', address: '208 BETTER LIVING CT, ORANGEBURG, SC 29118', name: 'Cherelle Washington', email: 'cherellewashing@yahoo.com', phone: '+13473752344', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-231988', address: '340 LIVINGSTON TER, ORANGEBURG, SC 29118', name: 'Jerry Cobb', email: 'jerrycobb1865@gmail.com', phone: '+17046174544', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-236189', address: '765 COLEMAN AVE, ORANGEBURG, SC 29115', name: 'Kedrick Burke', email: 'dj.mixmaster1210@yahoo.com', phone: '+18032906683', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-458748', address: '340 LIVINGSTON TER, ORANGEBURG, SC 29118', name: 'Jerry Cobb', email: 'jerrycobb1865@gmail.com', phone: '+18647879252', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-488759', address: '1430 HIDDEN VALLEY DR, ORANGEBURG, SC 29118', name: 'SAMUEL SIMPSON', email: 'simpsontt803@gmail.com', phone: '+18037600736', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-563256', address: '139 POPLAR ST, ORANGEBURG, SC 29118', name: 'Saiara Darby', email: 'saiarad@yahoo.com', phone: '+18038601003', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-667417', address: '1827 ENDERLY ST, ORANGEBURG, SC 29118', name: 'Junior Kelly', email: 'jkelly@gmail.com', phone: '+18037596865', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-708846', address: '208 BETTER LIVING CT, ORANGEBURG, SC 29118', name: 'Cherelle Washington', email: 'cherellewashington13@gmail.com', phone: '+13473752345', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-831811', address: '1386 LARTIGUE DR, ORANGEBURG, SC 29118', name: 'Milhouse Theo', email: 'theom368@gmail.com', phone: '+18034774606', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-848884', address: '1238 NELSON ST, ORANGEBURG, SC 29118', name: 'Dominique Nelson', email: 'leenyniles@gmail.com', phone: '+18398904595', status: 'Completed', signupStatus: 'planned' },
  { id: 'OF-2025-904178', address: '2490 LONGWOOD DR, ORANGEBURG, SC 29118', name: 'LAKISHA Brown Crawford', email: 'browncrawfordlakisha@yahoo.com', phone: '+18434607939', status: 'Completed', signupStatus: 'planned' },
];

interface ReadyAddressesProps {
  onNavigate?: (section: string) => void;
}

export function ReadyAddresses({ onNavigate }: ReadyAddressesProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'checkbox',
      label: '',
      visible: true,
      sortable: false,
      cellRenderer: (value, row) => (
        <Checkbox
          checked={false}
          className="border-[var(--border)]"
        />
      ),
    },
    { id: 'id', label: 'Account ID', visible: true },
    { id: 'address', label: 'Address', visible: true },
    { id: 'name', label: 'Name', visible: true },
    { id: 'email', label: 'Email', visible: true },
    { id: 'phone', label: 'Phone', visible: true },
    { id: 'status', label: 'Current Status', visible: true },
    { 
      id: 'signupStatus', 
      label: 'Signup Status', 
      visible: true,
      cellRenderer: (value) => <span className="text-[var(--muted-foreground)]">{value}</span>
    },
  ]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(mockLeads.map(lead => lead.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Ready Address Channel
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Target leads who signed up during service planning. Service is now available, but they haven't scheduled installation. • Orangeburg Fiber
          </p>
        </div>
        <Button variant="outline" size="sm" className="border-[var(--border)] bg-[var(--card)]">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="bg-[var(--card)] border-[var(--border)] p-4">
        <div className="flex gap-3 text-sm text-[var(--muted-foreground)]">
          <div className="w-5 h-5 rounded-full border-2 border-[#147FFF] flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-1.5 h-1.5 bg-[#147FFF] rounded-full" />
          </div>
          <p>
            <strong className="text-[var(--foreground)]">Ready Addresses:</strong> These leads created accounts when service was "Planned" (unavailable), but service is now "Completed" (available) in their area. They haven't scheduled installation yet—a prime conversion opportunity. Select leads, choose a communication template, and launch your campaign.
          </p>
        </div>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[var(--card)] border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-[var(--muted-foreground)]" />
            <h3 className="text-sm text-[var(--muted-foreground)]">Total Leads</h3>
          </div>
          <div className="text-4xl font-bold text-[var(--foreground)] mb-1">15</div>
          <p className="text-sm text-[var(--muted-foreground)]">Ready for conversion</p>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 rounded-full border-2 border-[#147FFF] flex items-center justify-center">
              <div className="w-2 h-2 bg-[#147FFF] rounded-full" />
            </div>
            <h3 className="text-sm text-[var(--muted-foreground)]">Selected</h3>
          </div>
          <div className="text-4xl font-bold text-[var(--foreground)] mb-1">{selectedLeads.length}</div>
          <p className="text-sm text-[var(--muted-foreground)]">Ready for campaign</p>
        </Card>

        <Card className="bg-[var(--card)] border-[var(--border)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-[var(--muted-foreground)]" />
            <h3 className="text-sm text-[var(--muted-foreground)]">Communication Type</h3>
          </div>
          <div className="text-base font-medium text-[var(--foreground)] mb-1">Select communication type</div>
          <p className="text-sm text-[var(--muted-foreground)]">Select a type to see templates</p>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <DataTable
          data={mockLeads}
          columns={columns}
          onColumnsChange={setColumns}
        />
      </Card>
    </div>
  );
}
