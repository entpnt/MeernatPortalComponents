# RPC Function Examples - Real Implementations from Billing Discounts System

**Last Updated**: 2025-12-03
**Source**: 130+ RPC functions from migrations
**Purpose**: Copy-paste examples for common RPC patterns

---

## RPC Pattern 1: Simple Query Function

**Use Case**: Wrapper around SELECT query with parameters

**Example**: `get_active_promotions_for_network`

```sql
CREATE OR REPLACE FUNCTION public.get_active_promotions_for_network(
    p_network_id UUID
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    discount_type VARCHAR,
    discount_value INTEGER,
    active_usage_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.description,
        p.discount_type,
        p.discount_value,
        COUNT(DISTINCT sp.id) AS active_usage_count
    FROM public.promotions p
    LEFT JOIN public.subscription_promotions sp ON sp.promotion_id = p.id AND sp.is_active = TRUE
    WHERE p.network_id = p_network_id
      AND p.is_active = TRUE
      AND p.valid_from <= NOW()
      AND (p.valid_until IS NULL OR p.valid_until >= NOW())
    GROUP BY p.id
    ORDER BY p.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_active_promotions_for_network TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_promotions_for_network TO service_role;
```

**Key Features**:
- TABLE return type for multiple rows
- LEFT JOIN for optional relationship
- WHERE with multiple conditions
- GROUP BY for aggregation
- GRANT EXECUTE for access control

**Called From React**:
```typescript
const { data } = await supabase.rpc('get_active_promotions_for_network', {
  p_network_id: networkId
});
```

---

## RPC Pattern 2: Insert Operation with Validation

**Use Case**: Create record with business logic validation

**Example**: `apply_promotion_to_subscription`

```sql
CREATE OR REPLACE FUNCTION public.apply_promotion_to_subscription(
    p_network_id UUID,
    p_subscription_id UUID,
    p_profile_id UUID,
    p_promotion_id UUID,
    p_applied_by UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_promotion RECORD;
    v_expires_at TIMESTAMPTZ;
    v_credits_remaining INTEGER;
BEGIN
    -- Validation 1: Promotion exists and active
    SELECT * INTO v_promotion
    FROM public.promotions
    WHERE id = p_promotion_id AND is_active = TRUE;

    IF v_promotion IS NULL THEN
        RETURN json_build_object(
            'success', FALSE,
            'error', 'Promotion not found or inactive',
            'error_code', 'PROMOTION_NOT_FOUND'
        );
    END IF;

    -- Validation 2: Check validity period
    IF v_promotion.valid_from > NOW() OR
       (v_promotion.valid_until IS NOT NULL AND v_promotion.valid_until < NOW()) THEN
        RETURN json_build_object(
            'success', FALSE,
            'error', 'Promotion is not currently valid',
            'error_code', 'PROMOTION_INVALID_PERIOD'
        );
    END IF;

    -- Validation 3: Prevent duplicates
    IF EXISTS (
        SELECT 1 FROM public.subscription_promotions
        WHERE network_id = p_network_id
          AND subscription_id = p_subscription_id
          AND promotion_id = p_promotion_id
          AND is_active = TRUE
    ) THEN
        RETURN json_build_object(
            'success', FALSE,
            'error', 'Promotion already applied to this subscription',
            'error_code', 'DUPLICATE_APPLICATION'
        );
    END IF;

    -- Calculate expiration
    v_expires_at := CASE
        WHEN v_promotion.duration_type = 'days' THEN
            NOW() + (v_promotion.duration_value || ' days')::INTERVAL
        WHEN v_promotion.duration_type = 'months' THEN
            NOW() + (v_promotion.duration_value || ' months')::INTERVAL
        ELSE NULL
    END;

    -- Calculate credits
    v_credits_remaining := CASE
        WHEN v_promotion.duration_type IN ('billing_cycles', 'months') THEN
            v_promotion.duration_value
        ELSE NULL
    END;

    -- Insert subscription_promotion
    INSERT INTO public.subscription_promotions (
        network_id,
        subscription_id,
        profile_id,
        promotion_id,
        applied_by,
        expires_at,
        credits_remaining,
        original_promotion_config
    ) VALUES (
        p_network_id,
        p_subscription_id,
        p_profile_id,
        p_promotion_id,
        p_applied_by,
        v_expires_at,
        v_credits_remaining,
        row_to_json(v_promotion)  -- Snapshot entire row
    );

    -- Log audit trail
    INSERT INTO public.promotion_usage_history (
        event_type,
        network_id,
        subscription_id,
        profile_id,
        promotion_id,
        performed_by
    ) VALUES (
        'promotion_applied',
        p_network_id,
        p_subscription_id,
        p_profile_id,
        p_promotion_id,
        p_applied_by
    );

    -- Return success
    RETURN json_build_object(
        'success', TRUE,
        'message', 'Promotion applied successfully',
        'expires_at', v_expires_at,
        'credits_remaining', v_credits_remaining
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Catch all errors
        RETURN json_build_object(
            'success', FALSE,
            'error', SQLERRM,
            'error_code', SQLSTATE
        );
END;
$$;

GRANT EXECUTE ON FUNCTION public.apply_promotion_to_subscription TO authenticated;
GRANT EXECUTE ON FUNCTION public.apply_promotion_to_subscription TO service_role;
```

