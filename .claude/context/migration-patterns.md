# Migration Patterns - Real Examples from Billing Discounts System

**Last Updated**: 2025-12-03
**Source**: 186 existing migrations in `app-support-billing-discounts/supabase/migrations/`

---

## Migration File Structure

### Complete Example: Billing Queue Tables

**File**: `20251118000003_create_billing_queue_tables.sql`

```sql
-- ========================================
-- Migration: Create Billing Queue Tables
-- Date: 2025-11-18
-- Purpose: Create tables for automated billing queue system
-- Dependencies: public.networks table must exist
-- ========================================

-- ========================================
-- PART 1: PRIMARY BILLING QUEUE TABLE
-- ========================================

CREATE TABLE public.billing_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Network context
    network_schema TEXT NOT NULL,
    network_id UUID,

    -- Subscription reference
    subscription_id UUID NOT NULL,
    subscriber_id UUID NOT NULL,

    -- Billing details
    billing_date DATE NOT NULL,
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    currency TEXT NOT NULL DEFAULT 'usd',

    -- Customer info (denormalized for worker performance)
    customer_id TEXT NOT NULL,
    customer_email TEXT,

    -- Status tracking
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'processing',
        'completed',
        'failed',
        'manual_review'
    )),

    -- Retry logic
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retry_attempts INTEGER NOT NULL DEFAULT 3,
    next_retry_at TIMESTAMPTZ,

    -- Results
    stripe_invoice_id TEXT,
    payment_record_id UUID,
    error_message TEXT,

    -- Timestamps
    queued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processing_started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT billing_queue_unique_billing_date UNIQUE (network_schema, subscription_id, billing_date)
);

-- Indexes for worker queries
CREATE INDEX idx_billing_queue_status ON public.billing_queue(status);
CREATE INDEX idx_billing_queue_billing_date ON public.billing_queue(billing_date);
CREATE INDEX idx_billing_queue_network_sub ON public.billing_queue(network_schema, subscription_id);
CREATE INDEX idx_billing_queue_retry ON public.billing_queue(next_retry_at) WHERE status = 'failed';

-- Enable RLS
ALTER TABLE public.billing_queue ENABLE ROW LEVEL SECURITY;

-- Comments
COMMENT ON TABLE public.billing_queue IS 'Active billing jobs awaiting payment processing';
COMMENT ON COLUMN public.billing_queue.network_schema IS 'Source network schema (subscribers, jamestown_bpu) for resolving subscription';
COMMENT ON COLUMN public.billing_queue.amount_cents IS 'Billing amount in cents (e.g., 5000 = $50.00)';

-- ========================================
-- PART 2: BILLING QUEUE ARCHIVE
-- ========================================

CREATE TABLE public.billing_queue_archive (
    id UUID PRIMARY KEY,
    billing_queue_id UUID NOT NULL,

    -- All fields from billing_queue
    network_schema TEXT NOT NULL,
    subscription_id UUID NOT NULL,
    billing_date DATE NOT NULL,
    amount_cents INTEGER NOT NULL,
    -- ... (same fields)

    -- Archive-specific
    archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount_paid INTEGER, -- Actual amount charged (may differ from amount_cents)
    processing_duration_ms INTEGER,

    -- Detailed error tracking
    error_code TEXT,
    stripe_error_type TEXT,
    stripe_error_code TEXT
);

CREATE INDEX idx_billing_archive_queue_id ON public.billing_queue_archive(billing_queue_id);
CREATE INDEX idx_billing_archive_network_sub ON public.billing_queue_archive(network_schema, subscription_id);
CREATE INDEX idx_billing_archive_billing_date ON public.billing_queue_archive(billing_date);

COMMENT ON TABLE public.billing_queue_archive IS 'Historical record of all billing queue jobs (permanent storage)';

-- ========================================
-- PART 3: MANUAL REVIEW QUEUE
-- ========================================

CREATE TABLE public.manual_review_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Reference to original billing job
    billing_queue_id UUID NOT NULL,
    network_schema TEXT NOT NULL,
    subscription_id UUID NOT NULL,

    -- Issue details
    issue_type TEXT NOT NULL CHECK (issue_type IN (
        'missing_invoice',
        'duplicate_invoice',
        'reconciliation_failed',
        'stripe_error'
    )),
    issue_description TEXT NOT NULL,

    -- Resolution tracking
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',
        'investigating',
        'resolved',
        'escalated'
    )),
    assigned_to UUID,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- PART 4: DEAD LETTER QUEUE
-- ========================================

CREATE TABLE public.payment_processing_dead_letter_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Original billing job data
    billing_queue_id UUID NOT NULL,
    network_schema TEXT NOT NULL,
    subscription_id UUID NOT NULL,
    amount_cents INTEGER NOT NULL,

    -- Failure details
    failure_reason TEXT NOT NULL,
    failure_count INTEGER NOT NULL,
    stripe_error_type TEXT,
    stripe_error_code TEXT,
    processing_logs JSONB, -- Array of attempt details

    -- Resolution
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,

    moved_to_dlq_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- PART 5: RLS POLICIES
-- ========================================

-- Admins only for billing_queue
CREATE POLICY "admin_access_billing_queue"
ON public.billing_queue FOR ALL TO authenticated
USING (public.is_admin());

-- Service role full access
CREATE POLICY "service_role_full_access_billing_queue"
ON public.billing_queue FOR ALL TO service_role
USING (TRUE);

-- Same for archive and manual review
CREATE POLICY "admin_access_billing_archive"
ON public.billing_queue_archive FOR SELECT TO authenticated
USING (public.is_admin());

-- ========================================
-- END OF MIGRATION
-- ========================================
```

