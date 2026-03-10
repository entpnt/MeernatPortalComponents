# Database Architecture - Billing Discounts System

**Last Updated**: 2025-12-03
**Supabase Project**: meernat-base-structure
**Total Schemas**: 3 (public, subscribers, jamestown_bpu)

---

## Schema Structure

### Public Schema (Shared Infrastructure)
**Purpose**: Shared tables accessible across all networks and management portals

**Core Tables**:
```
organizations (TEXT PK)
  ├── networks (UUID PK, FK: organization_id)
  │     ├── time_slot_config
  │     ├── crews
  │     └── schedule_blockout_dates
  │
  ├── products (UUID PK, FK: service_provider_id)
  │     ├── product_network_operators
  │     ├── network_fees
  │     └── service_subscriptions (in network schemas via product_id)
  │
  ├── vendors
  │     ├── vendor_network_access
  │     ├── crews
  │     └── drop_types
  │
  ├── billing_queue (UUID PK)
  │     └── billing_queue_archive
  │
  ├── payment_records (UUID PK)
  │     └── (references subscriptions via network_schema + subscription_id)
  │
  ├── email_queue_jobs (UUID PK)
  │     ├── email_queue_dead_letters
  │     └── network_email_configs
  │
  └── work_orders (UUID PK)
        └── (links to installation_requests via network schemas)
```

**Key Characteristics**:
- TEXT primary keys for organizations (e.g., "orangeburg", "jamestown_bpu")
- UUID primary keys for all other tables
- Cross-network reference pattern: Store `network_schema + entity_id` (no FK constraints)
- RLS policies based on organization_id and JWT claims

---

### Network Schemas (Isolated Customer Data)

**Schemas**: `subscribers` (Orangeburg), `jamestown_bpu` (Jamestown)

**Identical Table Structure** (mirrored across networks):
```
profiles (UUID PK)
  ├── account_id (TEXT UNIQUE) - Network-specific format
  │     - Orangeburg: 'OF-YYYY-XXXXXX'
  │     - Jamestown: 'JB-YYYY-XXXXXX'
  │
  ├── service_addresses (UUID PK, FK: user_id)
  │     ├── available_address_id (FK to available_addresses)
  │     └── service_subscriptions (FK: user_id, service_address_id, product_id)
  │
  ├── service_subscriptions (UUID PK)
  │     ├── product_id (FK to public.products) ← CROSS-SCHEMA
  │     ├── user_id (FK to profiles)
  │     ├── service_address_id (FK to service_addresses)
  │     └── Fields: price_monthly, status, next_billing_date, stripe_session_data
  │
  ├── installation_requests (UUID PK)
  │     ├── user_id (FK to profiles)
  │     ├── service_address_id (FK to service_addresses)
  │     └── network_id (FK to public.networks) ← CROSS-SCHEMA
  │
  ├── contracts (UUID PK)
  │     └── signatures (UUID PK, FK: contract_id)
  │
  ├── inquiries (UUID PK)
  │     └── available_address_id (FK to available_addresses)
  │
  ├── onboarding_progress (UUID PK)
  │     ├── user_id (FK to profiles)
  │     └── service_address_id (FK to service_addresses)
  │
  ├── available_addresses (UUID PK) - 30,000+ addresses
  │     └── Serviceable address database per network
  │
  └── devices (UUID PK)
        └── service_instances (UUID PK)
```

---

## Cross-Schema Relationship Patterns

### Pattern 1: Foreign Key to Public Schema (Safe)
**From**: Network schema table
**To**: Public schema table
**Example**:
```sql
-- Network schema can reference public schema
CREATE TABLE subscribers.service_subscriptions (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES public.products(id), -- ✅ ALLOWED
  ...
);
```

### Pattern 2: Reference FROM Public TO Network (UUID Only - NO FK)
**From**: Public schema table
**To**: Network schema table
**Example**:
```sql
-- Public schema CANNOT have FK to network schema
CREATE TABLE public.subscription_promotions (
  id UUID PRIMARY KEY,
  network_id UUID REFERENCES public.networks(id),
  subscription_id UUID NOT NULL,  -- ❌ NO FK (references network schema)
  ...
);

-- Instead: Store network_id + subscription_id for lookup
-- Validation in application layer or RPC functions
```

**Reason**: PostgreSQL foreign keys cannot cross schemas reliably. Use UUID references + application-level validation.

