import { Search, ChevronDown, MapPin, Clock, Sun, Moon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemePreview } from '@/contexts/ThemePreviewContext';

interface TopBarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function TopBar({ activeSection, onSectionChange }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { activeTheme, isPreviewMode } = useThemePreview();
  
  return (
    <div className="h-16 bg-[var(--background)] border-b border-[var(--border)] flex items-center justify-between px-4 md:px-6 gap-4">
      {/* Search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search networks, devices, subscribers..."
              className="w-full bg-[var(--input-background)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[var(--secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]" />
          ) : (
            <Moon className="w-5 h-5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]" />
          )}
        </button>

        {/* Network Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-[var(--secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus)]">
            <MapPin className="w-4 h-4 text-[var(--muted-foreground)]" />
            <span className="text-sm text-[var(--foreground)] hidden sm:inline">Orangeburg Fiber</span>
            <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--popover)] border-[var(--border)]">
            <DropdownMenuItem className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer">
              All Networks
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer">
              Jamestown BPU
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer">
              Orangeburg Fiber
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-[var(--focus)] rounded-full">
            <Avatar className="w-8 h-8 border border-[var(--border)]">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[var(--btn-primary-default)] text-[var(--primary-foreground)] text-sm">AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--popover)] border-[var(--border)]">
            <DropdownMenuItem className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[var(--foreground)] focus:bg-[var(--secondary)] cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}