**Key Patterns Demonstrated**:
1. Header comment block with metadata
2. Logical parts (4 related tables)
3. Constraints with descriptive names
4. Indexes for query performance
5. RLS policies
6. Comments for documentation
7. End marker

---

## Pattern: Adding Columns to Existing Table

**File**: `20251118000007_add_promotion_fields_to_billing_queue.sql`

```sql
-- ========================================
-- Migration: Add Promotion Fields to Billing Queue
-- Date: 2025-11-18
-- Purpose: Support promotion credit tracking in billing
-- Dependencies: billing_queue table must exist
-- ========================================

-- ========================================
-- PART 1: ADD COLUMNS (nullable first)
-- ========================================

ALTER TABLE public.billing_queue
  ADD COLUMN IF NOT EXISTS original_amount_cents INTEGER,
  ADD COLUMN IF NOT EXISTS credit_amount_cents INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_amount_cents INTEGER,
  ADD COLUMN IF NOT EXISTS promotion_credits_applied JSONB;

-- ========================================
-- PART 2: BACKFILL EXISTING RECORDS
-- ========================================

-- Backfill existing records with safe defaults
UPDATE public.billing_queue
SET
  original_amount_cents = amount_cents,
  credit_amount_cents = 0,
  net_amount_cents = amount_cents,
  promotion_credits_applied = '[]'::JSONB
WHERE original_amount_cents IS NULL;

-- Verify backfill
DO $$
DECLARE
  v_total INTEGER;
  v_backfilled INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_total FROM public.billing_queue;
  SELECT COUNT(*) INTO v_backfilled FROM public.billing_queue WHERE original_amount_cents IS NOT NULL;

  RAISE NOTICE 'Backfill complete: %/% records updated', v_backfilled, v_total;

  IF v_total != v_backfilled THEN
    RAISE EXCEPTION 'Backfill incomplete: %/% records', v_backfilled, v_total;
  END IF;
END $$;

-- ========================================
-- PART 3: MAKE COLUMNS NOT NULL
-- ========================================

-- Safe now that all records have values
ALTER TABLE public.billing_queue
  ALTER COLUMN original_amount_cents SET NOT NULL,
  ALTER COLUMN credit_amount_cents SET NOT NULL,
  ALTER COLUMN net_amount_cents SET NOT NULL;

-- ========================================
-- PART 4: ADD CONSTRAINTS
-- ========================================

-- Ensure amounts are consistent
ALTER TABLE public.billing_queue
  ADD CONSTRAINT billing_queue_amount_consistency CHECK (
    net_amount_cents = original_amount_cents - credit_amount_cents
  );

-- ========================================
-- PART 5: REPEAT FOR ARCHIVE TABLE
-- ========================================

ALTER TABLE public.billing_queue_archive
  ADD COLUMN IF NOT EXISTS original_amount_cents INTEGER,
  ADD COLUMN IF NOT EXISTS credit_amount_cents INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_amount_cents INTEGER,
  ADD COLUMN IF NOT EXISTS promotion_credits_applied JSONB;

UPDATE public.billing_queue_archive
SET
  original_amount_cents = amount_cents,
  credit_amount_cents = 0,
  net_amount_cents = amount_cents,
  promotion_credits_applied = '[]'::JSONB
WHERE original_amount_cents IS NULL;

ALTER TABLE public.billing_queue_archive
  ALTER COLUMN original_amount_cents SET NOT NULL,
  ALTER COLUMN credit_amount_cents SET NOT NULL,
  ALTER COLUMN net_amount_cents SET NOT NULL;

-- ========================================
-- ROLLBACK INSTRUCTIONS
-- ========================================

-- To rollback this migration:
-- ALTER TABLE public.billing_queue DROP COLUMN IF EXISTS original_amount_cents;
-- ALTER TABLE public.billing_queue DROP COLUMN IF EXISTS credit_amount_cents;
-- ALTER TABLE public.billing_queue DROP COLUMN IF EXISTS net_amount_cents;
-- ALTER TABLE public.billing_queue DROP COLUMN IF EXISTS promotion_credits_applied;
-- ALTER TABLE public.billing_queue_archive DROP COLUMN IF EXISTS original_amount_cents;
-- ALTER TABLE public.billing_queue_archive DROP COLUMN IF EXISTS credit_amount_cents;
-- ALTER TABLE public.billing_queue_archive DROP COLUMN IF EXISTS net_amount_cents;
-- ALTER TABLE public.billing_queue_archive DROP COLUMN IF EXISTS promotion_credits_applied;

-- ========================================
-- END OF MIGRATION
-- ========================================
```

