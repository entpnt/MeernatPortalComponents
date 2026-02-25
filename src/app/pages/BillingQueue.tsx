import { useState } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

const queueData = [
  {
    id: '1',
    name: 'DAXESH PATEL',
    address: '1137 DUNHAM ST, ORANGEBURG, SC 29118',
    amount: '$69.99',
    numericAmount: 69.99,
    billingDate: 'Jan 25, 2026',
    transactionDate: '2026-01-25',
    source: 'Archived',
    status: 'Completed',
    plan: '1GB/1GB',
    planType: 'Internet',
    paymentMethod: 'Credit Card ****5678',
    transactionId: 'TXN-2026-01-25-001',
  },
  {
    id: '2',
    name: 'Travis Bowman',
    address: '326 FAIR ST, ORANGEBURG, SC 29115',
    amount: '$59.99',
    numericAmount: 59.99,
    billingDate: 'Jan 25, 2026',
    transactionDate: '2026-01-25',
    source: 'Archived',
    status: 'Completed',
    plan: '500MB/500MB',
    planType: 'Internet',
    paymentMethod: 'Credit Card ****9012',
    transactionId: 'TXN-2026-01-25-002',
  },
  {
    id: '3',
    name: 'Barbara Brown',
    address: '255 WANNAMAKER ST, ORANGEBURG, SC 29115',
    amount: '$69.99',
    numericAmount: 69.99,
    billingDate: 'Jan 25, 2026',
    transactionDate: '2026-01-25',
    source: 'Archived',
    status: 'Completed',
    plan: '1GB/1GB',
    planType: 'Internet',
    paymentMethod: 'Credit Card ****3456',
    transactionId: 'TXN-2026-01-25-003',
  },
  {
    id: '4',
    name: 'Sandra Keitt',
    address: '406 TREADWELL ST, ORANGEBURG, SC 29115',
    amount: '$69.99',
    numericAmount: 69.99,
    billingDate: 'Jan 25, 2026',
    transactionDate: '2026-01-25',
    source: 'Archived',
    status: 'Completed',
    plan: '1GB/1GB',
    planType: 'Internet',
    paymentMethod: 'Credit Card ****7890',
    transactionId: 'TXN-2026-01-25-004',
  },
  {
    id: '5',
    name: 'Zachery McClellan',
    address: '742 STANLEY ST, ORANGEBURG, SC 29115',
    amount: '$69.99',
    numericAmount: 69.99,
    billingDate: 'Jan 25, 2026',
    transactionDate: '2026-01-25',
    source: 'Archived',
    status: 'Completed',
    plan: '1GB/1GB',
    planType: 'Internet',
    paymentMethod: 'Credit Card ****2345',
    transactionId: 'TXN-2026-01-25-005',
  },
  {
    id: '6',
    name: 'Kathryn Ruff',
    address: '842 HILLSBORO RD, ORANGEBURG, SC 29118',
    amount: '$69.99',
    numericAmount: 69.99,
    billingDate: 'Jan 25, 2026',
    transactionDate: '2026-01-25',
    source: 'Archived',
    status: 'Completed',
    plan: '1GB/1GB',
    planType: 'Internet',
    paymentMethod: 'Credit Card ****6789',
    transactionId: 'TXN-2026-01-25-006',
  },
  {
    id: '7',
    name: 'Frankie MILHOUSE',
    address: '1333 MOSS ST, ORANGEBURG, SC 29118',
    amount: '$69.99',
    numericAmount: 69.99,
    billingDate: 'Jan 25, 2026',
    transactionDate: '2026-01-25',
    source: 'Archived',
    status: 'Completed',
    plan: '1GB/1GB',
    planType: 'Internet',
    paymentMethod: 'Credit Card ****0123',
    transactionId: 'TXN-2026-01-25-007',
  },
  {
    id: '8',
    name: 'Wendell Nimmons',
    address: '911 EDISTO AVE, ORANGEBURG, SC 29115',
    amount: '$65.95',
    numericAmount: 65.95,
    billingDate: 'Jan 25, 2026',
    transactionDate: '2026-01-25',
    source: 'Archived',
    status: 'Completed',
    plan: '750MB/750MB',
    planType: 'Internet',
    paymentMethod: 'Credit Card ****4567',
    transactionId: 'TXN-2026-01-25-008',
  },
  {
    id: '9',
    name: 'Brittany Cooper',
    address: '336 FAIR ST, ORANGEBURG, SC 29115',
    amount: '$69.99',
    numericAmount: 69.99,
    billingDate: 'Jan 25, 2026',
    transactionDate: '2026-01-25',
    source: 'Archived',
    status: 'Completed',
    plan: '1GB/1GB',
    planType: 'Internet',
    paymentMethod: 'Credit Card ****8901',
    transactionId: 'TXN-2026-01-25-009',
  },
  {
    id: '10',
    name: 'Keith Keller',
    address: '1984 ELLIS AVE, ORANGEBURG, SC 29118',
    amount: '$65.95',
    numericAmount: 65.95,
    billingDate: 'Jan 25, 2026',
    transactionDate: '2026-01-25',
    source: 'Archived',
    status: 'Completed',
    plan: '750MB/750MB',
    planType: 'Internet',
    paymentMethod: 'Credit Card ****2346',
    transactionId: 'TXN-2026-01-25-010',
  },
];

