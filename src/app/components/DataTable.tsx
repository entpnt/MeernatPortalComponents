import { useState, ReactNode } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { ColumnManager } from '@/app/components/ColumnManager';

export interface Column {
  id: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  cellRenderer?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onColumnsChange?: (columns: Column[]) => void;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showColumnManager?: boolean;
  showPagination?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
}

export function DataTable({
  columns,
  data,
  onColumnsChange,
  totalCount,
  currentPage = 1,
  pageSize = 50,
  onPageChange,
  onPageSizeChange,
  showColumnManager = true,
  showPagination = true,
  emptyMessage = 'No data available',
  onRowClick,
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const visibleColumns = columns.filter(col => col.visible);
  const total = totalCount || data.length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);
  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-[var(--success)] bg-[var(--success)]/10';
      case 'planned':
        return 'text-[#64748B] bg-[#64748B]/10';
      case 'pending':
        return 'text-[var(--warning)] bg-[var(--warning)]/10';
      case 'active':
        return 'text-[var(--success)] bg-[var(--success)]/10';
      case 'failed':
        return 'text-[var(--error)] bg-[var(--error)]/10';
      case 'sent':
        return 'text-[var(--success)] bg-[var(--success)]/10';
      case 'processing':
        return 'text-[var(--info)] bg-[var(--info)]/10';
      case 'cancelled':
      case 'suspended':
        return 'text-[var(--error)] bg-[var(--error)]/10';
      default:
        return 'text-[#64748B] bg-[#64748B]/10';
    }
  };

  const renderCellValue = (column: Column, row: any) => {
    const value = row[column.id];

    // Use custom renderer if provided
    if (column.cellRenderer) {
      return column.cellRenderer(value, row);
    }

    // Default rendering for common patterns
    if (column.id.toLowerCase().includes('status')) {
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      );
    }

    if (column.id.toLowerCase().includes('address') && typeof value === 'string' && value.length > 50) {
      return <div className="truncate max-w-xs">{value}</div>;
    }

    return value;
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[var(--border)] hover:bg-transparent">
              {visibleColumns.map(column => (
                <TableHead key={column.id} className="text-left py-3 px-4 text-xs font-medium text-[var(--muted-foreground)]">
                  {column.sortable !== false ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(column.id)}
                      className="h-auto p-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-transparent font-medium"
                    >
                      {column.label}
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  className="border-b border-[var(--border)] hover:bg-[var(--muted)]/40 transition-colors cursor-pointer"
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {visibleColumns.map(column => (
                    <TableCell key={column.id} className="py-3 px-4 text-sm text-[var(--foreground)]">
                      {renderCellValue(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={visibleColumns.length} 
                  className="py-8 text-center text-sm text-[var(--muted-foreground)]"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {showPagination && onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}