**Key Steps**:
1. Add columns as NULLABLE first
2. Backfill with defaults
3. Verify backfill completed (DO block with counts)
4. Make NOT NULL after backfill
5. Add constraints
6. Include rollback instructions

---

## Pattern: Creating RPC Function

**File**: `20251118000008_create_billing_queue_rpc.sql`

```sql
-- ========================================
-- Migration: Create Billing Queue RPC Functions
-- Date: 2025-11-18
-- Purpose: RPC functions for billing queue operations
-- Dependencies: billing_queue table must exist
-- ========================================

-- ========================================
-- FUNCTION: get_subscriptions_due_for_billing
-- ========================================

CREATE OR REPLACE FUNCTION public.get_subscriptions_due_for_billing(
    hours_ahead INT DEFAULT 24
)
RETURNS TABLE (
    network_schema TEXT,
    network_id UUID,
    subscription_id UUID,
    subscriber_id UUID,
    subscriber_email TEXT,
    price_monthly NUMERIC,
    next_billing_date DATE,
    stripe_customer_id TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_network RECORD;
    v_query TEXT;
    v_cutoff_date DATE;
BEGIN
    -- Calculate cutoff date in EST
    v_cutoff_date := (CURRENT_DATE AT TIME ZONE 'America/New_York')::DATE +
                     (hours_ahead || ' hours')::INTERVAL;

    RAISE NOTICE 'Querying subscriptions due up to %', v_cutoff_date;

    -- Loop through active networks
    FOR v_network IN SELECT * FROM public.get_active_network_schemas()
    LOOP
        -- Validate schema
        IF NOT public.validate_network_schema_for_billing(v_network.schema_name) THEN
            RAISE WARNING 'Skipping invalid schema: %', v_network.schema_name;
            CONTINUE;
        END IF;

        -- Build dynamic query
        v_query := format(
            'SELECT
                %L::TEXT as network_schema,
                %L::UUID as network_id,
                ss.id as subscription_id,
                ss.user_id as subscriber_id,
                p.email as subscriber_email,
                ss.price_monthly,
                ss.next_billing_date,
                p.stripe_customer_id
             FROM %I.service_subscriptions ss
             JOIN %I.profiles p ON ss.user_id = p.id
             WHERE ss.status = ''active''
               AND ss.next_billing_date IS NOT NULL
               AND ss.next_billing_date <= $1',
            v_network.schema_name,
            v_network.network_id,
            v_network.schema_name,
            v_network.schema_name
        );

        -- Execute and aggregate results
        RETURN QUERY EXECUTE v_query USING v_cutoff_date;
    END LOOP;

    RAISE NOTICE 'Query complete';
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_subscriptions_due_for_billing(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_subscriptions_due_for_billing(INT) TO service_role;

-- Comment
COMMENT ON FUNCTION public.get_subscriptions_due_for_billing IS 'Returns all active subscriptions due for billing within specified time window. Used by billing_queue_loader.py service.';

-- ========================================
-- TEST QUERIES
-- ========================================

-- Test with default parameter
-- SELECT * FROM public.get_subscriptions_due_for_billing();

-- Test with custom hours
-- SELECT * FROM public.get_subscriptions_due_for_billing(12);

-- ========================================
-- END OF MIGRATION
-- ========================================
```

