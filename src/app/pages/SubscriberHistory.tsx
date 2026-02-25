import { useState } from 'react';
import { Search, ArrowLeft, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { BillingLayout } from '@/app/components/BillingLayout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

const searchResults = [
  {
    id: '1',
    name: 'Ken Sheppard',
    serviceAddresses: '1 service address',
  },
];

const billingHistory = [
  {
    id: '1',
    plan: '1GB/1GB',
    planType: 'Internet',
    amount: '$69.99',
    numericAmount: 69.99,
    billingDate: 'Dec 31, 2025',
    transactionDate: '2025-12-31',
    source: 'Archived',
    status: 'Completed',
    paymentMethod: 'Credit Card ****1234',
    transactionId: 'TXN-2025-12-31-001',
  },
  {
    id: '2',
    plan: '1GB/1GB',
    planType: 'Internet',
    amount: '$69.99',
    numericAmount: 69.99,
    billingDate: 'Nov 30, 2025',
    transactionDate: '2025-11-30',
    source: 'Archived',
    status: 'Completed',
    paymentMethod: 'Credit Card ****1234',
    transactionId: 'TXN-2025-11-30-001',
  },
];

interface SubscriberHistoryProps {
  onNavigate?: (section: string) => void;
}

export function SubscriberHistory({ onNavigate }: SubscriberHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundType, setRefundType] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundNotes, setRefundNotes] = useState('');
  const [showRefundConfirmation, setShowRefundConfirmation] = useState(false);
  const [refundProcessed, setRefundProcessed] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
  };

  const handleSelectSubscriber = (subscriber: any) => {
    setSelectedSubscriber(subscriber);
  };

  const handleBackToSearch = () => {
    setSelectedSubscriber(null);
  };

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
    // Process refund logic here
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
    // Check if transaction is within 90 days
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
    <BillingLayout activeTab="subscriber-history" onNavigate={onNavigate}>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">
          Subscriber Billing History
        </h1>
        <p className="text-[#94A3B8]">
          {selectedSubscriber
            ? 'Complete billing history for selected subscriber'
            : 'Search billing history by subscriber'}
        </p>
      </div>

      {/* Content */}
      {!selectedSubscriber ? (
        <>
          {/* Search Section */}
          <Card className="bg-[#0F172A] border-[#1E293B] p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#F8FAFC] mb-2">
              Search Subscriber
            </h2>
            <p className="text-sm text-[#94A3B8] mb-4">
              Search by subscriber name to view billing history
            </p>
            <div className="flex gap-3">
              <Input
                placeholder="Enter subscriber name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
              />
              <Button
                onClick={handleSearch}
                className="bg-[#1E293B] text-[#F8FAFC] hover:bg-[#334155]"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <Card className="bg-[#0F172A] border-[#1E293B] p-6">
              <h2 className="text-lg font-semibold text-[#F8FAFC] mb-2">
                Search Results ({searchResults.length} found)
              </h2>
              <p className="text-sm text-[#94A3B8] mb-4">
                Select a subscriber to view their billing history
              </p>
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectSubscriber(result)}
                    className="w-full flex items-center gap-3 p-4 bg-[#1E293B]/30 hover:bg-[#1E293B] border border-[#1E293B] rounded-lg transition-colors text-left"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-[#F8FAFC]">
                        {result.name}
                      </div>
                      <div className="text-sm text-[#64748B]">
                        {result.serviceAddresses}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </>
      ) : (
        <>
          {/* Subscriber Details */}
          <Card className="bg-[#0F172A] border-[#1E293B] p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-[#F8FAFC]">
                  {selectedSubscriber.name}
                </div>
                <div className="text-sm text-[#64748B]">
                  561 TEA TICKET, ORANGEBURG, SC 29118
                </div>
              </div>
              <Button
                onClick={handleBackToSearch}
                variant="outline"
                className="bg-transparent border-[#1E293B] text-[#F8FAFC] hover:bg-[#1E293B]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </div>
          </Card>

          {/* Billing History Table */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#1E293B] hover:bg-[#0F172A]">
                  <TableHead className="text-[#94A3B8]">Plan</TableHead>
                  <TableHead className="text-[#94A3B8]">Amount</TableHead>
                  <TableHead className="text-[#94A3B8]">Billing Date</TableHead>
                  <TableHead className="text-[#94A3B8]">Source</TableHead>
                  <TableHead className="text-[#94A3B8]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => handleTransactionClick(item)}
                    className="border-[#1E293B] hover:bg-[#1E293B]/30 cursor-pointer"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-[#F8FAFC]">{item.plan}</div>
                        <div className="text-sm text-[#64748B]">{item.planType}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#F8FAFC]">{item.amount}</TableCell>
                    <TableCell className="text-[#F8FAFC]">
                      {item.billingDate}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#1E293B] text-[#94A3B8] border-[#1E293B]">
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

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-[#94A3B8]">
              Showing 2 of 2 item(s)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#94A3B8]">Page 1 of 1</span>
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="text-[#64748B]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="text-[#64748B]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Transaction Modal */}
      <Dialog open={isTransactionModalOpen} onOpenChange={handleCloseTransactionModal}>
        <DialogContent className="bg-[#0F172A] border-[#1E293B] text-[#F8FAFC] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#F8FAFC]">
              {refundProcessed ? 'Refund Processed' : 'Transaction Details'}
            </DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
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
              <div className="bg-[#1E293B]/30 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Transaction Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-[#64748B] mb-1">Transaction ID</div>
                    <div className="text-sm text-[#F8FAFC] font-mono">{selectedTransaction?.transactionId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B] mb-1">Status</div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                      {selectedTransaction?.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B] mb-1">Plan</div>
                    <div className="text-sm text-[#F8FAFC]">{selectedTransaction?.plan} - {selectedTransaction?.planType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B] mb-1">Amount</div>
                    <div className="text-sm text-[#F8FAFC] font-semibold">{selectedTransaction?.amount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B] mb-1">Billing Date</div>
                    <div className="text-sm text-[#F8FAFC]">{selectedTransaction?.billingDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B] mb-1">Payment Method</div>
                    <div className="text-sm text-[#F8FAFC]">{selectedTransaction?.paymentMethod}</div>
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
                    <div className="text-xs text-[#94A3B8] mt-1">
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
                  className="bg-transparent border-[#1E293B] text-[#F8FAFC] hover:bg-[#1E293B]"
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
              {/* Refund Form */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-[#F8FAFC] mb-2 block">Refund Type *</Label>
                  <Select value={refundType} onValueChange={(value) => {
                    setRefundType(value);
                    if (value === 'full') {
                      setRefundAmount(selectedTransaction?.numericAmount?.toString() || '');
                    } else if (value === 'partial') {
                      setRefundAmount('');
                    }
                  }}>
                    <SelectTrigger className="w-full bg-[#020817] border-[#1E293B] text-[#F8FAFC]">
                      <SelectValue placeholder="Select refund type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0F172A] border-[#1E293B]">
                      <SelectItem value="full">Full Refund ({selectedTransaction?.amount})</SelectItem>
                      <SelectItem value="partial">Partial Refund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {refundType === 'partial' && (
                  <div>
                    <Label className="text-sm text-[#F8FAFC] mb-2 block">Refund Amount *</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      max={selectedTransaction?.numericAmount}
                      step="0.01"
                      className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B]"
                    />
                    <p className="text-xs text-[#64748B] mt-1">
                      Maximum: ${selectedTransaction?.numericAmount?.toFixed(2)}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-sm text-[#F8FAFC] mb-2 block">Refund Reason *</Label>
                  <Select value={refundReason} onValueChange={setRefundReason}>
                    <SelectTrigger className="w-full bg-[#020817] border-[#1E293B] text-[#F8FAFC]">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0F172A] border-[#1E293B]">
                      <SelectItem value="service_issue" className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Service Issue/Outage</SelectItem>
                      <SelectItem value="billing_error" className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Billing Error</SelectItem>
                      <SelectItem value="customer_request" className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Customer Request</SelectItem>
                      <SelectItem value="duplicate_charge" className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Duplicate Charge</SelectItem>
                      <SelectItem value="service_cancellation" className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Service Cancellation</SelectItem>
                      <SelectItem value="quality_issue" className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Service Quality Issue</SelectItem>
                      <SelectItem value="other" className="text-[#F8FAFC] focus:bg-[#1E293B] focus:text-[#F8FAFC]">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-[#F8FAFC] mb-2 block">Additional Notes</Label>
                  <Textarea
                    placeholder="Enter any additional details about this refund..."
                    value={refundNotes}
                    onChange={(e) => setRefundNotes(e.target.value)}
                    rows={4}
                    className="bg-[#020817] border-[#1E293B] text-[#F8FAFC] placeholder:text-[#64748B] resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E293B]">
                <Button
                  onClick={handleCancelRefund}
                  variant="outline"
                  className="bg-transparent border-[#1E293B] text-[#F8FAFC] hover:bg-[#1E293B]"
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
              {/* Confirmation Details */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-yellow-500">Confirm Refund</div>
                  <div className="text-xs text-[#94A3B8] mt-1">
                    Please review the refund details carefully before processing. This action cannot be undone.
                  </div>
                </div>
              </div>

              <div className="bg-[#1E293B]/30 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Refund Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#64748B]">Original Amount</span>
                    <span className="text-sm text-[#F8FAFC] font-semibold">{selectedTransaction?.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#64748B]">Refund Type</span>
                    <Badge className="bg-[#1E293B] text-[#94A3B8] border-[#1E293B]">
                      {refundType === 'full' ? 'Full Refund' : 'Partial Refund'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#64748B]">Refund Amount</span>
                    <span className="text-lg text-red-500 font-bold">-${parseFloat(refundAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#1E293B]">
                    <span className="text-sm text-[#64748B]">Reason</span>
                    <span className="text-sm text-[#F8FAFC]">
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
                    <div className="pt-3 border-t border-[#1E293B]">
                      <div className="text-xs text-[#64748B] mb-1">Notes</div>
                      <div className="text-sm text-[#F8FAFC]">{refundNotes}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E293B]">
                <Button
                  onClick={() => setShowRefundConfirmation(false)}
                  variant="outline"
                  className="bg-transparent border-[#1E293B] text-[#F8FAFC] hover:bg-[#1E293B]"
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
              {/* Success Message */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 flex flex-col items-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <div className="text-xl font-semibold text-green-500 mb-2">Refund Processed Successfully</div>
                <div className="text-sm text-[#94A3B8]">
                  The refund of ${parseFloat(refundAmount).toFixed(2)} has been processed and will appear in the customer's account within 5-7 business days.
                </div>
              </div>

              <div className="bg-[#1E293B]/30 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Refund Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Transaction ID</span>
                    <span className="text-[#F8FAFC] font-mono">{selectedTransaction?.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Refund Amount</span>
                    <span className="text-[#F8FAFC] font-semibold">${parseFloat(refundAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Refund Type</span>
                    <span className="text-[#F8FAFC]">{refundType === 'full' ? 'Full Refund' : 'Partial Refund'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Processed Date</span>
                    <span className="text-[#F8FAFC]">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleCloseTransactionModal}
                  className="bg-[#1E293B] text-[#F8FAFC] hover:bg-[#334155]"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </BillingLayout>
  );
}

export default SubscriberHistory;