**Key Features**:
- JSON return type for API-style responses
- Multiple validation steps
- Early returns on validation failures
- Calculation logic (CASE statements)
- INSERT into multiple tables (main + audit)
- EXCEPTION handler for unexpected errors
- Structured error codes

**Called From React**:
```typescript
const { data } = await supabase.rpc('apply_promotion_to_subscription', {
  p_network_id: networkId,
  p_subscription_id: subscriptionId,
  p_profile_id: profileId,
  p_promotion_id: promotionId,
  p_applied_by: userId
});

if (data.success) {
  // Success
  console.log(data.message);
} else {
  // Error
  console.error(data.error);
}
```

---

## RPC Pattern 3: Update Operation (Atomic Transaction)

**Use Case**: Update record and related data atomically

**Example**: `record_payment_and_update_subscription` (actual implementation)

```sql
CREATE OR REPLACE FUNCTION public.record_payment_and_update_subscription(
    p_network_schema TEXT,
    p_subscription_id UUID,
    p_amount_paid NUMERIC,
    p_stripe_invoice_id TEXT,
    p_stripe_payment_intent_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_payment_record_id UUID;
    v_subscription RECORD;
    v_next_billing_date DATE;
BEGIN
    -- Validate network schema
    IF NOT public.validate_network_schema_for_billing(p_network_schema) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid network schema',
            'error_code', 'INVALID_SCHEMA'
        );
    END IF;

    -- Get subscription details using dynamic SQL
    EXECUTE format(
        'SELECT * FROM %I.service_subscriptions WHERE id = $1',
        p_network_schema
    ) INTO v_subscription USING p_subscription_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Subscription not found',
            'error_code', 'SUBSCRIPTION_NOT_FOUND'
        );
    END IF;

    -- Calculate next billing date
    v_next_billing_date := v_subscription.next_billing_date + INTERVAL '1 month';

    -- BEGIN ATOMIC TRANSACTION (implicit in function)
    BEGIN
        -- 1. Create payment record
        INSERT INTO public.payment_records (
            network_schema_name,
            subscription_id,
            clerk_user_id,
            amount,
            status,
            stripe_invoice_id,
            stripe_payment_intent_id,
            payment_date,
            automated_billing
        ) VALUES (
            p_network_schema,
            p_subscription_id,
            v_subscription.clerk_user_id,
            p_amount_paid,
            'succeeded',
            p_stripe_invoice_id,
            p_stripe_payment_intent_id,
            NOW(),
            true
        ) RETURNING id INTO v_payment_record_id;

        -- 2. Update subscription (dynamic SQL for network schema)
        EXECUTE format(
            'UPDATE %I.service_subscriptions
             SET last_payment_date = $1,
                 next_billing_date = $2,
                 updated_at = NOW()
             WHERE id = $3',
            p_network_schema
        ) USING NOW(), v_next_billing_date, p_subscription_id;

        -- Return success
        RETURN jsonb_build_object(
            'success', true,
            'payment_record_id', v_payment_record_id,
            'old_next_billing_date', v_subscription.next_billing_date,
            'new_next_billing_date', v_next_billing_date
        );

    EXCEPTION WHEN OTHERS THEN
        -- Transaction auto-rolls back on error
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Payment recording failed',
            'error_code', 'TRANSACTION_FAILED',
            'error_detail', SQLERRM
        );
    END;
END;
$$;
```