### Pattern 3: Dynamic SQL for Cross-Schema Queries
**Use Case**: Query all network schemas from public schema function

**Example**:
```sql
CREATE FUNCTION public.get_all_subscriptions()
RETURNS TABLE (...) AS $$
DECLARE
  v_network RECORD;
  v_query TEXT;
BEGIN
  FOR v_network IN SELECT * FROM public.get_active_network_schemas()
  LOOP
    -- Build dynamic query
    v_query := format(
      'SELECT id, price_monthly FROM %I.service_subscriptions WHERE status = $1',
      v_network.schema_name  -- Safe identifier quoting with %I
    );

    RETURN QUERY EXECUTE v_query USING 'active';
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Security**: Always use `format()` with `%I` for identifiers, `%L` for literals

---

## Data Types & Conventions

### Primary Keys
- **UUID**: All tables except organizations
- **TEXT**: organizations table only (human-readable IDs like "orangeburg")

### Foreign Keys
- **Within same schema**: Always use FK constraints
- **Cross-schema (public ← network)**: FK constraints allowed
- **Cross-schema (network ← public)**: FK constraints allowed
- **Reverse (public → network)**: NO FK, use UUID reference only

### Timestamps
- **TIMESTAMPTZ**: Always use timezone-aware timestamps
- **DATE**: Billing dates, installation dates (no time component)
- **Default**: `DEFAULT NOW()` or `DEFAULT CURRENT_TIMESTAMP`

### Amount Fields
- **INTEGER**: Amounts in cents (e.g., 5000 = $50.00)
- **NUMERIC**: For calculations requiring decimal precision
- **Never FLOAT**: Avoid floating point for money

### JSONB Usage
- **metadata**: Flexible additional data on most tables
- **context_data**: Email queue context
- **original_promotion_config**: Snapshot of promotion at application time
- **stripe_session_data**: Stripe session information
- **Always use JSONB** (not JSON) for indexing and querying

---

## Table Naming Conventions

### Singular vs Plural
- **Plural**: Most tables (`profiles`, `subscriptions`, `addresses`)
- **Singular**: Some legacy tables (`email_queue_jobs`, `billing_queue`)

### Suffixes
- `_view`: Read-only views
- `_queue`: Work queue tables
- `_config`: Configuration tables
- `_tracking`: Audit/tracking tables
- `_archive`: Historical data tables
- `_history`: Audit trail tables

### Network-Specific Tables
**Pattern**: Same table name in each network schema
```
subscribers.profiles
jamestown_bpu.profiles
```

**NOT**:
```
profiles_subscribers  ❌
orangeburg_profiles   ❌
```

---

## Column Naming Conventions

### ID Columns
- **Primary Key**: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- **Foreign Keys**: `<table_name>_id` (e.g., `user_id`, `network_id`, `promotion_id`)
- **Clerk User ID**: `clerk_user_id TEXT` (external ID from Clerk auth)
- **Stripe IDs**: `stripe_customer_id`, `stripe_invoice_id`, `stripe_payment_intent_id`

### Status Fields
- **Type**: TEXT with CHECK constraint
- **Values**: lowercase_with_underscores
- **Examples**:
  ```sql
  status TEXT CHECK (status IN ('pending', 'active', 'suspended', 'cancelled'))
  install_status TEXT CHECK (install_status IN ('scheduled', 'in_progress', 'completed', 'cancelled'))
  ```

### Timestamp Fields
- **created_at**: When record was created (always present)
- **updated_at**: When record was last modified (trigger-updated)
- **completed_at**: When process completed (nullable)
- **started_at**: When process started (nullable)
- **expires_at**: When something expires (nullable)
- **deactivated_at**: When record was soft-deleted (nullable)

### Amount Fields
- **Suffix**: `_cents` for integer amounts (e.g., `price_monthly` is INTEGER cents)
- **Example**: `original_amount_cents INTEGER` = 5000 ($50.00)

---

## Indexes

### Primary Indexes
```sql
-- Always index foreign keys
CREATE INDEX idx_<table>_<column> ON <schema>.<table>(<foreign_key_column>);

-- Example:
CREATE INDEX idx_subscription_promotions_promotion ON public.subscription_promotions(promotion_id);
```

### Composite Indexes
```sql
-- For common query patterns
CREATE INDEX idx_<table>_<col1>_<col2> ON <schema>.<table>(<col1>, <col2>);

