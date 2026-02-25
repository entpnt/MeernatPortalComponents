import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  titleAction?: ReactNode;
}

interface ModalSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  showDivider?: boolean;
}

interface ModalActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  cancelText?: string;
  submitText?: string;
  submitType?: 'button' | 'submit';
  showDivider?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

export function Modal({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  maxWidth = '3xl',
  titleAction
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] ${maxWidthClasses[maxWidth]} max-h-[90vh] flex flex-col`}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-4 pr-8">
            <DialogTitle className="text-2xl flex-1">{title}</DialogTitle>
            {titleAction && <div className="flex-shrink-0">{titleAction}</div>}
          </div>
          {description && (
            <DialogDescription className="text-[var(--muted-foreground)]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-6 mt-4 overflow-y-auto flex-1 min-h-0 px-1">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ModalSection({ 
  title, 
  description, 
  children, 
  showDivider = false 
}: ModalSectionProps) {
  return (
    <div className={`space-y-4 ${showDivider ? 'pt-4 border-t border-[var(--border)]' : ''}`}>
      <div>
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function ModalActions({ 
  onCancel, 
  onSubmit, 
  cancelText = 'Cancel', 
  submitText = 'Submit',
  submitType = 'submit',
  showDivider = true 
}: ModalActionsProps) {
  return (
    <div className={`flex justify-end gap-3 ${showDivider ? 'pt-4 border-t border-[var(--border)]' : 'pt-2'}`}>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
      >
        {cancelText}
      </Button>
      <Button
        type={submitType}
        onClick={onSubmit}
        className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
      >
        {submitText}
      </Button>
    </div>
  );
}

interface ModalInfoBoxProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function ModalInfoBox({ title, description, icon }: ModalInfoBoxProps) {
  return (
    <div className="bg-[var(--muted)]/30 border border-[var(--border)] rounded-lg p-4 flex gap-3">
      {icon && (
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
      )}
      <div>
        <h4 className="font-semibold text-[var(--foreground)] mb-1">{title}</h4>
        <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
      </div>
    </div>
  );
}