# Multi-Network Architecture - Billing Discounts System

**Last Updated**: 2025-12-03
**Current Networks**: 2 (Orangeburg, Jamestown BPU)
**Architecture Pattern**: Schema Isolation with Shared Infrastructure

---

## Core Concept

**Single Supabase Instance** serving **multiple independent fiber networks** using **schema-based isolation**.

```
┌─────────────────────────────────────────────────┐
│         SINGLE SUPABASE INSTANCE                │
│      (meernat-base-structure)                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │   PUBLIC     │  │  SUBSCRIBERS │            │
│  │   SCHEMA     │  │   SCHEMA     │            │
│  │              │  │              │            │
│  │ Shared       │  │ Orangeburg   │            │
│  │ Infrastructure│  │ Customers   │            │
│  └──────────────┘  └──────────────┘            │
│                                                  │
│  ┌──────────────┐                               │
│  │ JAMESTOWN_BPU│                               │
│  │   SCHEMA     │                               │
│  │              │                               │
│  │ Jamestown    │                               │
│  │ Customers    │                               │
│  └──────────────┘                               │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Schema Responsibilities

### Public Schema (Shared)
**Contains**:
- organizations (service providers, network operators)
- networks (network definitions with schema mappings)
- products (service offerings)
- billing_queue (centralized billing across all networks)
- payment_records (cross-network payment tracking)
- work_orders (installation work orders)
- email_queue_jobs (email processing)
- vendors, crews, time_slot_config (scheduling)

**Accessed By**: ALL applications

**Data Scope**: Cross-network (not customer-specific)

---

### Network Schemas (Isolated)
**Subscribers Schema** = Orangeburg Fiber Network
**Jamestown_bpu Schema** = Jamestown BPU Network

**Contains** (identical structure):
- profiles (customer accounts)
- service_addresses (service locations)
- service_subscriptions (active subscriptions)
- installation_requests (install requests)
- contracts & signatures (digital contracts)
- inquiries (leads)
- onboarding_progress (signup workflow)
- available_addresses (serviceable address database ~30K addresses each)
- devices, service_instances (equipment)

**Accessed By**:
- Network-specific customer portals (Orangeburg site, Jamestown site)
- Management portals (CRM, Partner, Installer) via network selection

**Data Scope**: Network-specific customer data only

---

## Network Registry

**Table**: `public.networks`

**Current Networks**:
```sql
SELECT id, schema_name, name, display_name, organization_id, is_active
FROM public.networks;

-- Results:
-- id                  | schema_name   | name        | display_name    | organization_id
-- --------------------|---------------|-------------|-----------------|----------------
-- uuid-orangeburg     | subscribers   | orangeburg  | Orangeburg Fiber| orangeburg
-- uuid-jamestown      | jamestown_bpu | jamestown   | Jamestown BPU   | jamestown_bpu
```

**Key Columns**:
- `schema_name` - PostgreSQL schema name (unique)
- `name` - Internal name (lowercase, snake_case)
- `display_name` - Customer-facing name
- `organization_id` - FK to organizations (service provider)
- `is_active` - Network operational status

**Usage**: All multi-network functions query this table to iterate through networks

---

## Data Isolation Strategy

### Customer Data: Network Schema Isolation
**Rule**: Customer profiles, subscriptions, addresses NEVER cross network boundaries

**Enforcement**:
1. **Physical Separation**: Different PostgreSQL schemas
2. **RLS Policies**: Network-aware policies
3. **No Cross-Schema FKs**: Cannot reference profiles from different networks
4. **View-Based Access**: Network sites query only their own schema

**Example**:
```sql
-- Orangeburg customer
INSERT INTO subscribers.profiles (email, first_name) VALUES ('user@orangeburg.com', 'Alice');

-- Jamestown customer (completely separate)
INSERT INTO jamestown_bpu.profiles (email, first_name) VALUES ('user@jamestown.com', 'Bob');

-- These two customers can never see each other's data
```

---

### Shared Data: Public Schema with RLS
**Rule**: Products, organizations, billing configuration accessible across networks BUT filtered by organization

**Example**:
```sql
-- Product for Orangeburg
SELECT * FROM public.products p
JOIN public.product_network_operators pno ON pno.product_id = p.id
WHERE pno.network_operator_id = 'orangeburg';

