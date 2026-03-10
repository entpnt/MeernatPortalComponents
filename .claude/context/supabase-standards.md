# Supabase Development Standards - Billing Discounts System

**Last Updated**: 2025-12-03
**Project**: meernat-base-structure
**Migration Count**: 186 existing files

---

## Migration File Standards

### Naming Convention
**Pattern**: `YYYYMMDDHHMMSS_schema_descriptive_name.sql`

**Examples**:
```
20251118000003_create_billing_queue_tables.sql
20251118000008_create_billing_queue_rpc.sql
20250919130000_complete_account_setup_function.sql
```

**Rules**:
- Timestamp: Year-Month-Day-Hour-Minute-Second (24-hour format)
- Description: Snake_case, descriptive, specific
- Extension: Always `.sql`

### Migration File Structure
```sql
-- ========================================
-- Migration: <Short Description>
-- Date: YYYY-MM-DD
-- Purpose: <1-2 sentence description>
-- Author: <team name>
-- Dependencies: <list migration files this depends on>
-- ========================================

-- PART 1: <Section Description>
CREATE TABLE ...;

-- PART 2: <Section Description>
CREATE INDEX ...;

-- PART 3: <Section Description>
CREATE FUNCTION ...;

-- ========================================
-- END OF MIGRATION
-- ========================================
```

### Migration Organization
**One migration file should contain**:
- Related changes only (e.g., table + its indexes + its triggers)
- OR single large function/view
- OR set of related RPCs

**Separate files for**:
- Tables (one file per logical group)
- RPC functions (can group 3-5 related functions)
- Views (can group related views)
- Triggers (with tables or separate)

---

## Table Creation Standards

### Template
```sql
CREATE TABLE <schema>.<table_name> (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys (group together)
  user_id UUID NOT NULL REFERENCES <schema>.profiles(id) ON DELETE CASCADE,
  network_id UUID NOT NULL REFERENCES public.networks(id) ON DELETE CASCADE,

  -- Core Fields (group by purpose)
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),

  -- Amount/Numeric Fields
  price_monthly INTEGER NOT NULL CHECK (price_monthly >= 0),

  -- Boolean Flags
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,

  -- JSONB Fields
  metadata JSONB,
  settings JSONB NOT NULL DEFAULT '{}'::JSONB,

  -- Audit Fields (always at end)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints (at end)
  CONSTRAINT <table>_unique_name UNIQUE(network_id, name),
  CONSTRAINT <table>_valid_dates CHECK (valid_until IS NULL OR valid_until >= valid_from)
);

-- Indexes (after table creation)
CREATE INDEX idx_<table>_<column> ON <schema>.<table>(<column>);
CREATE INDEX idx_<table>_<col1>_<col2> ON <schema>.<table>(<col1>, <col2>) WHERE <condition>;

-- RLS (after indexes)
ALTER TABLE <schema>.<table> ENABLE ROW LEVEL SECURITY;

-- Comments (after RLS)
COMMENT ON TABLE <schema>.<table> IS '<Purpose description>';
COMMENT ON COLUMN <schema>.<table>.<column> IS '<Column description>';
```

---

## RPC Function Standards

### Function Template
```sql
CREATE OR REPLACE FUNCTION <schema>.<function_name>(
  -- Parameters: p_ prefix
  p_param_name TYPE,
  p_optional_param TYPE DEFAULT NULL
)
RETURNS <return_type>
LANGUAGE plpgsql
SECURITY DEFINER              -- For elevated privileges
SET search_path = <schema>    -- Security: explicit search path
AS $$
DECLARE
  -- Variables: v_ prefix
  v_result RECORD;
  v_count INTEGER;
BEGIN
  -- Function body

  -- Return success
  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    -- Handle errors
    RAISE EXCEPTION 'Function failed: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION <schema>.<function_name> TO authenticated;
GRANT EXECUTE ON FUNCTION <schema>.<function_name> TO service_role;

-- Comment
COMMENT ON FUNCTION <schema>.<function_name> IS '<Purpose description>';
```