**Patterns**:
- Header with metadata
- `CREATE OR REPLACE` for idempotency
- Parameter defaults
- SECURITY DEFINER with explicit search_path
- Dynamic SQL with format()
- GRANT statements
- Comments
- Test queries (commented out)

---

## Pattern: Creating View

**File**: `20250919000001_create_service_address_subscriptions_view.sql`

```sql
-- ========================================
-- Migration: Create Service Address Subscriptions View
-- Date: 2025-09-19
-- Purpose: Comprehensive view of subscriber data by service address
-- Dependencies: All subscriber tables must exist
-- ========================================

CREATE OR REPLACE VIEW subscribers.service_address_subscriptions_view AS
SELECT
    'subscribers' AS schema,

    -- Service Address
    sa.id AS service_address_id,
    sa.address AS full_address,
    sa.address_type,
    sa.ownership_status,
    sa.is_active AS address_is_active,
    sa.verified_date,
    sa.created_at AS address_created_at,

    -- Profile
    sa.user_id AS profile_id,
    p.account_id,
    p.clerk_user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.phone,
    p.created_at AS profile_created_at,
    p.stripe_customer_id,

    -- Available Address (eligibility)
    aa.id AS available_address_id,
    aa.street_addresses,
    aa.city,
    aa.state,
    aa.zip,
    aa.lat,
    aa.long,
    aa.drop_type,
    aa.eligible,
    aa.status AS available_address_status,

    -- Subscription
    ss.id AS subscription_id,
    ss.service_type,
    ss.plan_name,
    ss.provider,
    ss.price_monthly,
    ss.status AS subscription_status,
    ss.started_at AS subscription_started_at,
    ss.next_billing_date,
    ss.last_payment_date,
    ss.product_id,

    -- Contract
    c.id AS contract_id,
    c.contract_type,
    c.status AS contract_status,
    c.signed_at AS contract_signed_at,

    -- Installation Request
    ir.id AS installation_request_id,
    ir.drop_type AS installation_drop_type,
    ir.requested_date AS installation_requested_date,
    ir.status AS installation_status,

    -- Onboarding Progress (pivoted)
    account_created.status AS account_created_status,
    account_created.completed_at AS account_created_completed_at,
    signup_completed.status AS signup_completed_status,
    signup_completed.completed_at AS signup_completed_completed_at,

    -- Computed flags
    (ss.status = 'active') AS has_active_subscription,
    (signup_completed.status = 'completed') AS onboarding_completed

FROM subscribers.service_addresses sa

    -- Required joins
    LEFT JOIN subscribers.profiles p ON sa.user_id = p.id
    LEFT JOIN subscribers.available_addresses aa ON sa.available_address_id = aa.id

    -- Optional related data
    LEFT JOIN subscribers.service_subscriptions ss ON sa.id = ss.service_address_id
    LEFT JOIN subscribers.contracts c ON sa.id = c.service_address_id
    LEFT JOIN subscribers.installation_requests ir ON sa.id = ir.service_address_id

    -- Onboarding steps (specific step names)
    LEFT JOIN subscribers.onboarding_progress account_created
        ON sa.id = account_created.service_address_id
        AND account_created.step_name = 'account_created'

    LEFT JOIN subscribers.onboarding_progress signup_completed
        ON sa.id = signup_completed.service_address_id
        AND signup_completed.step_name = 'signup_completed'

ORDER BY sa.created_at DESC;

-- Grant SELECT
GRANT SELECT ON subscribers.service_address_subscriptions_view TO authenticated;
GRANT SELECT ON subscribers.service_address_subscriptions_view TO service_role;

-- Comment
COMMENT ON VIEW subscribers.service_address_subscriptions_view IS 'Comprehensive subscriber data organized by service address with 50+ columns from 7 tables';

-- ========================================
-- END OF MIGRATION
-- ========================================
```

