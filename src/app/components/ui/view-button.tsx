import { Eye } from 'lucide-react';

interface ViewButtonProps {
  onClick?: () => void;
  className?: string;
}

export function ViewButton({ onClick, className = '' }: ViewButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#F8FAFC] text-sm hover:bg-[#1E293B] transition-colors ${className}`}
    >
      <Eye className="w-4 h-4" />
      <span>View</span>
    </button>
  );
}