### Parameter Naming
- **Prefix**: `p_` for parameters
- **Style**: Snake_case
- **Examples**: `p_network_id`, `p_subscription_id`, `p_amount_cents`

### Variable Naming
- **Prefix**: `v_` for variables
- **Style**: Snake_case
- **Examples**: `v_result`, `v_subscription`, `v_total_amount`

### Return Types

**TABLE**: For multiple rows
```sql
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  amount NUMERIC
)
```

**JSONB**: For structured results (API-style)
```sql
RETURNS JSONB

-- Return:
RETURN jsonb_build_object(
  'success', TRUE,
  'data', row_to_json(record),
  'message', 'Operation successful'
);
```

**VOID**: For operations with no return value
```sql
RETURNS VOID
```

**TRIGGER**: For trigger functions
```sql
RETURNS TRIGGER
```

---

## SECURITY DEFINER Usage

### When to Use
1. Functions that bypass RLS intentionally (e.g., billing workers)
2. Functions that query multiple schemas
3. Functions called by triggers
4. Functions that need elevated privileges

### Security Requirements
```sql
CREATE FUNCTION ...
SECURITY DEFINER
SET search_path = <schema>  -- ⚠️ REQUIRED for security
AS $$
BEGIN
  -- Validate all inputs
  IF NOT validate_input(p_param) THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;

  -- Function body
END;
$$;
```

**Critical**: Always set `search_path` to prevent search path attacks

---

## Dynamic SQL Standards

### Safe Identifier Quoting
```sql
-- ✅ CORRECT: Use format() with %I
v_query := format('SELECT * FROM %I.%I WHERE id = $1', schema_name, table_name);
EXECUTE v_query USING param_value;

-- ❌ WRONG: String concatenation
v_query := 'SELECT * FROM ' || schema_name || '.' || table_name; -- SQL INJECTION!
```

### Format Placeholders
- `%I` - Identifier (table, schema, column names) - quoted safely
- `%L` - Literal value - quoted safely
- `%s` - Raw string (UNSAFE - avoid)

### Parameterized Queries
```sql
-- ✅ CORRECT: Use parameters for values
EXECUTE v_query USING param1, param2;

-- ❌ WRONG: Embed values in format
format('... WHERE status = %L', status_value); -- Prefer parameters
```

---

## View Standards

### Naming
- **Purpose-based**: `<entity>_<purpose>_view`
- **Examples**: `service_address_subscriptions_view`, `billing_queue_with_history_view`
- **Aggregations**: `<entity>_summary_by_<dimension>`
- **Examples**: `promotion_usage_summary_by_network`

### View Organization
```sql
CREATE OR REPLACE VIEW <schema>.<view_name> AS
-- Main SELECT with clear structure
SELECT
  -- Columns from primary table
  t1.id,
  t1.name,

  -- Columns from joined tables (prefix with table alias)
  t2.email AS customer_email,
  t3.address AS service_address,

  -- Computed columns
  CASE
    WHEN t1.status = 'active' THEN 'Active'
    ELSE 'Inactive'
  END AS status_display,

  -- Aggregations (if needed)
  COUNT(t4.id) AS related_count

FROM <schema>.<primary_table> t1
LEFT JOIN <schema>.<related_table> t2 ON t2.id = t1.foreign_key_id
LEFT JOIN <schema>.<another_table> t3 ON t3.id = t1.other_foreign_key_id
WHERE t1.is_deleted = FALSE
ORDER BY t1.created_at DESC;

-- Comment
COMMENT ON VIEW <schema>.<view_name> IS '<Purpose and usage description>';
```

### Materialized View Pattern
```sql
-- Create materialized view
CREATE MATERIALIZED VIEW <schema>.<view_name> AS
SELECT ... (expensive aggregation query);

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_<view_name>_unique ON <schema>.<view_name>(<unique_columns>);

-- Create non-unique indexes for queries
CREATE INDEX idx_<view_name>_<column> ON <schema>.<view_name>(<column>);

-- Schedule refresh (pg_cron)
SELECT cron.schedule(
  '<view_name>-daily-refresh',
  '0 0 * * *',  -- Daily at midnight
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY <schema>.<view_name>$$
);
```