-- Different products for Jamestown
SELECT * FROM public.products p
JOIN public.product_network_operators pno ON pno.product_id = p.id
WHERE pno.network_operator_id = 'jamestown_bpu';
```

---

## Cross-Schema Reference Patterns

### Pattern 1: Network Schema → Public Schema (FK Allowed)
```sql
-- Subscription references product from public schema
CREATE TABLE subscribers.service_subscriptions (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES public.products(id), -- ✅ FK ALLOWED
  ...
);
```

**Rule**: Network schemas CAN have foreign keys to public schema

---

### Pattern 2: Public Schema → Network Schema (UUID Only, NO FK)
```sql
-- Public table references network schema entities
CREATE TABLE public.subscription_promotions (
  id UUID PRIMARY KEY,
  network_id UUID REFERENCES public.networks(id), -- ✅ FK to public.networks
  subscription_id UUID NOT NULL, -- ❌ NO FK (references subscribers.service_subscriptions)
  profile_id UUID NOT NULL,      -- ❌ NO FK (references subscribers.profiles)
  ...
);
```

**Pattern**: Store `network_id` + `subscription_id` tuple
- `network_id` → Look up schema_name from public.networks
- `subscription_id` → Use in dynamic SQL: `SELECT * FROM {schema_name}.service_subscriptions WHERE id = subscription_id`

**Validation**: RPC functions validate network_id + subscription_id match

---

### Pattern 3: View-Based Data Bridging
```sql
-- Network schema view accesses public schema data
CREATE VIEW subscribers.network_products AS
SELECT p.*
FROM public.products p
JOIN public.product_network_operators pno ON pno.product_id = p.id
JOIN public.networks n ON n.organization_id = pno.network_operator_id
WHERE n.schema_name = 'subscribers'; -- Filter to this network
```

**Usage**: Network sites query `network_products` instead of `public.products` directly

---

## Network Configuration Patterns

### Pattern 1: Function-Based Config (Jamestown)
**File**: `network-sites/jamestown-billing-discounts/src/config/networkConfig.ts`

```typescript
// 5-minute cache for network config
let configCache: { data: NetworkConfig | null; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function getNetworkConfig(): Promise<NetworkConfig> {
  // Check cache
  if (configCache && Date.now() - configCache.timestamp < CACHE_TTL) {
    return configCache.data!;
  }

  // Fetch from database
  const client = await getSupabaseClient();
  const { data } = await client
    .from('networks')
    .select('*')
    .eq('schema_name', import.meta.env.VITE_NETWORK_SCHEMA)
    .single();

  // Update cache
  configCache = { data, timestamp: Date.now() };
  return data;
}
```

**Pros**: Simple, no React dependency
**Cons**: Race conditions possible, manual cache management

---

### Pattern 2: React Context Provider (Orangeburg - Recommended)
**File**: `network-sites/orangeburg-billing-discounts/src/contexts/NetworkConfigContext.tsx`

```typescript
const NetworkConfigContext = createContext<NetworkConfigContextType>();

export function NetworkConfigProvider({ children }) {
  const [config, setConfig] = useState<NetworkConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      const client = await getSupabaseClient();
      const { data, error } = await client
        .from('networks')
        .select('*')
        .eq('name', import.meta.env.VITE_NETWORK)
        .single();

      if (error) setError(error);
      else setConfig(data);
      setLoading(false);
    }
    fetchConfig();
  }, []);

  return (
    <NetworkConfigContext.Provider value={{ config, loading, error }}>
      {loading ? <Loading /> : error ? <Error /> : children}
    </NetworkConfigContext.Provider>
  );
}

// Usage in App.tsx:
<NetworkConfigProvider>
  <App />
</NetworkConfigProvider>
```

**Pros**: Eliminates race conditions, centralized loading state, React-idiomatic
**Cons**: Requires Provider wrapper in App

**Recommendation**: Use Context Provider pattern for new network sites

---

## Network Selection in Management Portals

### CRM Portal Pattern
**File**: `crm-billing-discounts/src/contexts/NetworkContext.tsx`

```typescript
// User selects network from dropdown
const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);

