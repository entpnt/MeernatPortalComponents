import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/app/components/ui/sheet';
import { Sidebar } from '@/app/components/Sidebar';

interface MobileMenuProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function MobileMenu({ activeSection, onSectionChange }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 rounded-lg hover:bg-[#1E293B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#147FFF]">
          <Menu className="w-6 h-6 text-[#F8FAFC]" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64 bg-[#020817] border-[#1E293B]">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={onSectionChange}
          isCollapsed={false}
          onToggleCollapse={() => {}}
        />
      </SheetContent>
    </Sheet>
  );
}