**Patterns**:
- Literal schema name in SELECT (`'subscribers' AS schema`)
- LEFT JOINs for optional data
- Pivoted onboarding steps (specific step_name values)
- Computed columns for boolean flags
- ORDER BY for default sorting
- GRANT SELECT for views

---

## Pattern: Creating Trigger

**File**: `20250104000001_trigger_auto_apply_promotions_subscribers.sql`

```sql
-- ========================================
-- Migration: Auto-Apply Promotions Trigger (Subscribers Schema)
-- Date: 2025-01-04
-- Purpose: Automatically apply promotions when subscriptions created
-- Dependencies: public.promotions, public.subscription_promotions tables
-- ========================================

-- ========================================
-- PART 1: TRIGGER FUNCTION
-- ========================================

CREATE OR REPLACE FUNCTION subscribers.auto_apply_promotions_to_new_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_network_id UUID;
    v_promo RECORD;
    v_apply_result JSON;
BEGIN
    -- Get network ID for this schema
    SELECT id INTO v_network_id
    FROM public.networks
    WHERE schema_name = 'subscribers';

    -- Only apply if subscription is active
    IF NEW.status = 'active' THEN
        -- Get auto-apply promotions for this network + product
        FOR v_promo IN
            SELECT * FROM public.get_auto_apply_promotions_for_network(
                v_network_id,
                NEW.product_id
            )
        LOOP
            -- Apply promotion via RPC (handles validation)
            SELECT public.apply_promotion_to_subscription(
                v_network_id,
                NEW.id,           -- New subscription ID
                NEW.user_id,      -- Profile ID
                v_promo.promotion_id,
                NULL              -- Auto-applied (no user)
            ) INTO v_apply_result;

            -- Log if application failed (defensive)
            IF NOT (v_apply_result->>'success')::BOOLEAN THEN
                RAISE WARNING 'Failed to auto-apply promotion % to subscription %: %',
                    v_promo.promotion_id, NEW.id, v_apply_result->>'error';
            END IF;
        END LOOP;
    END IF;

    -- Always return NEW for AFTER INSERT trigger
    RETURN NEW;
END;
$$;

-- ========================================
-- PART 2: CREATE TRIGGER
-- ========================================

CREATE TRIGGER trigger_auto_apply_promotions
AFTER INSERT ON subscribers.service_subscriptions
FOR EACH ROW
EXECUTE FUNCTION subscribers.auto_apply_promotions_to_new_subscription();

-- ========================================
-- TEST TRIGGER
-- ========================================

-- Test by inserting a subscription (commented out)
-- INSERT INTO subscribers.service_subscriptions (user_id, product_id, status, price_monthly, next_billing_date)
-- VALUES (...);

-- Verify promotion auto-applied
-- SELECT * FROM public.subscription_promotions WHERE subscription_id = [new id];

-- ========================================
-- ROLLBACK INSTRUCTIONS
-- ========================================

-- To rollback:
-- DROP TRIGGER IF EXISTS trigger_auto_apply_promotions ON subscribers.service_subscriptions;
-- DROP FUNCTION IF EXISTS subscribers.auto_apply_promotions_to_new_subscription();

-- ========================================
-- END OF MIGRATION
-- ========================================
```