interface BillingQueueProps {
  onNavigate?: (section: string) => void;
}

export function BillingQueue({ onNavigate }: BillingQueueProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundType, setRefundType] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundNotes, setRefundNotes] = useState('');
  const [showRefundConfirmation, setShowRefundConfirmation] = useState(false);
  const [refundProcessed, setRefundProcessed] = useState(false);

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
    setShowRefundForm(false);
    setRefundProcessed(false);
    setShowRefundConfirmation(false);
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setSelectedTransaction(null);
    setShowRefundForm(false);
    setShowRefundConfirmation(false);
    setRefundProcessed(false);
    setRefundType('');
    setRefundReason('');
    setRefundAmount('');
    setRefundNotes('');
  };

  const handleInitiateRefund = () => {
    setShowRefundForm(true);
    setRefundAmount(selectedTransaction?.numericAmount?.toString() || '');
  };

  const handleCancelRefund = () => {
    setShowRefundForm(false);
    setRefundType('');
    setRefundReason('');
    setRefundAmount('');
    setRefundNotes('');
    setShowRefundConfirmation(false);
  };

  const handleProceedToConfirmation = () => {
    setShowRefundConfirmation(true);
  };

  const handleProcessRefund = () => {
    console.log('Processing refund:', {
      transaction: selectedTransaction,
      type: refundType,
      reason: refundReason,
      amount: refundAmount,
      notes: refundNotes,
    });
    setRefundProcessed(true);
  };

  const isRefundEligible = (transaction: any) => {
    const transactionDate = new Date(transaction.transactionDate);
    const today = new Date();
    const daysDifference = Math.floor((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDifference <= 90 && transaction.status === 'Completed';
  };

  const isFormValid = () => {
    return (
      refundType !== '' &&
      refundReason !== '' &&
      refundAmount !== '' &&
      parseFloat(refundAmount) > 0 &&
      parseFloat(refundAmount) <= (selectedTransaction?.numericAmount || 0)
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Title */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
              Billing Queue
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Current billing queue items scheduled for processing
            </p>
          </div>
          <Button className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="w-48">
          <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[var(--card)] border-[var(--border)]">
              <SelectItem value="all" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">All</SelectItem>
              <SelectItem value="pending" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Pending</SelectItem>
              <SelectItem value="completed" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Completed</SelectItem>
              <SelectItem value="failed" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <label className="text-sm text-[var(--muted-foreground)] mb-2 block">Date Range</label>
          <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
            <SelectTrigger className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[var(--card)] border-[var(--border)]">
              <SelectItem value="all" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">All</SelectItem>
              <SelectItem value="today" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Today</SelectItem>
              <SelectItem value="week" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">This Week</SelectItem>
              <SelectItem value="month" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--border)] hover:bg-[var(--card)]">
              <TableHead className="text-[var(--muted-foreground)]">Subscriber</TableHead>
              <TableHead className="text-[var(--muted-foreground)]">Amount</TableHead>
              <TableHead className="text-[var(--muted-foreground)]">Billing Date</TableHead>
              <TableHead className="text-[var(--muted-foreground)]">Source</TableHead>
              <TableHead className="text-[var(--muted-foreground)]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queueData.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => handleTransactionClick(item)}
                className="border-[var(--border)] hover:bg-[var(--secondary)] cursor-pointer"
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-[var(--foreground)]">{item.name}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">{item.address}</div>
                  </div>
                </TableCell>
                <TableCell className="text-[var(--foreground)]">{item.amount}</TableCell>
                <TableCell className="text-[var(--foreground)]">{item.billingDate}</TableCell>
                <TableCell>
                  <Badge className="bg-[var(--secondary)] text-[var(--muted-foreground)] border-[var(--border)]">
                    {item.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Transaction Modal */}
      <Dialog open={isTransactionModalOpen} onOpenChange={handleCloseTransactionModal}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[var(--foreground)]">
              {refundProcessed ? 'Refund Processed' : 'Transaction Details'}
            </DialogTitle>
            <DialogDescription className="text-[var(--muted-foreground)]">
              {refundProcessed
                ? 'The refund has been successfully processed.'
                : showRefundConfirmation
                ? 'Review and confirm refund details before processing.'
                : showRefundForm
                ? 'Complete the refund request form below.'
                : 'View transaction details and initiate a refund if needed.'}
            </DialogDescription>
          </DialogHeader>

          {!showRefundForm && !showRefundConfirmation && !refundProcessed && (
            <div className="space-y-6 mt-4">
              {/* Transaction Details */}
              <div className="bg-[var(--secondary)] rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Transaction Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)] mb-1">Transaction ID</div>
                    <div className="text-sm text-[var(--foreground)] font-mono">{selectedTransaction?.transactionId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)] mb-1">Status</div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                      {selectedTransaction?.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)] mb-1">Subscriber</div>
                    <div className="text-sm text-[var(--foreground)] font-medium">{selectedTransaction?.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{selectedTransaction?.address}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)] mb-1">Plan</div>
                    <div className="text-sm text-[var(--foreground)]">{selectedTransaction?.plan} - {selectedTransaction?.planType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)] mb-1">Amount</div>
                    <div className="text-sm text-[var(--foreground)] font-semibold">{selectedTransaction?.amount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted-foreground)] mb-1">Billing Date</div>
                    <div className="text-sm text-[var(--foreground)]">{selectedTransaction?.billingDate}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-[var(--muted-foreground)] mb-1">Payment Method</div>
                    <div className="text-sm text-[var(--foreground)]">{selectedTransaction?.paymentMethod}</div>
                  </div>
                </div>
              </div>

              {/* Refund Eligibility */}
              {selectedTransaction && (
                <div className={`flex items-start gap-3 p-4 rounded-lg ${
                  isRefundEligible(selectedTransaction)
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-yellow-500/10 border border-yellow-500/30'
                }`}>
                  {isRefundEligible(selectedTransaction) ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <div className={`text-sm font-semibold ${
                      isRefundEligible(selectedTransaction) ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {isRefundEligible(selectedTransaction)
                        ? 'Refund Eligible'
                        : 'Refund Eligibility Warning'}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)] mt-1">
                      {isRefundEligible(selectedTransaction)
                        ? 'This transaction is within the 90-day refund window and can be refunded.'
                        : 'This transaction may be outside the standard refund window. Manager approval may be required.'}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleCloseTransactionModal}
                  variant="outline"
                  className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
                >
                  Close
                </Button>
                <Button
                  onClick={handleInitiateRefund}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Initiate Refund
                </Button>
              </div>
            </div>
          )}

          {showRefundForm && !showRefundConfirmation && (
            <div className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-[var(--foreground)] mb-2 block">Refund Type *</Label>
                  <Select value={refundType} onValueChange={(value) => {
                    setRefundType(value);
                    if (value === 'full') {
                      setRefundAmount(selectedTransaction?.numericAmount?.toString() || '');
                    } else if (value === 'partial') {
                      setRefundAmount('');
                    }
                  }}>
                    <SelectTrigger className="w-full bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]">
                      <SelectValue placeholder="Select refund type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                      <SelectItem value="full" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Full Refund ({selectedTransaction?.amount})</SelectItem>
                      <SelectItem value="partial" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Partial Refund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {refundType === 'partial' && (
                  <div>
                    <Label className="text-sm text-[var(--foreground)] mb-2 block">Refund Amount *</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      max={selectedTransaction?.numericAmount}
                      step="0.01"
                      className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                    />
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      Maximum: ${selectedTransaction?.numericAmount?.toFixed(2)}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-sm text-[var(--foreground)] mb-2 block">Refund Reason *</Label>
                  <Select value={refundReason} onValueChange={setRefundReason}>
                    <SelectTrigger className="w-full bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)]">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                      <SelectItem value="service_issue" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Service Issue/Outage</SelectItem>
                      <SelectItem value="billing_error" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Billing Error</SelectItem>
                      <SelectItem value="customer_request" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Customer Request</SelectItem>
                      <SelectItem value="duplicate_charge" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Duplicate Charge</SelectItem>
                      <SelectItem value="service_cancellation" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Service Cancellation</SelectItem>
                      <SelectItem value="quality_issue" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Service Quality Issue</SelectItem>
                      <SelectItem value="other" className="text-[var(--foreground)] focus:bg-[var(--secondary)] focus:text-[var(--foreground)]">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-[var(--foreground)] mb-2 block">Additional Notes</Label>
                  <Textarea
                    placeholder="Enter any additional details about this refund..."
                    value={refundNotes}
                    onChange={(e) => setRefundNotes(e.target.value)}
                    rows={4}
                    className="bg-[var(--popover)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <Button
                  onClick={handleCancelRefund}
                  variant="outline"
                  className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProceedToConfirmation}
                  disabled={!isFormValid()}
                  className="bg-[#147FFF] text-white hover:bg-[#0F6FE5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Refund
                </Button>
              </div>
            </div>
          )}

          {showRefundConfirmation && !refundProcessed && (
            <div className="space-y-6 mt-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-yellow-500">Confirm Refund</div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-1">
                    Please review the refund details carefully before processing. This action cannot be undone.
                  </div>
                </div>
              </div>

              <div className="bg-[var(--secondary)] rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Refund Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted-foreground)]">Subscriber</span>
                    <span className="text-sm text-[var(--foreground)] font-medium">{selectedTransaction?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted-foreground)]">Original Amount</span>
                    <span className="text-sm text-[var(--foreground)] font-semibold">{selectedTransaction?.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted-foreground)]">Refund Type</span>
                    <Badge className="bg-[var(--secondary)] text-[var(--muted-foreground)] border-[var(--border)]">
                      {refundType === 'full' ? 'Full Refund' : 'Partial Refund'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--muted-foreground)]">Refund Amount</span>
                    <span className="text-lg text-red-500 font-bold">-${parseFloat(refundAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                    <span className="text-sm text-[var(--muted-foreground)]">Reason</span>
                    <span className="text-sm text-[var(--foreground)]">
                      {refundReason === 'service_issue' && 'Service Issue/Outage'}
                      {refundReason === 'billing_error' && 'Billing Error'}
                      {refundReason === 'customer_request' && 'Customer Request'}
                      {refundReason === 'duplicate_charge' && 'Duplicate Charge'}
                      {refundReason === 'service_cancellation' && 'Service Cancellation'}
                      {refundReason === 'quality_issue' && 'Service Quality Issue'}
                      {refundReason === 'other' && 'Other'}
                    </span>
                  </div>
                  {refundNotes && (
                    <div className="pt-3 border-t border-[var(--border)]">
                      <div className="text-xs text-[var(--muted-foreground)] mb-1">Notes</div>
                      <div className="text-sm text-[var(--foreground)]">{refundNotes}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <Button
                  onClick={() => setShowRefundConfirmation(false)}
                  variant="outline"
                  className="bg-transparent border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
                >
                  Back to Edit
                </Button>
                <Button
                  onClick={handleProcessRefund}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Process Refund
                </Button>
              </div>
            </div>
          )}

          {refundProcessed && (
            <div className="space-y-6 mt-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 flex flex-col items-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <div className="text-xl font-semibold text-green-500 mb-2">Refund Processed Successfully</div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  The refund of ${parseFloat(refundAmount).toFixed(2)} has been processed and will appear in the customer's account within 5-7 business days.
                </div>
              </div>

              <div className="bg-[var(--secondary)] rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Refund Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Transaction ID</span>
                    <span className="text-[var(--foreground)] font-mono">{selectedTransaction?.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Subscriber</span>
                    <span className="text-[var(--foreground)]">{selectedTransaction?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Refund Amount</span>
                    <span className="text-[var(--foreground)] font-semibold">${parseFloat(refundAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Refund Type</span>
                    <span className="text-[var(--foreground)]">{refundType === 'full' ? 'Full Refund' : 'Partial Refund'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-foreground)]">Processed Date</span>
                    <span className="text-[var(--foreground)]">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleCloseTransactionModal}
                  className="bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--secondary)]/80"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BillingQueue;