**When to Use**: Heavy aggregations, infrequent updates (e.g., revenue projections)

---

## Trigger Standards

### Trigger Function Template
```sql
CREATE OR REPLACE FUNCTION <schema>.<trigger_function_name>()
RETURNS TRIGGER
LANGUAGE plpgsql
[SECURITY DEFINER]  -- If needs elevated privileges
AS $$
DECLARE
  -- Variables
BEGIN
  -- Trigger logic using NEW and OLD records

  RETURN NEW;  -- For BEFORE/AFTER INSERT/UPDATE
  -- OR
  RETURN OLD;  -- For BEFORE DELETE
  -- OR
  RETURN NULL; -- To cancel operation
END;
$$;
```

### Trigger Creation
```sql
CREATE TRIGGER <trigger_name>
<BEFORE|AFTER> <INSERT|UPDATE|DELETE> ON <schema>.<table>
FOR EACH ROW
[WHEN (<condition>)]  -- Optional filter
EXECUTE FUNCTION <schema>.<trigger_function_name>();
```

### Trigger Naming
**Pattern**: `trigger_<action>_<table>_<purpose>`

**Examples**:
- `trigger_update_subscriptions_updated_at`
- `trigger_auto_apply_promotions`
- `trigger_expire_subscription_promotion`

---

## Index Standards

### Naming Convention
**Pattern**: `idx_<table>_<column>[_<column2>]`

**Examples**:
```sql
CREATE INDEX idx_promotions_network ON public.promotions(network_id);
CREATE INDEX idx_promotions_network_active ON public.promotions(network_id, is_active);
```

### When to Create Indexes

**Always**:
- Foreign key columns
- Columns in WHERE clauses of frequent queries
- Columns in JOIN conditions
- Columns in ORDER BY of large tables

**Consider**:
- Partial indexes for filtered queries
- Composite indexes for multi-column WHERE clauses
- Covering indexes for specific queries

**Avoid**:
- Indexing every column (slows writes)
- Duplicate indexes (check existing indexes first)

---

## JSONB Standards

### Field Naming
**Common JSONB fields**:
- `metadata` - Flexible additional data
- `settings` - Configuration data
- `context_data` - Contextual information
- `event_data` - Event details for audit trails
- `<entity>_data` - Entity-specific data (e.g., `stripe_session_data`)

### Structure
```sql
-- Store structured data
metadata JSONB NOT NULL DEFAULT '{}'::JSONB

-- Example data:
{
  "key": "value",
  "nested": {
    "field": 123
  },
  "array": ["item1", "item2"]
}
```

### Querying JSONB
```sql
-- Extract text value
metadata->>'key'

-- Extract JSON object
metadata->'nested'

-- Check key exists
metadata ? 'key'

-- Array contains
metadata @> '{"array": ["item1"]}'
```

### JSONB Indexes
```sql
-- GIN index for JSONB queries
CREATE INDEX idx_<table>_<jsonb_field> ON <table> USING GIN(<jsonb_field>);

-- Specific key index
CREATE INDEX idx_<table>_<jsonb_field>_<key> ON <table> ((<jsonb_field>->>'key'));
```

---

## Error Handling Standards

### Pattern 1: JSONB Error Response
```sql
CREATE FUNCTION ...
RETURNS JSONB AS $$
BEGIN
  -- Validation
  IF NOT valid_input(p_param) THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'Invalid input',
      'error_code', 'INVALID_INPUT',
      'details', jsonb_build_object('param', p_param)
    );
  END IF;

  -- Operation
  -- ...

  RETURN jsonb_build_object(
    'success', TRUE,
    'message', 'Operation successful',
    'data', result_data
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', SQLERRM,
      'error_code', SQLSTATE,
      'sql_state', SQLSTATE
    );
END;
$$;
```

### Pattern 2: RAISE EXCEPTION
```sql
CREATE FUNCTION ...
AS $$
BEGIN
  IF NOT valid_condition THEN
    RAISE EXCEPTION 'Descriptive error message: % (details: %)', param1, param2
      USING HINT = 'Helpful hint for resolution';
  END IF;
END;
$$;
```