// All queries filtered by selected network
const { data: subscribers } = useQuery({
  queryKey: ['subscribers', selectedNetwork?.id],
  queryFn: async () => {
    return await client
      .from('all_service_address_subscriptions_view')
      .select('*')
      .eq('schema', selectedNetwork?.schema_name); // Filter by schema
  },
  enabled: !!selectedNetwork
});
```

**Pattern**: Network dropdown controls which schema is queried

---

## Environment Variables by Network

### Orangeburg (Subscribers Schema)
```env
VITE_NETWORK=orangeburg
VITE_NETWORK_SCHEMA=subscribers  # Optional (some apps infer from network name)
```

### Jamestown (Jamestown_bpu Schema)
```env
VITE_NETWORK=jamestown
VITE_NETWORK_SCHEMA=jamestown_bpu
```

### Mapping
| Network Name | Schema Name | Organization ID |
|-------------|-------------|-----------------|
| orangeburg | subscribers | orangeburg |
| jamestown | jamestown_bpu | jamestown_bpu |

**Note**: Schema name != network name for historical reasons (subscribers was first network, predates multi-network architecture)

---

## Adding a New Network

### Step 1: Create Schema
```sql
-- Migration: create_<network_name>_schema.sql
CREATE SCHEMA IF NOT EXISTS <network_name>;
```

### Step 2: Create Tables (Copy Template)
**Use**: `app-support-billing-discounts/scripts/generate-network-migrations.sh`

**Creates**:
- profiles
- service_addresses
- service_subscriptions
- installation_requests
- contracts, signatures
- inquiries
- onboarding_progress
- available_addresses
- devices, service_instances
- drop_types (if network-specific)

### Step 3: Register Network
```sql
INSERT INTO public.networks (
  organization_id,
  schema_name,
  name,
  display_name,
  is_active
) VALUES (
  '<org_id>',
  '<schema_name>',
  '<network_name>',
  '<Display Name>',
  TRUE
);
```

### Step 4: Create Views
**Required Views**:
- `<schema>.network_products`
- `<schema>.service_address_subscriptions_view`
- `<schema>.network_config`
- `<schema>.billing_queue_with_history`

### Step 5: Create RPC Functions
**Required RPCs** (copy from subscribers):
- `<schema>.complete_account_setup()`
- `<schema>.create_subscription()`
- `<schema>.create_installation_request()`
- `<schema>.get_clerk_user_id()`
- `<schema>.get_user_address_data()`
- All onboarding functions

### Step 6: Update Public Schema Views
```sql
-- Add to all_service_address_subscriptions_view
CREATE OR REPLACE VIEW public.all_service_address_subscriptions_view AS
SELECT * FROM subscribers.service_address_subscriptions_view
UNION ALL
SELECT * FROM jamestown_bpu.service_address_subscriptions_view
UNION ALL
SELECT * FROM <new_network>.service_address_subscriptions_view  -- ADD THIS
ORDER BY address_created_at DESC;
```

### Step 7: Deploy Network Site
- Copy existing network site directory
- Update environment variables
- Configure network name/schema
- Deploy to Vercel

---

## Query Patterns by Application Type

### Customer-Facing (Network Sites)
**Context**: Single network only

**Pattern**:
```typescript
// Environment variable determines schema
const NETWORK_SCHEMA = import.meta.env.VITE_NETWORK_SCHEMA; // 'subscribers'

// Query own network schema only
const { data } = await supabase
  .from('service_subscriptions')
  .schema(NETWORK_SCHEMA)  // Explicitly set schema
  .select('*')
  .eq('user_id', userId);
```

---

### Management Portals (CRM, Partner, Installer)
**Context**: Multi-network with selection

**Pattern 1**: Query unified views
```typescript
// Query all networks via public schema view
const { data } = await supabase
  .from('all_service_address_subscriptions_view')
  .select('*')
  .eq('schema', selectedNetwork.schema_name); // Filter to selected network
```

**Pattern 2**: Dynamic schema queries
```typescript
// Query specific network schema
const { data } = await supabase
  .from('service_subscriptions')
  .schema(selectedNetwork.schema_name)  // subscribers or jamestown_bpu
  .select('*');