**Key Features**:
- Atomic transaction (all operations succeed or all fail)
- Dynamic SQL for network schema updates
- Validation before operations
- EXCEPTION handler for rollback
- Detailed success/error responses

---

## RPC Pattern 4: Complex Calculation Function

**Use Case**: Calculate derived values from multiple tables

**Example**: `calculate_promotion_credits_for_subscription`

```sql
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
        SELECT
            sp.id AS subscription_promotion_id,
            sp.promotion_id,
            sp.credits_remaining,
            p.name AS promotion_name,
            p.discount_type,
            p.discount_value
        FROM public.subscription_promotions sp
        JOIN public.promotions p ON p.id = sp.promotion_id
        WHERE sp.network_id = p_network_id
          AND sp.subscription_id = p_subscription_id
          AND sp.is_active = TRUE
          AND (sp.expires_at IS NULL OR sp.expires_at >= p_billing_period_start)
          AND (sp.credits_remaining IS NULL OR sp.credits_remaining > 0)
    LOOP
        -- Calculate credit based on discount type
        v_credit_amount := CASE
            WHEN v_promo.discount_type IN ('days_free', 'months_free') THEN
                p_subscription_price_cents  -- 100% credit
            WHEN v_promo.discount_type = 'percentage_off' THEN
                FLOOR(p_subscription_price_cents * v_promo.discount_value / 100.0)
            WHEN v_promo.discount_type = 'fixed_amount' THEN
                LEAST(v_promo.discount_value, p_subscription_price_cents)  -- Cap at price
            ELSE 0
        END;

        v_total_credits := v_total_credits + v_credit_amount;

        -- Build breakdown array
        v_credits_breakdown := v_credits_breakdown || jsonb_build_object(
            'subscription_promotion_id', v_promo.subscription_promotion_id,
            'promotion_id', v_promo.promotion_id,
            'promotion_name', v_promo.promotion_name,
            'discount_type', v_promo.discount_type,
            'credit_amount_cents', v_credit_amount
        );

        -- Update credits_remaining (side effect)
        IF v_promo.credits_remaining IS NOT NULL THEN
            UPDATE public.subscription_promotions
            SET credits_remaining = credits_remaining - 1,
                credits_used = credits_used + 1
            WHERE id = v_promo.subscription_promotion_id;
        END IF;

        -- Create ledger entry
        INSERT INTO public.promotion_credits (
            subscription_promotion_id,
            network_id,
            subscription_id,
            billing_period_start,
            billing_period_end,
            original_amount_cents,
            credit_amount_cents,
            net_amount_cents,
            status
        ) VALUES (
            v_promo.subscription_promotion_id,
            p_network_id,
            p_subscription_id,
            p_billing_period_start,
            p_billing_period_end,
            p_subscription_price_cents,
            v_credit_amount,
            p_subscription_price_cents - v_credit_amount,
            'pending'
        );
    END LOOP;

    -- Cap total credits at subscription price
    v_total_credits := LEAST(v_total_credits, p_subscription_price_cents);

    RETURN json_build_object(
        'total_credit_cents', v_total_credits,
        'net_amount_cents', p_subscription_price_cents - v_total_credits,
        'credits_breakdown', v_credits_breakdown
    );
END;
$$;
```