-- Example:
CREATE INDEX idx_sub_promo_subscription ON public.subscription_promotions(network_id, subscription_id, is_active);
```

### Partial Indexes
```sql
-- For filtered queries
CREATE INDEX idx_<table>_<column> ON <schema>.<table>(<column>) WHERE <condition>;

-- Example:
CREATE INDEX idx_promotions_auto_apply ON public.promotions(network_id, is_auto_apply) WHERE is_active = TRUE;
```

---

## View Patterns

### Pattern 1: Network-Specific Views
**Purpose**: Filter public schema data for specific network

**Example**: `network_products` view
```sql
CREATE VIEW subscribers.network_products AS
SELECT p.*
FROM public.products p
JOIN public.product_network_operators pno ON pno.product_id = p.id
JOIN public.networks n ON n.organization_id = pno.network_operator_id
WHERE n.schema_name = 'subscribers';
```

**Usage**: Each network schema has its own view filtering public.products

---

### Pattern 2: Multi-Schema UNION Views
**Purpose**: Aggregate data from all network schemas

**Example**: `all_service_address_subscriptions_view`
```sql
CREATE VIEW public.all_service_address_subscriptions_view AS
SELECT * FROM subscribers.service_address_subscriptions_view
UNION ALL
SELECT * FROM jamestown_bpu.service_address_subscriptions_view
ORDER BY address_created_at DESC;
```

**Usage**: CRM Portal queries this to see all subscribers across networks

---

### Pattern 3: Mega Views (50+ Columns)
**Purpose**: Single source of truth with all related data

**Example**: `service_address_subscriptions_view`
- Joins 7+ tables via LEFT JOIN
- Pivots onboarding_progress steps as columns
- Computed boolean flags
- Used by CRM All Subscribers page

---

## RPC Function Patterns

### Pattern 1: SECURITY DEFINER for RLS Bypass
```sql
CREATE FUNCTION public.get_subscriptions_due_for_billing()
RETURNS TABLE (...)
LANGUAGE plpgsql
SECURITY DEFINER  -- Executes with function owner's privileges
SET search_path = public  -- Security: explicit search path
AS $$
BEGIN
  -- Function can access all schemas regardless of RLS
END;
$$;
```

**When to use**: Functions that need to query across schemas or bypass RLS

---

### Pattern 2: Dynamic SQL for Multi-Schema Queries
```sql
CREATE FUNCTION public.query_all_networks()
RETURNS TABLE (...) AS $$
DECLARE
  v_network RECORD;
  v_query TEXT;
BEGIN
  FOR v_network IN SELECT * FROM public.get_active_network_schemas()
  LOOP
    v_query := format(
      'SELECT id, email FROM %I.profiles WHERE status = $1',
      v_network.schema_name  -- %I safely quotes identifiers
    );

    RETURN QUERY EXECUTE v_query USING 'active';
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Pattern**:
1. Loop through networks
2. Build query with `format()`
3. Execute with parameters
4. RETURN QUERY to aggregate results

---

### Pattern 3: JSONB Return for Complex Results
```sql
CREATE FUNCTION public.apply_promotion_to_subscription(...)
RETURNS JSON  -- or JSONB
AS $$
BEGIN
  -- Do work...

  RETURN json_build_object(
    'success', TRUE,
    'message', 'Promotion applied successfully',
    'data', row_to_json(result_record)
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', FALSE,
    'error', SQLERRM,
    'error_code', SQLSTATE
  );
END;
$$;
```

**Pattern**: Return JSON with success/error structure for API-style responses

---

## Trigger Patterns

### Pattern 1: Updated_at Timestamp Trigger
```sql
-- Function
CREATE FUNCTION <schema>.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_update_<table>_updated_at
BEFORE UPDATE ON <schema>.<table>
FOR EACH ROW
EXECUTE FUNCTION <schema>.update_updated_at_column();
```

---

### Pattern 2: Cross-Schema Trigger (Network → Public RPC)
```sql
-- Trigger function in network schema
CREATE FUNCTION subscribers.auto_apply_promotions_to_new_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_network_id UUID;
BEGIN
  -- Get network ID
  SELECT id INTO v_network_id FROM public.networks WHERE schema_name = 'subscribers';

  -- Call public schema RPC
  PERFORM public.apply_promotion_to_subscription(
    v_network_id,
    NEW.id,
    NEW.user_id,
    'promotion-uuid',
    NULL
  );

  RETURN NEW;
END;
$$;

-- Trigger
CREATE TRIGGER trigger_auto_apply_promotions
AFTER INSERT ON subscribers.service_subscriptions
FOR EACH ROW
EXECUTE FUNCTION subscribers.auto_apply_promotions_to_new_subscription();
```

