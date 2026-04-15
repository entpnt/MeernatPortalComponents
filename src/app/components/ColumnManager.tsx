import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Switch } from '@/app/components/ui/switch';
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
      className={`flex items-center gap-3 py-3 px-2 border-b border-[var(--border)] cursor-pointer transition-colors ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <GripVertical className="w-4 h-4 text-[var(--muted-foreground)] cursor-grab active:cursor-grabbing flex-shrink-0" />
      <span className="flex-1 text-sm text-[var(--foreground)] font-medium">{column.label}</span>
      <span className="text-xs text-[var(--muted-foreground)] uppercase mr-2">Text</span>
      <Switch
        checked={column.visible}
        onCheckedChange={() => toggleColumn(column.id)}
      />
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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
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
    </div>
  );
}