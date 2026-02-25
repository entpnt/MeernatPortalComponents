import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface DraggableColumnItemProps {
  column: Column;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  toggleColumn: (id: string) => void;
}

const ITEM_TYPE = 'column';

function DraggableColumnItem({ column, index, moveColumn, toggleColumn }: DraggableColumnItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: () => {
      return { id: column.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-[#1E293B] cursor-pointer transition-colors ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <GripVertical className="w-4 h-4 text-[#64748B] cursor-grab active:cursor-grabbing" />
      <Checkbox
        checked={column.visible}
        onCheckedChange={() => toggleColumn(column.id)}
        className="border-[#475569] data-[state=checked]:bg-[#147FFF] data-[state=checked]:border-[#147FFF]"
      />
      <span className="flex-1 text-sm text-[#E2E8F0]">{column.label}</span>
      {column.visible ? (
        <Eye className="w-4 h-4 text-[#147FFF]" />
      ) : (
        <EyeOff className="w-4 h-4 text-[#64748B]" />
      )}
    </div>
  );
}

interface ColumnManagerProps {
  columns: Column[];
  onColumnsChange: (columns: Column[]) => void;
}

export function ColumnManager({ columns, onColumnsChange }: ColumnManagerProps) {
  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    const newColumns = [...columns];
    const draggedColumn = newColumns[dragIndex];
    newColumns.splice(dragIndex, 1);
    newColumns.splice(hoverIndex, 0, draggedColumn);
    onColumnsChange(newColumns);
  };

  const toggleColumn = (id: string) => {
    const newColumns = columns.map((col) =>
      col.id === id ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(newColumns);
  };

  const showAll = () => {
    onColumnsChange(columns.map((col) => ({ ...col, visible: true })));
  };

  const hideAll = () => {
    onColumnsChange(columns.map((col) => ({ ...col, visible: false })));
  };

  return (
    <div className="w-80 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1">Customize Columns</h3>
        <p className="text-xs text-[#94A3B8]">
          Drag to reorder • Click checkbox to show/hide
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={showAll}
          className="flex-1 px-3 py-1.5 text-xs bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] rounded transition-colors"
        >
          Show All
        </button>
        <button
          onClick={hideAll}
          className="flex-1 px-3 py-1.5 text-xs bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] rounded transition-colors"
        >
          Hide All
        </button>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {columns.map((column, index) => (
          <DraggableColumnItem
            key={column.id}
            column={column}
            index={index}
            moveColumn={moveColumn}
            toggleColumn={toggleColumn}
          />
        ))}
      </div>

      <div className="pt-3 border-t border-[#1E293B]">
        <p className="text-xs text-[#64748B]">
          {columns.filter((col) => col.visible).length} of {columns.length} columns visible
        </p>
      </div>
    </div>
  );
}