**When to Use**:
- JSONB Response: For API-style functions called from apps
- RAISE EXCEPTION: For internal functions, triggers, validation functions

---

## RLS Policy Standards

### Policy Naming
**Pattern**: `<who>_<action>_<condition>_policy`

**Examples**:
- `users_select_own_data_policy`
- `admins_all_access_policy`
- `org_members_view_network_data_policy`

### Policy Template
```sql
-- Enable RLS first
ALTER TABLE <schema>.<table> ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "<descriptive_policy_name>"
ON <schema>.<table>
FOR <ALL|SELECT|INSERT|UPDATE|DELETE>
TO <authenticated|anon|service_role>
USING (<condition>)           -- For SELECT, UPDATE, DELETE
[WITH CHECK (<condition>)];   -- For INSERT, UPDATE

-- Example:
CREATE POLICY "users_select_own_profiles"
ON subscribers.profiles
FOR SELECT
TO authenticated
USING (clerk_user_id = (auth.jwt()->>'sub'));
```

### Common Policy Patterns

**User Owns Data**:
```sql
USING (clerk_user_id = (auth.jwt()->>'sub'))
```

**Organization Access**:
```sql
USING (organization_id = (auth.jwt()->>'org_id'))
```

**Admin Full Access**:
```sql
USING ((auth.jwt()->>'org_role') = 'org:admin')
```

**Multi-Role Access**:
```sql
USING (
  (auth.jwt()->>'org_role') IN ('org:admin', 'org:sales_management')
)
```

**Network-Based Access**:
```sql
USING (
  network_id IN (
    SELECT n.id FROM public.networks n
    WHERE n.organization_id = (auth.jwt()->>'org_id')
  )
)
```

---

## Comment Standards

### Table Comments
```sql
COMMENT ON TABLE <schema>.<table> IS 'Purpose and key usage description';

-- Example:
COMMENT ON TABLE public.promotions IS 'Promotion definitions per network with discount configuration and validity periods';
```

### Column Comments
```sql
COMMENT ON COLUMN <schema>.<table>.<column> IS 'Column purpose and constraints';

-- Example:
COMMENT ON COLUMN public.promotions.discount_value IS 'Discount amount: 90 for "90 days free", 30 for "30% off", 1000 for "$10.00 off" (in cents)';
```

**When to Add**:
- Non-obvious column purposes
- Business logic constraints
- Data format specifications
- External ID references (Stripe, Clerk, FlowOps)

---

## Constraint Naming

### Pattern
- PRIMARY KEY: Auto-named by PostgreSQL
- FOREIGN KEY: `fk_<table>_<column>` or auto-named
- UNIQUE: `<table>_<column>_unique` or auto-named
- CHECK: `<table>_<validation_name>`

### Examples
```sql
-- Check constraints (always named)
CONSTRAINT promotions_valid_duration CHECK (
  (duration_type IS NULL AND duration_value IS NULL) OR
  (duration_type IS NOT NULL AND duration_value > 0)
)

CONSTRAINT billing_queue_amount_consistency CHECK (
  net_amount_cents = original_amount_cents - credit_amount_cents
)

-- Unique constraints
CONSTRAINT subscription_promotions_unique_application UNIQUE(network_id, subscription_id, promotion_id)
```

---

## Type Standards

### Enums (Avoid in Migrations)
**Problem**: ALTER TYPE is complex, requires migrations for new values

**Pattern**: Use TEXT with CHECK constraint instead
```sql
-- ✅ FLEXIBLE: Can add values easily
status TEXT CHECK (status IN ('pending', 'active', 'suspended', 'cancelled'))

-- ❌ RIGID: Requires ALTER TYPE migration
status promotion_status_enum
```

**Exception**: Use ENUMs for truly fixed values (e.g., drop_type enum exists for legacy reasons)

### UUID Generation
```sql
-- ✅ STANDARD: Use gen_random_uuid()
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- ❌ AVOID: uuid_generate_v4() (requires extension)
```

### Timestamps
```sql
-- ✅ ALWAYS: Use TIMESTAMPTZ (timezone-aware)
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

-- ❌ AVOID: TIMESTAMP (no timezone)
created_at TIMESTAMP
```