**Pattern**: Network schema triggers can call public schema RPCs using PERFORM

---

## RLS Policy Patterns

### Pattern 1: JWT Organization-Based Access
```sql
CREATE POLICY "org_access_policy"
ON <table>
FOR ALL
TO authenticated
USING (
  organization_id = (auth.jwt()->>'org_id')
);
```

**Used For**: Tables with organization_id column

---

### Pattern 2: JWT Role-Based Access
```sql
CREATE POLICY "admin_access_policy"
ON <table>
FOR ALL
TO authenticated
USING (
  (auth.jwt()->>'org_role') = 'org:admin'
);
```

**Used For**: Admin-only tables

---

### Pattern 3: Helper Function-Based Access
```sql
CREATE POLICY "network_access_policy"
ON <table>
FOR ALL
TO authenticated
USING (
  network_id IN (
    SELECT n.id FROM public.networks n
    WHERE n.organization_id = (auth.jwt()->>'org_id')
  )
);
```

**Used For**: Network-aware tables in public schema

---

### Pattern 4: User-Owned Data
```sql
CREATE POLICY "user_owns_data"
ON <network_schema>.profiles
FOR ALL
TO authenticated
USING (
  clerk_user_id = (auth.jwt()->>'sub')
);
```

**Used For**: Customer data in network schemas

---

## Constraint Patterns

### CHECK Constraints
```sql
-- Enum-like values
status TEXT CHECK (status IN ('pending', 'active', 'suspended', 'cancelled'))

-- Positive amounts
price_monthly INTEGER CHECK (price_monthly >= 0)

-- Date validation
valid_until TIMESTAMPTZ CHECK (valid_until IS NULL OR valid_until >= valid_from)

-- Conditional validation
CONSTRAINT valid_duration CHECK (
  (duration_type IS NULL AND duration_value IS NULL) OR
  (duration_type IS NOT NULL AND duration_value > 0)
)
```

### UNIQUE Constraints
```sql
-- Single column
account_id TEXT UNIQUE

-- Multi-column
UNIQUE(promotion_id, product_id)
UNIQUE(network_id, subscription_id, billing_date)
```

### Foreign Key Cascade Rules
```sql
-- Delete cascade (child deleted when parent deleted)
REFERENCES parent_table(id) ON DELETE CASCADE

-- Delete restrict (prevent deleting parent if children exist)
REFERENCES parent_table(id) ON DELETE RESTRICT

-- Set null (set child FK to NULL when parent deleted)
REFERENCES parent_table(id) ON DELETE SET NULL
```

**Usage**:
- CASCADE: For tightly coupled data (promotion_credits → subscription_promotions)
- RESTRICT: For references that should remain (subscription_promotions → promotions)
- SET NULL: For optional references (promotion_usage_history → promotions)

---

## Account ID Generation Pattern

**Subscribers (Orangeburg)**:
```sql
account_id TEXT DEFAULT (
  ('OF-' || EXTRACT(year FROM now())) || '-' ||
  lpad((((random() * 999999)::integer)::text, 6, '0')
)
```
**Format**: `OF-2025-123456`

**Jamestown BPU**:
```sql
account_id TEXT DEFAULT (
  ('JB-' || EXTRACT(year FROM now())) || '-' ||
  lpad((((random() * 999999)::integer)::text, 6, '0')
)
```
**Format**: `JB-2025-789012`

**Pattern**: `{PREFIX}-{YEAR}-{RANDOM_6_DIGITS}`

---

## Timestamp Behavior

### EST Timezone for Billing
**Pattern**: Billing dates calculated in EST (America/New_York)

```sql
-- Example from get_subscriptions_due_for_billing
v_cutoff_date := (CURRENT_DATE AT TIME ZONE 'America/New_York')::DATE +
                 (hours_ahead || ' hours')::INTERVAL;
```

**Reason**: Business operates in EST, billing should respect business hours

---