```

---

### Backend Workers (Python Services)
**Context**: Process all networks

**Pattern**: Call RPC that handles multi-schema iteration
```python
# RPC queries all active networks internally
result = await supabase.rpc('get_subscriptions_due_for_billing', {
    'hours_ahead': 24
}).execute()

# Returns data from all networks with network_schema column:
# [
#   {'network_schema': 'subscribers', 'subscription_id': 'uuid', ...},
#   {'network_schema': 'jamestown_bpu', 'subscription_id': 'uuid', ...}
# ]
```

---

## Network Isolation Enforcement

### 1. Schema-Level Isolation
**Mechanism**: PostgreSQL schemas are separate namespaces

```sql
-- These are completely separate tables
subscribers.profiles
jamestown_bpu.profiles
```

**Cannot**: Accidentally join or query across network schemas

---

### 2. RLS Policy Isolation
**Mechanism**: Row-level security filters by organization

```sql
-- Network sites: Users can only see own data
CREATE POLICY "user_owns_data"
ON subscribers.profiles FOR ALL TO authenticated
USING (clerk_user_id = (auth.jwt()->>'sub'));

-- Management portals: Users can see their organization's network(s)
CREATE POLICY "org_access"
ON public.subscription_promotions FOR ALL TO authenticated
USING (
  network_id IN (
    SELECT n.id FROM public.networks n
    WHERE n.organization_id = (auth.jwt()->>'org_id')
  )
);
```

---

### 3. Application-Level Filtering
**Mechanism**: Environment variables and network context

```typescript
// Network sites know their schema at build time
const NETWORK_SCHEMA = 'subscribers'; // From .env.VITE_NETWORK_SCHEMA

// Management portals filter by selected network
const filteredData = data.filter(row => row.schema === selectedNetwork.schema_name);
```

---

## Cross-Network Aggregation

### Use Case: "View all subscribers across all networks"

**Approach**: UNION ALL views

```sql
CREATE VIEW public.all_subscribers_view AS
SELECT
  'subscribers' AS schema,
  id,
  email,
  first_name,
  last_name,
  account_id,
  created_at
FROM subscribers.profiles

UNION ALL

SELECT
  'jamestown_bpu' AS schema,
  id,
  email,
  first_name,
  last_name,
  account_id,
  created_at
FROM jamestown_bpu.profiles

ORDER BY created_at DESC;
```

**Usage**: CRM Portal queries this view to see all customers

**Performance**: Indexed on created_at in each schema, union is fast

---

## Network-Specific Product Filtering

**Problem**: public.products contains products for ALL networks

**Solution**: Network-specific views

```sql
-- Orangeburg products only
CREATE VIEW subscribers.network_products AS
SELECT p.*
FROM public.products p
JOIN public.product_network_operators pno ON pno.product_id = p.id
JOIN public.networks n ON n.organization_id = pno.network_operator_id
WHERE n.schema_name = 'subscribers';

-- Jamestown products only
CREATE VIEW jamestown_bpu.network_products AS
SELECT p.*
FROM public.products p
JOIN public.product_network_operators pno ON pno.product_id = p.id
JOIN public.networks n ON n.organization_id = pno.network_operator_id
WHERE n.schema_name = 'jamestown_bpu';
```

**Pattern**: Each network has `network_products` view filtering public.products

**Usage**:
```typescript
// Network site queries own schema view
const { data } = await supabase
  .from('network_products')
  .schema('subscribers')
  .select('*');
// Returns only Orangeburg products
```

---

## Billing Across Networks

### Centralized Billing Queue (Public Schema)

**Table**: `public.billing_queue`

**Stores**: Billing jobs for ALL networks with `network_schema` column

```sql
CREATE TABLE public.billing_queue (
  id UUID PRIMARY KEY,
  network_schema TEXT NOT NULL,  -- 'subscribers' or 'jamestown_bpu'
  subscription_id UUID NOT NULL,  -- ID from network schema (NO FK)
  stripe_customer_id TEXT,
  amount_cents INTEGER,
  status TEXT,
  ...
);
```

**Pattern**:
1. Billing worker queries ALL networks
2. Stores `network_schema` to resolve subscription later
3. Payment processor uses dynamic SQL to update correct network schema

**Example** (from BillingQueueWorker):
```python
# Get subscriptions from all networks
subscriptions = await supabase.rpc('get_subscriptions_due_for_billing').execute()