**Key Features**:
- FOR loop over query results
- CASE statement for calculation logic
- JSONB array building (||operator)
- Side effects (UPDATE, INSERT) during calculation
- Aggregation of loop results
- Capping logic (LEAST function)

---

## RPC Pattern 5: Multi-Schema Dynamic SQL

**Use Case**: Query all network schemas and aggregate results

**Example**: `get_subscriptions_due_for_billing` (actual implementation)

```sql
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
    -- Calculate cutoff date in EST timezone
    v_cutoff_date := (CURRENT_DATE AT TIME ZONE 'America/New_York')::DATE +
                     (hours_ahead || ' hours')::INTERVAL;

    RAISE NOTICE 'Querying subscriptions due up to %', v_cutoff_date;

    -- Loop through all active networks
    FOR v_network IN SELECT * FROM public.get_active_network_schemas()
    LOOP
        -- Security: Validate schema before dynamic SQL
        IF NOT public.validate_network_schema_for_billing(v_network.schema_name) THEN
            RAISE WARNING 'Skipping invalid network schema: %', v_network.schema_name;
            CONTINUE;
        END IF;

        -- Build dynamic query (safe with format())
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
               AND ss.next_billing_date <= $1
               AND NOT EXISTS (
                   SELECT 1 FROM %I.service_job_tracking sjt
                   WHERE sjt.subscription_id = ss.id
                     AND sjt.tracking_type = ''billing_queue''
                     AND sjt.metadata->>''billing_date'' = ss.next_billing_date::TEXT
               )',
            v_network.schema_name,       -- %L for literal (quoted string)
            v_network.network_id,        -- %L for literal UUID
            v_network.schema_name,       -- %I for identifier (service_subscriptions table)
            v_network.schema_name,       -- %I for identifier (profiles table)
            v_network.schema_name        -- %I for identifier (service_job_tracking table)
        );

        -- Execute and aggregate results
        RETURN QUERY EXECUTE v_query USING v_cutoff_date;
    END LOOP;

    RAISE NOTICE 'Query complete';
END;
$$;
```

**Key Features**:
- Loops through networks dynamically
- Uses format() for safe SQL building
- %L for literals (values), %I for identifiers (table/schema names)
- Parameters with EXECUTE ($1 placeholder)
- RETURN QUERY EXECUTE aggregates results from all iterations
- RAISE NOTICE for logging
- Duplicate prevention (NOT EXISTS subquery)

**Called From Python**:
```python
result = await supabase.rpc('get_subscriptions_due_for_billing', {
    'hours_ahead': 24
}).execute()

# Returns data from all network schemas
for sub in result.data:
    network_schema = sub['network_schema']  # 'subscribers' or 'jamestown_bpu'
    subscription_id = sub['subscription_id']
    # Process billing
```

---

## RPC Pattern 6: Account Setup (Multi-Insert Atomic)

**Use Case**: Create multiple related records atomically

**Example**: `complete_account_setup` (actual implementation)