### Amounts
```sql
-- ✅ MONEY: Use INTEGER (cents)
price_monthly INTEGER NOT NULL

-- ✅ CALCULATIONS: Use NUMERIC for precision
revenue_projection NUMERIC(10, 2)

-- ❌ AVOID: FLOAT/REAL (floating point errors)
```

---

## Migration Deployment Standards

### Local Testing
```bash
# Reset local database
supabase db reset

# Test migration
supabase migration up

# Verify
supabase db diff
```

### Production Deployment
```bash
# Link to production
supabase link --project-ref meernat-base-structure

# Check diff
supabase db diff --linked

# Push migrations
supabase db push

# Verify
supabase db diff --linked
# Should show: "No schema changes detected"
```

### Rollback Preparation
**Always include rollback instructions**:
```sql
-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================

-- To rollback this migration:
-- ALTER TABLE public.address_update_stats DROP COLUMN IF EXISTS upload_started_at;
-- ALTER TABLE public.address_update_stats DROP COLUMN IF EXISTS upload_completed_at;
```

---

## Edge Function Standards

### Directory Structure
```
supabase/functions/<function-name>/
├── index.ts          -- Entry point
├── utils.ts          -- Helper functions (optional)
└── types.ts          -- TypeScript types (optional)
```

### Edge Function Template
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Parse request
    const { param1, param2 } = await req.json();

    // Validate inputs
    if (!param1) {
      throw new Error('param1 is required');
    }

    // Create Supabase client (service role)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Business logic
    const result = await supabase
      .from('table')
      .select('*')
      .eq('id', param1);

    if (result.error) throw result.error;

    // Return success
    return new Response(
      JSON.stringify({ success: true, data: result.data }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    );

  } catch (error) {
    // Return error
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    );
  }
});
```

---

## Testing Standards

### RPC Function Tests
**Location**: Comments in migration file OR separate test file

```sql
-- Test success case
SELECT * FROM <function>(valid_params);
-- Expected: Success result

-- Test error case
SELECT * FROM <function>(invalid_params);
-- Expected: Error with specific message

-- Test edge case
SELECT * FROM <function>(edge_case_params);
-- Expected: Handled gracefully
```

### View Tests
```sql
-- Test view returns data
SELECT COUNT(*) FROM <view>;
-- Expected: > 0 (if data exists)

-- Test view structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = '<schema>' AND table_name = '<view>';
-- Expected: All expected columns present
```

---

## Performance Standards

### Query Optimization
1. **Index foreign keys**: Always
2. **Limit result sets**: Use LIMIT when appropriate
3. **Avoid SELECT ***: Select only needed columns in production code (views OK)
4. **Use EXISTS**: Instead of COUNT(*) > 0

### Example
```sql
-- ✅ FAST: EXISTS
IF EXISTS (SELECT 1 FROM table WHERE condition) THEN ...

-- ❌ SLOW: COUNT
IF (SELECT COUNT(*) FROM table WHERE condition) > 0 THEN ...
```

---

## Versioning Standards

### Function Versioning
**When to create new version**:
- Breaking changes to parameters or return type
- Significant logic changes

**Pattern**:
```sql
-- Keep old version (deprecated)
CREATE FUNCTION store_stripe_payment_data(...) -- v1

-- Create new version
CREATE FUNCTION store_stripe_payment_data_v2(...) -- v2 with improvements

-- Eventually drop old version in later migration
DROP FUNCTION store_stripe_payment_data(...);
```

**Current Example**: `store_stripe_payment_data` and `store_stripe_payment_data_v2` both exist

---

## Transaction Standards

### Atomic Operations
```sql
BEGIN;
  -- Multiple related operations
  INSERT INTO table1 ...;
  UPDATE table2 ...;
  DELETE FROM table3 ...;

  -- Validate
  IF NOT valid_state() THEN
    RAISE EXCEPTION 'Invalid state after operations';
  END IF;

COMMIT;
```

**In Functions**: Use EXCEPTION block for automatic rollback
```sql
BEGIN
  -- Operations