# Results have network_schema column
for sub in subscriptions.data:
    network_schema = sub['network_schema']  # 'subscribers' or 'jamestown_bpu'
    subscription_id = sub['subscription_id']

    # Insert to billing_queue with network context
    await supabase.table('billing_queue').insert({
        'network_schema': network_schema,
        'subscription_id': subscription_id,
        ...
    })
```

---

## Network-Aware RPC Functions

### get_active_network_schemas()
**Purpose**: Returns all active networks for iteration

```sql
CREATE FUNCTION public.get_active_network_schemas()
RETURNS TABLE (
  schema_name TEXT,
  network_id UUID,
  display_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT n.schema_name, n.id, n.display_name
  FROM public.networks n
  WHERE n.is_active = TRUE
  ORDER BY n.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Usage**: Every multi-network function calls this first

---

### Dynamic SQL Example
```sql
CREATE FUNCTION public.count_active_subscriptions_all_networks()
RETURNS TABLE (network_name TEXT, count BIGINT) AS $$
DECLARE
  v_network RECORD;
  v_query TEXT;
BEGIN
  FOR v_network IN SELECT * FROM public.get_active_network_schemas()
  LOOP
    v_query := format(
      'SELECT %L::TEXT, COUNT(*)::BIGINT FROM %I.service_subscriptions WHERE status = $1',
      v_network.display_name,
      v_network.schema_name
    );

    RETURN QUERY EXECUTE v_query USING 'active';
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Pattern**:
1. Loop through networks
2. Build query with `format()` using `%I` for schema names
3. Execute with parameters
4. Aggregate results

---

## Network Isolation in Promotions Feature

### Architecture Decision
**Problem**: Where to store subscription_promotions?

**Option 1**: Network schemas
- Pros: Data co-located with subscriptions
- Cons: Billing worker must query each schema separately (slow)

**Option 2**: Public schema with network_id ✅ CHOSEN
- Pros: Single query for billing across all networks
- Cons: Cross-schema reference (no FK to subscriptions)

**Implementation**:
```sql
CREATE TABLE public.subscription_promotions (
  network_id UUID REFERENCES public.networks(id),
  subscription_id UUID NOT NULL,  -- References <network_schema>.service_subscriptions
  ...
);
```

**Validation**: RPC functions enforce network_id matches subscription's network

**Example**:
```sql
-- In apply_promotion_to_subscription RPC
-- Verify subscription exists in specified network
EXECUTE format(
  'SELECT 1 FROM %I.service_subscriptions WHERE id = $1',
  (SELECT schema_name FROM public.networks WHERE id = p_network_id)
) INTO v_exists USING p_subscription_id;

IF NOT v_exists THEN
  RAISE EXCEPTION 'Subscription % not found in network %', p_subscription_id, p_network_id;
END IF;
```

---

## Network Site Environment Configuration

### Orangeburg Network Site
**Directory**: `network-sites/orangeburg-billing-discounts/`

**Environment**:
```env
VITE_NETWORK=orangeburg
VITE_SUPABASE_URL=https://meernat-base-structure.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

**Network Config Query**:
```typescript
const { data: networkConfig } = await supabase
  .from('networks')
  .select('*')
  .eq('name', 'orangeburg')  // Uses VITE_NETWORK
  .single();

// networkConfig.schema_name = 'subscribers'
```

**Schema Usage**:
```typescript
// Query subscriptions from subscribers schema
const { data } = await supabase
  .from('service_subscriptions')
  .schema('subscribers')  // From networkConfig.schema_name
  .select('*');
```

---

### Jamestown Network Site
**Directory**: `network-sites/jamestown-billing-discounts/`

**Environment**:
```env
VITE_NETWORK=jamestown
VITE_NETWORK_SCHEMA=jamestown_bpu  # Explicit schema name (legacy pattern)
VITE_SUPABASE_URL=https://meernat-base-structure.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

**Schema Usage**:
```typescript
const SCHEMA = import.meta.env.VITE_NETWORK_SCHEMA; // 'jamestown_bpu'

const { data } = await supabase
  .from('service_subscriptions')
  .schema(SCHEMA)
  .select('*');
```

---

## Multi-Network Billing Flow

### Step 1: Queue Loading (Multi-Network)
```python
# Python worker calls RPC
subscriptions = await supabase.rpc('get_subscriptions_due_for_billing').execute()

# RPC internally queries:
# - subscribers.service_subscriptions (Orangeburg)
# - jamestown_bpu.service_subscriptions (Jamestown)

# Returns unified results with network_schema column
```

### Step 2: Billing Queue (Centralized)
```python
for sub in subscriptions.data:
    await supabase.table('billing_queue').insert({
        'network_schema': sub['network_schema'],  # Track which network
        'subscription_id': sub['subscription_id'],
        'amount_cents': sub['price_monthly'],
        ...
    })

# billing_queue now has jobs from both networks
```

### Step 3: Payment Processing (Network-Aware)
```python
for job in billing_jobs:
    network_schema = job['network_schema']
    subscription_id = job['subscription_id']

    # Create Stripe invoice
    invoice = await stripe.Invoice.create(...)

    # Update subscription in correct network schema using RPC
    await supabase.rpc('record_payment_and_update_subscription', {
        'p_network_schema': network_schema,
        'p_subscription_id': subscription_id,
        ...
    })

    # RPC uses dynamic SQL:
    # UPDATE {network_schema}.service_subscriptions
    # SET last_payment_date = ..., next_billing_date = ...
    # WHERE id = subscription_id
```

---

## Data Consistency Rules

### Rule 1: Network ID + Subscription ID Pair
**Always store together** when referencing network schema entities from public schema:
```sql
CREATE TABLE public.some_table (
  network_id UUID REFERENCES public.networks(id),  -- ✅ For lookup
  subscription_id UUID NOT NULL,                    -- ✅ Entity reference
  ...
);
```

### Rule 2: No Orphans
**Validation**: RPCs validate network_id matches entity's network

```sql
-- In RPC
DECLARE
  v_network_schema TEXT;
  v_subscription_exists BOOLEAN;
BEGIN
  SELECT schema_name INTO v_network_schema
  FROM public.networks WHERE id = p_network_id;

  EXECUTE format(
    'SELECT EXISTS(SELECT 1 FROM %I.service_subscriptions WHERE id = $1)',
    v_network_schema
  ) INTO v_subscription_exists USING p_subscription_id;

  IF NOT v_subscription_exists THEN
    RAISE EXCEPTION 'Subscription not found in network';
  END IF;
END;
```

### Rule 3: CASCADE Deletes Within Schema
**Pattern**: CASCADE for tightly coupled data within same schema

```sql
-- Within network schema
CREATE TABLE subscribers.service_addresses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES subscribers.profiles(id) ON DELETE CASCADE,
  ...
);
```

**Never CASCADE** across schemas (no FK anyway)

---

## Network Context in JWT

### Clerk JWT Claims Structure
```json
{
  "sub": "user_abc123",               // Clerk user ID
  "org_id": "org_xyz789",             // Organization ID
  "org_role": "org:admin",            // User's role
  "org_slug": "orangeburg",           // Organization slug
  "iss": "https://clerk.com",
  "aud": "authenticated"
}
```

### Extracting Network Context
```sql
-- Get user's organization
SELECT (auth.jwt()->>'org_id') AS org_id;