**Patterns**:
- Trigger function in same schema as table
- SECURITY DEFINER for cross-schema RPC calls
- RETURN NEW for row-returning triggers
- Defensive error handling (RAISE WARNING, not EXCEPTION)
- Test queries provided
- Rollback instructions

---

## Pattern: Materialized View with Refresh

**File**: `20251118000010_create_billing_revenue_projection_view.sql`

```sql
-- ========================================
-- Migration: Create Billing Revenue Projection View
-- Date: 2025-11-18
-- Purpose: Materialized view for revenue forecasting
-- Dependencies: service_subscriptions tables in all network schemas
-- ========================================

-- ========================================
-- PART 1: CREATE MATERIALIZED VIEW
-- ========================================

CREATE MATERIALIZED VIEW IF NOT EXISTS public.billing_revenue_projection_view AS
WITH network_list AS (
    SELECT * FROM public.get_active_network_schemas()
),
subscription_projections AS (
    SELECT
        n.schema_name AS network_schema,
        n.display_name AS network_name,
        n.network_id,
        ss.*
    FROM network_list n
    CROSS JOIN LATERAL (
        SELECT *
        FROM (
            -- Subscribers schema
            SELECT
                id,
                price_monthly,
                next_billing_date,
                status
            FROM subscribers.service_subscriptions
            WHERE status = 'active' AND n.schema_name = 'subscribers'

            UNION ALL

            -- Jamestown schema
            SELECT
                id,
                price_monthly,
                next_billing_date,
                status
            FROM jamestown_bpu.service_subscriptions
            WHERE status = 'active' AND n.schema_name = 'jamestown_bpu'
        ) sub
        WHERE sub.next_billing_date IS NOT NULL
    ) ss
)
SELECT
    network_schema,
    network_name,
    network_id,
    DATE_TRUNC('month', next_billing_date) AS billing_month,
    COUNT(id) AS total_subscriptions,
    SUM(price_monthly) AS projected_revenue,
    AVG(price_monthly) AS avg_subscription_value,
    MIN(price_monthly) AS min_subscription_value,
    MAX(price_monthly) AS max_subscription_value
FROM subscription_projections
GROUP BY network_schema, network_name, network_id, DATE_TRUNC('month', next_billing_date)
ORDER BY billing_month ASC, network_name;

-- ========================================
-- PART 2: CREATE INDEXES
-- ========================================

-- Unique index (required for CONCURRENT refresh)
CREATE UNIQUE INDEX idx_revenue_projection_unique
ON public.billing_revenue_projection_view (network_schema, billing_month);

-- Query optimization indexes
CREATE INDEX idx_revenue_projection_month
ON public.billing_revenue_projection_view (billing_month);

CREATE INDEX idx_revenue_projection_network
ON public.billing_revenue_projection_view (network_schema);

-- ========================================
-- PART 3: GRANT PERMISSIONS
-- ========================================

GRANT SELECT ON public.billing_revenue_projection_view TO authenticated;
GRANT SELECT ON public.billing_revenue_projection_view TO service_role;

-- ========================================
-- PART 4: REFRESH FUNCTION
-- ========================================

CREATE OR REPLACE FUNCTION public.refresh_revenue_projection_view()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.billing_revenue_projection_view;
    RAISE NOTICE 'Revenue projection view refreshed at %', NOW();
END;
$$;

-- ========================================
-- PART 5: SCHEDULE REFRESH (pg_cron)
-- ========================================

-- Schedule daily refresh at midnight EST
-- SELECT cron.schedule(
--     'refresh-revenue-projection-daily',
--     '0 5 * * *',  -- 5 AM UTC = midnight EST
--     $$SELECT public.refresh_revenue_projection_view()$$
-- );

-- ========================================
-- MANUAL REFRESH
-- ========================================

-- To manually refresh:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.billing_revenue_projection_view;

-- ========================================
-- END OF MIGRATION
-- ========================================
```