EXCEPTION
  WHEN OTHERS THEN
    -- Transaction auto-rolls back
    RETURN error_result;
END;
```

---

## Network Schema Template

**When creating new network schema**, use this checklist:

- [ ] CREATE SCHEMA statement
- [ ] Create all tables (profiles, service_addresses, service_subscriptions, etc.)
- [ ] Create indexes for all foreign keys
- [ ] Enable RLS on all tables
- [ ] Create RLS policies (user-owned data + admin access)
- [ ] Create views (network_products, service_address_subscriptions_view, etc.)
- [ ] Create RPC functions (complete_account_setup, create_subscription, etc.)
- [ ] Create triggers (update_updated_at_column, auto_apply_promotions, etc.)
- [ ] Update public schema UNION ALL views
- [ ] Register network in public.networks table
- [ ] Grant permissions to authenticated and service_role
- [ ] Add comments to tables and columns

---

## Migration Review Checklist

Before deploying migration:

- [ ] Migration file named correctly (YYYYMMDDHHMMSS_description.sql)
- [ ] All CREATE statements have "IF NOT EXISTS" or "OR REPLACE" where appropriate
- [ ] All foreign keys have ON DELETE CASCADE/RESTRICT/SET NULL specified
- [ ] All tables have RLS enabled (if containing sensitive data)
- [ ] All RLS policies created
- [ ] All indexes created for foreign keys
- [ ] All SECURITY DEFINER functions have SET search_path
- [ ] Dynamic SQL uses format() with %I for identifiers
- [ ] All functions have GRANT EXECUTE statements
- [ ] Comments added for tables and non-obvious columns
- [ ] No hardcoded values (use parameters or config)
- [ ] Tested locally with `supabase db reset`

---

## Anti-Patterns to Avoid

### ❌ Don't: Hardcode Schema Names
```sql
-- Bad
SELECT * FROM subscribers.profiles WHERE ...;

-- Good
EXECUTE format('SELECT * FROM %I.profiles WHERE ...', p_network_schema);
```

### ❌ Don't: Use String Concatenation for SQL
```sql
-- Bad
query := 'SELECT * FROM ' || table_name;

-- Good
query := format('SELECT * FROM %I', table_name);
```

### ❌ Don't: Forget SECURITY DEFINER Search Path
```sql
-- Bad
CREATE FUNCTION ... SECURITY DEFINER AS $$ ... $$;

-- Good
CREATE FUNCTION ...
SECURITY DEFINER
SET search_path = public  -- Explicit
AS $$ ... $$;
```

### ❌ Don't: Create Cross-Schema Foreign Keys from Public to Network
```sql
-- Bad
CREATE TABLE public.subscription_promotions (
  subscription_id UUID REFERENCES subscribers.service_subscriptions(id) -- ❌ FAILS
);

-- Good
CREATE TABLE public.subscription_promotions (
  network_id UUID REFERENCES public.networks(id),
  subscription_id UUID NOT NULL  -- UUID only, validated in RPC
);
```

---

## Quick Reference Commands

### Create Migration
```bash
supabase migration new <descriptive_name>
```

### Test Migration Locally
```bash
supabase db reset  # Reset to latest migrations
```

### Deploy to Production
```bash
supabase db push
```

### Generate TypeScript Types
```bash
supabase gen types typescript --project-id meernat-base-structure --schema public,subscribers,jamestown_bpu > types.ts
```

### Deploy Edge Function
```bash
supabase functions deploy <function-name>
```

---

## File Locations

**Migrations**: `/Users/dev007/Sites/projects/billing-discounts/app-support-billing-discounts/supabase/migrations/`

**Edge Functions**: `/Users/dev007/Sites/projects/billing-discounts/app-support-billing-discounts/supabase/functions/`

**Config**: `/Users/dev007/Sites/projects/billing-discounts/app-support-billing-discounts/supabase/config.toml`

**Documentation**: `/Users/dev007/Sites/projects/billing-discounts/app-support-billing-discounts/database/documentation/`

---

**Reference**: For complete SQL examples, see `ProjectDocumentation/DatabaseAnalysis/INVENTORY.md`