```sql
CREATE OR REPLACE FUNCTION subscribers.complete_account_setup(
    p_clerk_user_id TEXT,
    p_email TEXT,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_search_address TEXT DEFAULT NULL,
    p_available_address_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    profile_uuid UUID;
    service_address_uuid UUID;
    onboarding_uuid UUID;
    current_clerk_id TEXT;
    full_address TEXT;
BEGIN
    -- Security check: users can only create own accounts
    current_clerk_id := subscribers.get_clerk_user_id();

    IF current_clerk_id != p_clerk_user_id THEN
        RAISE EXCEPTION 'Cannot create account for different user';
    END IF;

    -- STEP 1: Upsert Profile
    INSERT INTO subscribers.profiles (
        clerk_user_id, email, first_name, last_name, phone
    ) VALUES (
        p_clerk_user_id, p_email, p_first_name, p_last_name, p_phone
    )
    ON CONFLICT (clerk_user_id)
    DO UPDATE SET
        email = EXCLUDED.email,
        first_name = COALESCE(EXCLUDED.first_name, subscribers.profiles.first_name),
        last_name = COALESCE(EXCLUDED.last_name, subscribers.profiles.last_name),
        phone = COALESCE(EXCLUDED.phone, subscribers.profiles.phone),
        updated_at = NOW()
    RETURNING id INTO profile_uuid;

    -- STEP 2: Create Service Address (if provided)
    IF p_search_address IS NOT NULL AND p_search_address != '' THEN
        full_address := p_search_address;

        INSERT INTO subscribers.service_addresses (
            user_id,
            address,
            address_type,
            available_address_id,
            is_active
        ) VALUES (
            profile_uuid,
            full_address,
            'primary',
            p_available_address_id,
            true
        )
        RETURNING id INTO service_address_uuid;
    END IF;

    -- STEP 3: Create Onboarding Record
    INSERT INTO subscribers.onboarding_progress (
        user_id,
        step_name,
        status,
        data,
        completed_at,
        service_address_id
    ) VALUES (
        profile_uuid,
        'account_created',
        'completed',
        jsonb_build_object(
            'clerk_user_id', p_clerk_user_id,
            'profile_id', profile_uuid,
            'service_address_id', service_address_uuid,
            'timestamp', NOW()
        ),
        NOW(),
        service_address_uuid
    )
    ON CONFLICT (user_id, step_name)
    DO UPDATE SET
        status = 'completed',
        completed_at = NOW()
    RETURNING id INTO onboarding_uuid;

    -- STEP 4: Mark Inquiry as Converted (if exists)
    IF p_search_address IS NOT NULL THEN
        UPDATE subscribers.inquiries
        SET
            converted_to_signup = true,
            user_id = profile_uuid,
            updated_at = NOW()
        WHERE search_address = p_search_address
          AND converted_to_signup = false
          AND user_id IS NULL;
    END IF;

    -- STEP 5: Build Success Response
    RETURN jsonb_build_object(
        'success', true,
        'profile_id', profile_uuid,
        'service_address_id', service_address_uuid,
        'onboarding_id', onboarding_uuid,
        'account_id', (SELECT account_id FROM subscribers.profiles WHERE id = profile_uuid),
        'created_at', NOW()
    );

EXCEPTION
    WHEN OTHERS THEN
        -- Transaction auto-rolls back
        RAISE EXCEPTION 'Account setup failed: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Key Features**:
- Multi-step atomic transaction (5 steps)
- UPSERT pattern (ON CONFLICT DO UPDATE)
- RETURNING clause to capture IDs
- Conditional inserts (IF checks)
- COALESCE for optional field updates
- JSONB response with all created IDs
- EXCEPTION rollback (undoes all steps on error)

**Called From React**:
```typescript
const { data } = await supabase.rpc('complete_account_setup', {
  p_clerk_user_id: user.id,
  p_email: user.email,
  p_first_name: firstName,
  p_last_name: lastName,
  p_search_address: address
});