**Patterns**:
- CTE for complex queries
- LATERAL join for per-network queries
- UNIQUE index required for CONCURRENT refresh
- Refresh function for convenience
- pg_cron scheduling (commented - enable separately)

---

## Pattern: Network Schema Template Migration

**File**: `20250920000000_create_jamestown_bpu_schema.sql`

```sql
-- ========================================
-- Migration: Create Jamestown BPU Network Schema
-- Date: 2025-09-20
-- Purpose: Complete schema for Jamestown BPU network
-- Dependencies: public.networks table
-- ========================================

-- ========================================
-- PART 1: CREATE SCHEMA
-- ========================================

CREATE SCHEMA IF NOT EXISTS jamestown_bpu;

-- ========================================
-- PART 2: CORE TABLES
-- ========================================

-- Profiles
CREATE TABLE jamestown_bpu.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    account_id TEXT UNIQUE DEFAULT (
        ('JB-' || EXTRACT(year FROM now())) || '-' ||
        lpad((((random() * 999999)::integer)::text, 6, '0')
    ),
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jamestown_profiles_clerk ON jamestown_bpu.profiles(clerk_user_id);
CREATE INDEX idx_jamestown_profiles_email ON jamestown_bpu.profiles(email);

-- Service Addresses
CREATE TABLE jamestown_bpu.service_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES jamestown_bpu.profiles(id) ON DELETE CASCADE,
    street_address TEXT NOT NULL,
    street_address_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    address TEXT, -- Computed full address
    available_address_id UUID,
    address_type TEXT DEFAULT 'primary' CHECK (address_type IN ('primary', 'secondary', 'business')),
    ownership_status TEXT CHECK (ownership_status IN ('owner', 'renter')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jamestown_addresses_user ON jamestown_bpu.service_addresses(user_id);

-- Service Subscriptions
CREATE TABLE jamestown_bpu.service_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES jamestown_bpu.profiles(id) ON DELETE CASCADE,
    service_address_id UUID REFERENCES jamestown_bpu.service_addresses(id),
    product_id UUID REFERENCES public.products(id), -- Cross-schema FK allowed
    service_type TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    price_monthly INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled')),
    started_at TIMESTAMPTZ,
    next_billing_date DATE,
    last_payment_date TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_jamestown_subscriptions_user ON jamestown_bpu.service_subscriptions(user_id);
CREATE INDEX idx_jamestown_subscriptions_product ON jamestown_bpu.service_subscriptions(product_id);
CREATE INDEX idx_jamestown_subscriptions_status ON jamestown_bpu.service_subscriptions(status);
CREATE INDEX idx_jamestown_subscriptions_billing_date ON jamestown_bpu.service_subscriptions(next_billing_date) WHERE status = 'active';

-- ... (continue with installation_requests, contracts, inquiries, onboarding_progress, etc.)

-- ========================================
-- PART 3: ENABLE RLS ON ALL TABLES
-- ========================================

ALTER TABLE jamestown_bpu.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jamestown_bpu.service_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE jamestown_bpu.service_subscriptions ENABLE ROW LEVEL SECURITY;
-- ... (all tables)

-- ========================================
-- PART 4: REGISTER NETWORK
-- ========================================

INSERT INTO public.networks (
    organization_id,
    schema_name,
    name,
    display_name,
    is_active
)
VALUES (
    'jamestown_bpu',
    'jamestown_bpu',
    'jamestown',
    'Jamestown BPU',
    TRUE
)
ON CONFLICT (schema_name) DO NOTHING;

-- ========================================
-- END OF MIGRATION
-- ========================================
```

**Patterns**:
- Schema creation first
- Tables in logical order (profiles, addresses, subscriptions)
- Foreign keys within schema (CASCADE)
- Cross-schema FK to public.products (allowed)
- Account ID generation with network prefix
- RLS enabled on all tables
- Register network in public.networks

---

## Pattern: Updating Function

**File**: `20251119000001_update_calculate_credits_rpc.sql`