### Default Timestamps
```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

**Triggers**: updated_at automatically updated via trigger (not application code)

---

## Index Strategy

### Always Index
1. All foreign keys
2. Frequently queried columns (status, network_id, user_id)
3. Unique constraints (automatically indexed)
4. Columns in WHERE clauses of common queries

### Conditional Indexes
```sql
-- Only index active records
CREATE INDEX idx_active_promotions ON promotions(network_id) WHERE is_active = TRUE;
```

**Benefit**: Smaller index size, faster queries for active-only queries

---

## Migration File Locations

**Directory**: `/Users/dev007/Sites/projects/billing-discounts/app-support-billing-discounts/supabase/migrations/`

**Count**: 186 existing migration files

**Naming**: `YYYYMMDDHHMMSS_description.sql`

**Examples**:
- `20251118000003_create_billing_queue_tables.sql`
- `20251118000008_create_billing_queue_rpc.sql`
- `20250919130000_complete_account_setup_function.sql`

---

## Critical Tables by Feature

### Billing
- `public.billing_queue` - Active billing jobs
- `public.billing_queue_archive` - Historical billing
- `public.payment_records` - Payment history
- `<network>.service_subscriptions` - Subscription records

### Customer Management
- `<network>.profiles` - Customer accounts
- `<network>.service_addresses` - Service locations
- `<network>.onboarding_progress` - Signup workflow

### Installation
- `<network>.installation_requests` - Install requests (network schema)
- `public.work_orders` - Work orders (public schema)
- `public.time_slot_config` - Scheduling configuration

### Products
- `public.products` - Service offerings
- `public.product_network_operators` - Network-product relationships
- Views: `<network>.network_products` - Network-filtered products

---

## Schema Access Patterns

### CRM Portal (Management)
- **Queries**: public schema + all network schemas (via views)
- **Pattern**: Uses `all_*` views to aggregate data

### Partner Portal (Management)
- **Queries**: public schema + selected network schema
- **Pattern**: Network selection drives schema context

### Network Sites (Customer)
- **Queries**: Own network schema only
- **Pattern**: RLS policies enforce user can only see own data

### Billing Portal (Provider)
- **Queries**: public schema (payment_records, billing_queue)
- **Pattern**: Organization-filtered via RLS

### Services (Python Workers)
- **Queries**: All schemas via RPC functions
- **Pattern**: Uses SECURITY DEFINER RPCs to bypass RLS

---

## Performance Considerations

### Materialized Views
**When**: Large aggregations, complex joins, infrequent updates
**Example**: `billing_revenue_projection_view`
**Refresh**: Daily via pg_cron

### Regular Views
**When**: Real-time data needed, simpler queries
**Example**: `active_subscription_promotions_view`

### Indexes for Multi-Column Queries
```sql
-- Query: WHERE network_id = X AND subscription_id = Y AND is_active = TRUE
CREATE INDEX idx_sub_promo_subscription ON subscription_promotions(network_id, subscription_id, is_active);
```

**Pattern**: Index columns in WHERE clause order

---

## Row Level Security (RLS)

### Enable RLS
```sql
ALTER TABLE <schema>.<table> ENABLE ROW LEVEL SECURITY;
```

**Required**: ALL tables containing customer or business-sensitive data

### Policy Naming
**Pattern**: `<action>_<condition>_policy`

**Examples**:
- `users_own_data_policy`
- `admin_full_access_policy`
- `network_isolation_policy`

---

## Quick Reference: Schema Responsibilities

| Schema | Contains | Accessed By | RLS |
|--------|----------|-------------|-----|
| **public** | Shared infrastructure (products, billing, organizations) | All apps | YES (org-based) |
| **subscribers** | Orangeburg customer data | Orangeburg site, management portals | YES (user + org) |
| **jamestown_bpu** | Jamestown customer data | Jamestown site, management portals | YES (user + org) |

---

## Common Queries

### Get Network ID from Schema Name
```sql
SELECT id FROM public.networks WHERE schema_name = 'subscribers';
```

### Get All Active Networks
```sql
SELECT * FROM public.get_active_network_schemas();
-- Returns: schema_name, network_id, display_name
```

### Get Subscription with Promotions
```sql
SELECT
  ss.*,
  (SELECT json_agg(asp) FROM public.active_subscription_promotions_view asp
   WHERE asp.subscription_id = ss.id) as promotions
FROM subscribers.service_subscriptions ss
WHERE ss.id = 'subscription-uuid';
```

---

**Reference**: For complete SQL code of all RPCs and views, see `ProjectDocumentation/DatabaseAnalysis/INVENTORY.md` (1,959 lines)