-- Get networks user can access
SELECT n.*
FROM public.networks n
WHERE n.organization_id = (auth.jwt()->>'org_id');
```

### RLS Example with Network Context
```sql
CREATE POLICY "user_network_access"
ON public.subscription_promotions FOR ALL TO authenticated
USING (
  network_id IN (
    SELECT n.id FROM public.networks n
    WHERE n.organization_id = (auth.jwt()->>'org_id')
  )
);
```

---

## View Migration Pattern for New Networks

**When**: Adding a 3rd network (e.g., "cityfiber")

**Update**: All UNION ALL views in public schema

**Example**:
```sql
-- Before (2 networks)
CREATE OR REPLACE VIEW public.all_subscribers_view AS
SELECT * FROM subscribers.all_subscribers_view
UNION ALL
SELECT * FROM jamestown_bpu.all_subscribers_view;

-- After (3 networks)
CREATE OR REPLACE VIEW public.all_subscribers_view AS
SELECT * FROM subscribers.all_subscribers_view
UNION ALL
SELECT * FROM jamestown_bpu.all_subscribers_view
UNION ALL
SELECT * FROM cityfiber.all_subscribers_view;  -- ADD NEW NETWORK
```

**Files to Update**:
- `all_service_address_subscriptions_view`
- `all_subscribers_view`
- `all_onboarding_status_view`
- Any other `all_*` views

---

## Performance Considerations

### Multi-Network Queries
**Concern**: UNION ALL views query multiple schemas

**Mitigation**:
- Index key columns in each schema (created_at, status, etc.)
- PostgreSQL optimizes UNION ALL efficiently
- Materialized views for heavy aggregations

### Dynamic SQL
**Concern**: format() + EXECUTE slower than static SQL

**Mitigation**:
- Use for background jobs only (not real-time user queries)
- Cache network list in memory (rarely changes)
- Acceptable for billing/email workers

---

## Security Best Practices

### 1. Validate Schema Names
```sql
-- ALWAYS validate before dynamic SQL
IF NOT public.validate_network_schema_exists(p_schema_name) THEN
  RAISE EXCEPTION 'Invalid schema: %', p_schema_name;