```sql
-- ========================================
-- Migration: Update Promotion Credits Calculation RPC
-- Date: 2025-11-19
-- Purpose: Fix stacking cap logic in credit calculation
-- Updates: public.calculate_promotion_credits_for_subscription
-- ========================================

-- Drop old version (if exists)
DROP FUNCTION IF EXISTS public.calculate_promotion_credits_for_subscription(UUID, UUID, INTEGER, DATE, DATE);

-- Create updated version
CREATE OR REPLACE FUNCTION public.calculate_promotion_credits_for_subscription(
    p_network_id UUID,
    p_subscription_id UUID,
    p_subscription_price_cents INTEGER,
    p_billing_period_start DATE,
    p_billing_period_end DATE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_promo RECORD;
    v_total_credits INTEGER := 0;
    v_credits_breakdown JSONB := '[]'::JSONB;
    v_credit_amount INTEGER;
BEGIN
    -- Loop through active promotions
    FOR v_promo IN
        SELECT ...
    LOOP
        -- Calculate credit
        v_credit_amount := CASE ... END;

        v_total_credits := v_total_credits + v_credit_amount;

        -- ... rest of logic
    END LOOP;

    -- ⚠️ IMPORTANT FIX: Cap total credits at subscription price
    v_total_credits := LEAST(v_total_credits, p_subscription_price_cents);

    RETURN json_build_object(
        'total_credit_cents', v_total_credits,
        'net_amount_cents', p_subscription_price_cents - v_total_credits,
        'credits_breakdown', v_credits_breakdown
    );
END;
$$;

-- Re-grant permissions
GRANT EXECUTE ON FUNCTION public.calculate_promotion_credits_for_subscription TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_promotion_credits_for_subscription TO service_role;

-- ========================================
-- CHANGELOG
-- ========================================

-- v1 (original): No cap on total credits (could exceed subscription price)
-- v2 (this migration): Added LEAST() cap to prevent negative invoices

-- ========================================
-- END OF MIGRATION
-- ========================================
```

**Patterns**:
- Drop old version first (handles parameter changes)
- Document what changed in changelog section
- Re-grant permissions after replacement
- Comment on fix/improvement

---

## Common Migration Scenarios

### Scenario 1: Add New Network
**Files Needed**: 5-10 migrations
1. Create schema
2. Create all tables
3. Create views
4. Create RPC functions
5. Enable RLS + policies
6. Update public UNION ALL views
7. Register in public.networks

### Scenario 2: Add Column to Existing Table
**Steps**:
1. ADD COLUMN (nullable)
2. Backfill with default
3. Verify backfill
4. ALTER COLUMN SET NOT NULL
5. Add constraints if needed

### Scenario 3: Create New Feature (e.g., Promotions)
**Files Needed**: 20+ migrations
1. Create tables (6 files)
2. Create RPC functions (7 files)
3. Create views (3 files)
4. Create triggers (3 files)
5. Update existing tables (1 file)

---

## Migration Ordering Rules

### Order 1: Dependencies First
- Tables before views (views reference tables)
- Tables before triggers (triggers reference tables)
- Tables before RPCs that query them

### Order 2: Parent Before Child
- Create parent table before child with FK
- Example: promotions before subscription_promotions

### Order 3: Enable RLS After Creation
- CREATE TABLE
- CREATE INDEX
- ALTER TABLE ENABLE ROW LEVEL SECURITY
- CREATE POLICY

---

## Testing Migrations

### Test Locally
```bash
supabase db reset  # Reset to clean state
# Migrations run automatically

# Verify
psql -h localhost -p 54322 -U postgres
\dt public.*
\df public.*
```

### Test Queries
```sql
-- In migration file (commented)
-- SELECT * FROM <table>;
-- SELECT * FROM <function>(test_params);
-- INSERT INTO <table> VALUES (test_data);
```

### Rollback Test
```bash
# Create rollback migration
supabase migration new rollback_<feature>

# Add DROP statements
# Test rollback locally
supabase db reset
```

---

**Reference**: For complete examples, see `app-support-billing-discounts/supabase/migrations/` (186 files)
