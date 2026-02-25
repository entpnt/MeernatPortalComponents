import { Inbox } from 'lucide-react';
import { BillingLayout } from '@/app/components/BillingLayout';
import { Card } from '@/app/components/ui/card';

interface ManualReviewProps {
  onNavigate?: (section: string) => void;
}

export function ManualReview({ onNavigate }: ManualReviewProps) {
  return (
    <BillingLayout activeTab="manual-review" onNavigate={onNavigate}>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Manual Review Queue
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Billing items requiring investigation and manual intervention
        </p>
      </div>

      {/* Empty State */}
      <Card className="bg-[var(--card)] border-[var(--border)] p-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-[var(--secondary)] rounded-full p-6 mb-6">
            <Inbox className="w-12 h-12 text-[var(--muted-foreground)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
            No items in manual review queue
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-md">
            There are no items requiring manual review. All billing items are
            being processed automatically.
          </p>
        </div>
      </Card>

      {/* Note */}
      <div className="mt-6 bg-[var(--secondary)] border border-[var(--border)] rounded-lg p-4">
        <p className="text-sm text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--foreground)]">Note:</span> Manual
          review is an investigation queue (NOT an automatic retry queue). After
          investigating and fixing issues externally (Stripe dashboard,
          subscriber profile, etc.), mark items as resolved with notes
          documenting what you did.
        </p>
      </div>
    </BillingLayout>
  );
}

export default ManualReview;
