# Payment Modes and Transfer Flow Architecture

**Last Updated**: 2026-01-20
**Owner**: Edge Function Team (DEV3 - Drake Maye) + Database Team (DEV1 - Morpis Randles)
**Context**: Defines how payment modes affect fund flow and transfer direction

---

## Payment Mode Definitions

### `operator_legacy` (Legacy Architecture)
- **MoR (Merchant of Record)**: Platform
- **Customer Pays**: Platform Stripe account
- **Platform Collects**: 100% of payment
- **Funds Clear To**: Platform account
- **Transfers**: None (platform keeps everything - legacy system)
- **Use Case**: Legacy networks not yet migrated

### `operator` (New Operator Billing)
- **MoR**: Operator
- **Customer Pays**: Operator Stripe Connected Account
- **Platform Collects**: Application fee = provider_amount_cents (provider's share)
- **Funds Clear To**: Platform account
- **Transfers**: **Platform → Provider** (after funds settle ~7 days)
- **Transfer Amount**: provider_amount_cents
- **Use Case**: New architecture with operator billing

### `provider` (Provider MoR)
- **MoR**: Provider
- **Customer Pays**: Provider Stripe Connected Account (via cloned payment method)
- **Platform Collects**: Application fee = network_fee_cents (operator's share + platform's share)
- **Funds Clear To**: Platform account
- **Transfers**: **Platform → Operator** (after funds settle ~7 days)
- **Transfer Amount**: operator_amount_cents = network_fee_cents - platform_fee_cents
- **Use Case**: Full Provider MoR architecture

---

## Transfer Direction Logic

**Key Insight**: Platform is ALWAYS the source account for transfers (funds collected via Stripe application fees)

| payment_mode | Transfer Direction | Source Account | Destination Account | Amount |
|--------------|-------------------|----------------|---------------------|--------|
| `operator_legacy` | None | N/A | N/A | N/A |
| `operator` | **Platform → Provider** | Platform Stripe | Provider Connected Account | provider_amount_cents |
| `provider` | **Platform → Operator** | Platform Stripe | Operator Connected Account | operator_amount_cents |

---

## Fee Flow Examples

### Example: $100 Internet Payment

**operator mode**:
```
Customer pays Operator: $100
├─ Network fee: $55 (to Operator initially)
│  ├─ Platform application fee collects: $45 (provider_amount_cents)
│  └─ Operator keeps: $55
├─ Stripe fee: $3.20 total
│  ├─ Provider share: $1.60 (deducted from application fee)
│  └─ Operator share: $1.60 (deducted from operator's $55)
└─ Platform fee: $15 (comes from network fee)

After settlement (~7 days):
Platform transfers to Provider: $43.40 ($45 - $1.60 Stripe)
Operator net: $38.40 ($55 - $1.60 Stripe - $15 Platform)
```

**provider mode**:
```
Customer pays Provider: $100
├─ Provider keeps: $100 initially
├─ Platform application fee collects: $55 (network_fee)
├─ Stripe fee: $3.20 total
│  ├─ Provider share: $1.60 (deducted from provider's $100)
│  └─ Operator share: $1.60 (deducted from application fee)
└─ Platform fee: $15 (comes from network fee)

Provider net immediately: $96.80 ($100 - $3.20 Stripe - application fee happens async)

After settlement (~7 days):
Platform transfers to Operator: $38.40 ($55 network_fee - $15 platform_fee - $1.60 Stripe)
Platform keeps: $15 (platform_fee)
```

---

## Four-Phase Transfer Queue Architecture

**Status**: ✅ IMPLEMENTED (2026-01-20)

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FOUR-PHASE TRANSFER QUEUE ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Phase 1: Settlement Tracking                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Worker Query: WHERE funds_available_on IS NULL AND invoice = 'paid' │   │
│  │ Edge Function: update-settlement-info                               │   │
│  │ Result: Populates funds_available_on from Stripe balance_transaction│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                        │
│  Phase 2: Queue Ready Transfers                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Worker Query: WHERE funds_available_on <= NOW() AND status='pending'│   │
│  │ RPC Function: queue_transfer(payment_distribution_id)               │   │
│  │ Result: Creates transfer_queue record with correct direction        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                        │
│  Phase 3: Process Queued Transfers                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Worker Query: WHERE status = 'queued' OR (failed AND retryable)     │   │
│  │ Edge Function: process-transfer                                     │   │
│  │ Result: Creates Stripe Transfer, updates stripe_transfer_id         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    ↓                                        │
│  Phase 4: Monitor Completion                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Primary: Webhooks (transfer.paid, transfer.failed)                  │   │
│  │ Fallback: check-transfer-status edge function (hourly polling)      │   │
│  │ Result: Updates transfer_status from 'pending' to 'paid'/'failed'   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Settlement Tracking

**Edge Function**: `update-settlement-info`
**Endpoint**: `POST /functions/v1/update-settlement-info`

**Purpose**: Get estimated fund availability dates from Stripe and store them. Eliminates wasteful repeated API calls.

**Worker Query**:
```sql
SELECT id FROM payment_distributions
WHERE funds_available_on IS NULL
AND invoice_status = 'paid'
AND operator_distribution_status IN ('pending', 'waiting_for_settlement')
LIMIT 10
```

**Request Options**:
- `{ "payment_distribution_id": "uuid" }` - Single distribution
- `{ "payment_distribution_ids": ["uuid1", "uuid2"] }` - Batch
- `{ "check_all_missing": true, "limit": 10 }` - Service Worker pattern

**Result**: Populates `funds_available_on`, `balance_transaction_id`, `funds_status` in `payment_distributions`

**Poll Interval**: Every 5 minutes

---

### Phase 2: Queue Ready Transfers

**Method**: RPC call (NOT edge function)
**RPC Function**: `queue_transfer(p_payment_distribution_id UUID)`

**Purpose**: Move ready-for-transfer distributions to the processing queue.

**Worker Query**:
```sql
SELECT id FROM payment_distributions
WHERE funds_available_on <= NOW()
AND operator_distribution_status = 'pending'
AND payment_mode IN ('operator', 'provider')
```

**Worker Calls**: `supabase.rpc('queue_transfer', { p_payment_distribution_id: dist.id })`

**RPC Logic**:
- Determines `transfer_direction` based on `payment_mode`:
  - `operator` mode → `to_provider`
  - `provider` mode → `to_operator`
- Looks up destination Stripe account ID
- Calculates transfer amount
- Creates `transfer_queue` record

**Poll Interval**: Every 1 minute

---

### Phase 3: Process Queued Transfers

**Edge Function**: `process-transfer`
**Endpoint**: `POST /functions/v1/process-transfer`

**Purpose**: Execute Stripe Transfers from the queue.

**Worker Query**:
```sql
SELECT id FROM transfer_queue
WHERE status = 'queued'
OR (status = 'failed' AND retry_count < max_retries AND next_retry_after <= NOW())
ORDER BY queued_at
```

**Request**: `{ "transfer_queue_id": "uuid" }`

**Process**:
1. Mark status = 'processing' (optimistic locking)
2. Double-check balance_transaction.status = 'available'
3. If not available → schedule retry with exponential backoff
4. If available → create Stripe Transfer
5. Update transfer_queue with stripe_transfer_id
6. Update payment_distributions status

**Response Examples**:
```json
// Success
{
  "success": true,
  "transfer_queue_id": "uuid",
  "stripe_transfer_id": "tr_xxx",
  "transfer_status": "pending",
  "transfer_arrival_date": "2026-01-22T00:00:00.000Z"
}

// Funds not available (retry scheduled)
{
  "success": false,
  "transfer_queue_id": "uuid",
  "funds_not_available": true,
  "retry_scheduled": true,
  "error": "Funds not yet available. Retry scheduled in 60 minutes."
}
```

**Poll Interval**: Every 30 seconds

---

### Phase 4: Monitor Transfer Completion

**Primary Method**: Webhooks (automatic via `stripe-connect-webhook`)
**Fallback**: `check-transfer-status` edge function

**Webhook Events Handled**:
- `transfer.created` - Logs transfer creation
- `transfer.paid` - Updates `transfer_status = 'paid'`, `payment_distributions` status to 'completed'
- `transfer.failed` - Updates `transfer_status = 'failed'`
- `transfer.canceled` - Updates `transfer_status = 'canceled'`

**Fallback Edge Function**: `POST /functions/v1/check-transfer-status`

**Fallback Worker Query**:
```sql
SELECT id FROM transfer_queue
WHERE transfer_status = 'pending'
AND stripe_transfer_id IS NOT NULL
AND (transfer_status_checked_at IS NULL
     OR transfer_status_checked_at < NOW() - INTERVAL '1 hour')
LIMIT 10
```

**Request**: `{ "check_all_pending": true, "limit": 10 }`

**Smart Polling**: Uses `transfer_status_checked_at` to avoid excessive Stripe API calls - only checks transfers not checked in last hour.

**Poll Interval**: Every 1 hour (fallback only)

---

## Database Tables

### transfer_queue

**Purpose**: Tracks individual transfer attempts separately from payment records.

**Key Columns**:
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| payment_distribution_id | UUID | FK to payment_distributions |
| payment_mode | TEXT | 'operator' or 'provider' |
| transfer_direction | TEXT | 'to_provider' or 'to_operator' |
| source_account | TEXT | Always 'platform' |
| destination_account_id | TEXT | Provider or Operator Stripe acct_xxx |
| amount_cents | INTEGER | Transfer amount |
| status | TEXT | queued/processing/completed/failed/cancelled |
| transfer_status | TEXT | Stripe lifecycle: pending/paid/failed/canceled |
| stripe_transfer_id | TEXT | tr_xxx after transfer created |
| transfer_status_checked_at | TIMESTAMPTZ | For smart polling |
| funds_available_on | TIMESTAMPTZ | Copied from payment_distributions |
| retry_count | INTEGER | Current retry attempts |
| max_retries | INTEGER | Default 3 |
| next_retry_after | TIMESTAMPTZ | Exponential backoff |
| error_message | TEXT | Last error if failed |

### payment_distributions (Updated Columns)

| Column | Type | Description |
|--------|------|-------------|
| funds_available_on | TIMESTAMPTZ | Set by Phase 1 |
| balance_transaction_id | TEXT | Set by Phase 1 |
| funds_status | TEXT | pending/available/unknown |
| operator_distribution_status | TEXT | Updated by Phase 3 and Phase 4 |

---

## Edge Functions Summary

| Function | Phase | Purpose | Method |
|----------|-------|---------|--------|
| `update-settlement-info` | 1 | Get settlement dates from Stripe | POST |
| `queue_transfer` (RPC) | 2 | Queue ready distributions | RPC |
| `process-transfer` | 3 | Execute Stripe Transfers | POST |
| `stripe-connect-webhook` | 4 | Handle transfer.* events | POST |
| `check-transfer-status` | 4 | Fallback polling | POST |

---

## Efficiency Principles

1. **Only check distributions missing settlement data** (Phase 1)
   - Query: `WHERE funds_available_on IS NULL`
   - Once populated, never check Stripe again

2. **Only queue after funds_available_on passes** (Phase 2)
   - Query: `WHERE funds_available_on <= NOW()`
   - No premature queue attempts

3. **Only process queued transfers** (Phase 3)
   - Query: `WHERE status = 'queued'`
   - Double-check before Stripe API call

4. **Smart polling for fallback** (Phase 4)
   - Query: `WHERE transfer_status_checked_at < NOW() - INTERVAL '1 hour'`
   - Webhooks handle 99% of updates

---

## Service Worker Integration

**Recommended Architecture**: Single TransferQueueWorker with multiple poll loops

```python
class TransferQueueWorker:
    poll_loops = [
        {"name": "settlement_tracking", "interval": "5 minutes", "phase": 1},
        {"name": "queue_transfers", "interval": "1 minute", "phase": 2},
        {"name": "process_transfers", "interval": "30 seconds", "phase": 3},
        {"name": "fallback_status_check", "interval": "1 hour", "phase": 4}
    ]
```

---

## Stripe Dashboard Setup

To enable transfer webhooks, add these events in Stripe Dashboard:
1. Go to **Developers > Webhooks**
2. Select your webhook endpoint
3. Click **Add events**
4. Enable:
   - `transfer.created`
   - `transfer.paid`
   - `transfer.failed`
   - `transfer.canceled`

---

## Next Steps

- [x] Finalize transfer_queue schema (Migration 51)
- [x] Create queue_transfer() RPC
- [x] Create update-settlement-info edge function (Phase 1)
- [x] Create process-transfer edge function (Phase 3)
- [x] Update stripe-connect-webhook for transfer events (Phase 4)
- [x] Create check-transfer-status fallback (Phase 4)
- [ ] Service Worker Team: Implement TransferQueueWorker
- [ ] Integration testing of full flow