END IF;
```

### 2. Use Format Safely
```sql
-- ✅ SAFE: %I for identifiers
format('SELECT * FROM %I.profiles', schema_name)

-- ❌ UNSAFE: String concatenation
'SELECT * FROM ' || schema_name || '.profiles'  -- SQL injection risk!
```

### 3. Explicit Search Path
```sql
CREATE FUNCTION ...
SECURITY DEFINER
SET search_path = public  -- Explicit search path prevents injection
AS $$ ... $$;
```

---

## Network Schema Conventions

### Table Mirroring
**All network schemas must have identical table structures**:
- Same table names
- Same column names and types
- Same constraints

**Reason**: Multi-network RPCs use dynamic SQL expecting consistent structure

### View Mirroring
**Each network schema should have**:
- `network_products` (filter public.products)
- `service_address_subscriptions_view` (mega view)
- `network_config` (network settings)
- `billing_queue_with_history` (billing view)

### RPC Mirroring
**Each network schema should have** (if needed):
- `complete_account_setup()`
- `get_clerk_user_id()`
- Schema-specific helper functions

**NOT mirrored**: Public schema RPCs are shared

---

## Testing Network Isolation

### Test 1: Cross-Network Data Leakage
```sql
-- As Orangeburg user
SET request.jwt.claims TO '{"org_id": "orangeburg", "org_role": "org:admin"}';

-- Should only see Orangeburg data
SELECT * FROM public.subscription_promotions;
-- Expected: Only rows where network_id = orangeburg's network_id

-- Should NOT see Jamestown subscriptions
SELECT * FROM subscribers.service_subscriptions; -- ✅ Orangeburg data
SELECT * FROM jamestown_bpu.service_subscriptions; -- ❌ RLS blocks access
```

### Test 2: Management Portal Network Switching
```typescript
// CRM user selects Orangeburg
setSelectedNetwork({id: 'uuid-orangeburg', schema_name: 'subscribers'});

// Query
const { data } = await supabase
  .from('all_service_address_subscriptions_view')
  .select('*')
  .eq('schema', 'subscribers');

// Should return only Orangeburg customers
```

---

## Quick Reference

### Get Network from Schema Name
```sql
SELECT * FROM public.networks WHERE schema_name = 'subscribers';
```

### Get All Active Networks
```sql
SELECT * FROM public.get_active_network_schemas();
```

### Check if Schema is Valid Network
```sql
SELECT public.validate_network_schema_exists('subscribers');
-- Returns TRUE or raises exception
```

### Query Network Schema from JavaScript
```typescript
const { data } = await supabase
  .from('profiles')
  .schema('subscribers')  // Explicit schema
  .select('*');
```

---

**Key Principle**: Network isolation is maintained at **3 levels** - schema separation, RLS policies, and application filtering. All three must work together for complete isolation.