// data = {success: true, profile_id: 'uuid', service_address_id: 'uuid', ...}
```

---

## RPC Pattern 7: Toggle Function (Upsert)

**Use Case**: Toggle boolean setting with upsert

**Example**: `toggle_service_provider_promotion_optin`

```sql
CREATE OR REPLACE FUNCTION public.toggle_service_provider_promotion_optin(
    p_service_provider_id TEXT,
    p_promotion_id UUID,
    p_enabled BOOLEAN,
    p_updated_by UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_active_usage_count INTEGER;
BEGIN
    -- Check if promotion exists
    IF NOT EXISTS (SELECT 1 FROM public.promotions WHERE id = p_promotion_id) THEN
        RETURN json_build_object(
            'success', FALSE,
            'error', 'Promotion not found'
        );
    END IF;

    -- If disabling, count active usage
    IF p_enabled = FALSE THEN
        SELECT COUNT(DISTINCT sp.id) INTO v_active_usage_count
        FROM public.subscription_promotions sp
        JOIN public.networks n ON n.id = sp.network_id
        WHERE sp.promotion_id = p_promotion_id
          AND sp.is_active = TRUE
          AND n.organization_id = p_service_provider_id;
    END IF;

    -- Upsert settings
    INSERT INTO public.promotion_service_provider_settings (
        promotion_id,
        service_provider_id,
        is_enabled,
        updated_by,
        notes
    ) VALUES (
        p_promotion_id,
        p_service_provider_id,
        p_enabled,
        p_updated_by,
        p_notes
    )
    ON CONFLICT (promotion_id, service_provider_id)
    DO UPDATE SET
        is_enabled = EXCLUDED.is_enabled,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW(),
        notes = COALESCE(EXCLUDED.notes, promotion_service_provider_settings.notes);

    -- Return with warning if disabling
    RETURN json_build_object(
        'success', TRUE,
        'message', CASE
            WHEN p_enabled THEN 'Promotion enabled'
            ELSE 'Promotion disabled'
        END,
        'active_usage_count', COALESCE(v_active_usage_count, 0),
        'warning', CASE
            WHEN v_active_usage_count > 0 THEN
                format('%s subscribers currently using this promotion', v_active_usage_count)
            ELSE NULL
        END
    );
END;
$$;
```

**Key Features**:
- UPSERT pattern (ON CONFLICT DO UPDATE)
- Conditional logic (count usage if disabling)
- COALESCE for NULL handling
- Warning message if action has consequences
- format() for string interpolation

---

## RPC Pattern 8: Batch Operations

**Use Case**: Process multiple records efficiently

**Example**: `batch_convert_installation_requests_to_work_orders`

```sql
CREATE OR REPLACE FUNCTION public.batch_convert_installation_requests_to_work_orders(
    p_installation_request_ids UUID[]
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_request_id UUID;
    v_work_order_id UUID;
    v_success_count INTEGER := 0;
    v_error_count INTEGER := 0;
    v_errors JSONB := '[]'::JSONB;
BEGIN
    -- Loop through array
    FOREACH v_request_id IN ARRAY p_installation_request_ids
    LOOP
        BEGIN
            -- Call single conversion function
            SELECT public.convert_installation_request_to_work_order(v_request_id)
            INTO v_work_order_id;

            v_success_count := v_success_count + 1;

        EXCEPTION WHEN OTHERS THEN
            v_error_count := v_error_count + 1;
            v_errors := v_errors || jsonb_build_object(
                'installation_request_id', v_request_id,
                'error', SQLERRM
            );
        END;
    END LOOP;

    RETURN json_build_object(
        'success', v_error_count = 0,
        'total_processed', array_length(p_installation_request_ids, 1),
        'success_count', v_success_count,
        'error_count', v_error_count,
        'errors', v_errors
    );
END;
$$;
```

**Key Features**:
- Array parameter (UUID[])
- FOREACH loop
- Per-item EXCEPTION handling (continue on error)
- Aggregate success/error counts
- Array of errors for troubleshooting

---

## RPC Pattern 9: Worker Queue Fetch (Row Locking)

**Use Case**: Workers fetch jobs with concurrency safety

**Example**: `fetch_pending_email_jobs` (actual implementation excerpt)

```sql
CREATE OR REPLACE FUNCTION public.fetch_pending_email_jobs(
    p_batch_size INTEGER DEFAULT 10,
    p_mark_processing BOOLEAN DEFAULT TRUE
)
RETURNS TABLE (
    job_id UUID,
    job_status TEXT,
    customer_email TEXT,
    context_data JSONB,
    -- ... 30+ columns
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_job_ids UUID[];
BEGIN
    -- Step 1: Select job IDs with row locking
    SELECT ARRAY_AGG(eq.id)
    INTO v_job_ids
    FROM (
        SELECT eq.id
        FROM public.email_queue_jobs eq
        WHERE eq.status = 'pending'
          AND (eq.next_retry_at IS NULL OR eq.next_retry_at <= NOW())
        ORDER BY eq.queued_at ASC
        LIMIT p_batch_size
        FOR UPDATE OF eq SKIP LOCKED  -- ⚠️ CRITICAL: Skip locked rows
    ) jobs;

    -- Step 2: No jobs found
    IF v_job_ids IS NULL OR array_length(v_job_ids, 1) IS NULL THEN
        RETURN;  -- Empty result
    END IF;

    -- Step 3: Mark jobs as processing
    IF p_mark_processing THEN
        UPDATE public.email_queue_jobs
        SET
            status = 'processing',
            processing_started_at = NOW(),
            updated_at = NOW()
        WHERE id = ANY(v_job_ids);
    END IF;

    -- Step 4: Return job data with all joined config
    RETURN QUERY
    SELECT
        eq.id AS job_id,
        eq.status AS job_status,
        eq.customer_email,
        eq.context_data,
        -- ... 30+ columns from joins
    FROM public.email_queue_jobs eq
    INNER JOIN public.networks n ON n.id = eq.network_id
    WHERE eq.id = ANY(v_job_ids)
    ORDER BY eq.queued_at ASC;
END;
$$;
```

**Key Features**:
- `FOR UPDATE OF ... SKIP LOCKED` - Critical for concurrency
- Two-step process (lock, then fetch details)
- ARRAY_AGG to collect IDs
- Conditional update (mark_processing parameter)
- Returns rich data with all joins (single query)

**Concurrency Safety**:
- Multiple workers can call simultaneously
- SKIP LOCKED prevents duplicate processing
- Each worker gets different jobs

---

## RPC Pattern 10: Eligibility Check Function

**Use Case**: Determine if operation is allowed with reasons

**Example**: `get_applicable_promotions_for_subscription`

```sql
CREATE OR REPLACE FUNCTION public.get_applicable_promotions_for_subscription(
    p_network_id UUID,
    p_subscription_id UUID,
    p_product_id UUID
)
RETURNS TABLE (
    promotion_id UUID,
    name VARCHAR,
    description TEXT,
    is_eligible BOOLEAN,
    ineligibility_reason TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH promo_check AS (
        SELECT
            p.id AS promotion_id,
            p.name,
            p.description,

            -- Check 1: Product eligibility
            CASE
                WHEN p.applies_to_all_products THEN TRUE
                WHEN EXISTS (
                    SELECT 1 FROM public.promotion_product_eligibility ppe
                    WHERE ppe.promotion_id = p.id AND ppe.product_id = p_product_id
                ) THEN TRUE
                ELSE FALSE
            END AS product_eligible,

            -- Check 2: Already applied?
            EXISTS (
                SELECT 1 FROM public.subscription_promotions sp
                WHERE sp.promotion_id = p.id
                  AND sp.network_id = p_network_id
                  AND sp.subscription_id = p_subscription_id
                  AND sp.is_active = TRUE
            ) AS already_applied,

            -- Check 3: Service provider opted in?
            COALESCE(
                (SELECT spps.is_enabled
                 FROM public.promotion_service_provider_settings spps
                 JOIN public.networks n ON n.organization_id = spps.service_provider_id
                 WHERE spps.promotion_id = p.id AND n.id = p_network_id),
                TRUE  -- Default: opted in
            ) AS provider_enabled

        FROM public.promotions p
        WHERE p.network_id = p_network_id
          AND p.is_active = TRUE
          AND p.valid_from <= NOW()
          AND (p.valid_until IS NULL OR p.valid_until >= NOW())
    )
    SELECT
        pc.promotion_id,
        pc.name,
        pc.description,

        -- Combine all checks
        (pc.product_eligible AND NOT pc.already_applied AND pc.provider_enabled) AS is_eligible,

        -- Provide reason if ineligible
        CASE
            WHEN NOT pc.product_eligible THEN 'Product not eligible for this promotion'
            WHEN pc.already_applied THEN 'Promotion already applied to this subscription'
            WHEN NOT pc.provider_enabled THEN 'Service provider has opted out of this promotion'
            ELSE NULL
        END AS ineligibility_reason

    FROM promo_check pc
    ORDER BY pc.name;
END;
$$;
```

**Key Features**:
- CTE for complex eligibility checks
- Multiple EXISTS subqueries
- COALESCE for default values
- Boolean AND logic for final eligibility
- CASE statement for user-friendly reasons
- Returns both eligible and ineligible (with reasons)

**Called From React**:
```typescript
const { data: promotions } = await supabase.rpc('get_applicable_promotions_for_subscription', {
  p_network_id: networkId,
  p_subscription_id: subscriptionId,
  p_product_id: productId
});

const eligible = promotions.filter(p => p.is_eligible);
const ineligible = promotions.filter(p => !p.is_eligible);

// Show eligible in dropdown
// Show ineligible with reasons in help text
```

---

## Calling RPCs from React

### Pattern 1: Direct RPC Call
```typescript
const { data, error } = await supabase.rpc('function_name', {
  p_param1: value1,
  p_param2: value2
});
```

### Pattern 2: With React Query
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['key', param],
  queryFn: async () => {
    const result = await supabase.rpc('function_name', { p_param: param });
    return result.data;
  }
});
```

### Pattern 3: With Mutation
```typescript
const mutation = useMutation({
  mutationFn: async (params) => {
    const result = await supabase.rpc('function_name', params);
    return result.data;
  },
  onSuccess: (data) => {
    if (data.success) {
      // Handle success
    } else {
      // Handle error from function
      console.error(data.error);
    }
  }
});

// Call mutation
mutation.mutate({ p_param: value });
```

---

## Calling RPCs from Python

### Pattern 1: Simple Call
```python
result = await supabase.rpc('function_name', {
    'p_param1': value1,
    'p_param2': value2
}).execute()

if result.data:
    # Process data
```

### Pattern 2: With Error Handling
```python
try:
    result = await supabase.rpc('function_name', params).execute()

    if result.error:
        logger.error(f"RPC error: {result.error}")
        return None

    return result.data

except Exception as e:
    logger.error(f"Failed to call RPC: {str(e)}")
    raise
```

---

## Performance Optimization

### Use STABLE Functions for Cacheable Results
```sql
CREATE FUNCTION get_network_config(p_network_id UUID)
RETURNS TABLE (...)
LANGUAGE plpgsql
STABLE  -- Result can be cached during query
AS $$ ... $$;
```

**When**: Function has no side effects and returns same result for same inputs

### Use VOLATILE for Functions with Side Effects
```sql
CREATE FUNCTION apply_promotion(...)
RETURNS JSON
LANGUAGE plpgsql
VOLATILE  -- Default, cannot be cached
AS $$ ... $$;
```

**When**: Function inserts/updates data or returns different results each call

---

## Security Checklist for RPCs

- [ ] Uses SECURITY DEFINER (if needs elevated privileges)
- [ ] Has `SET search_path = <schema>` (prevents injection)
- [ ] Validates all input parameters
- [ ] Uses format() with %I for dynamic identifiers
- [ ] Uses parameterized queries (EXECUTE ... USING)
- [ ] Has EXCEPTION handler for errors
- [ ] Returns structured errors (JSON with error codes)
- [ ] Has GRANT EXECUTE statements
- [ ] Documented with COMMENT

---

**Reference**: For complete RPC implementations, see `ProjectDocumentation/DatabaseAnalysis/INVENTORY.md` (51 KB with full SQL)
