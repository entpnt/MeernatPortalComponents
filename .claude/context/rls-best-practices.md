# RLS Best Practices - Real Examples from Billing Discounts System

**Last Updated**: 2025-12-03
**Source**: 186 migrations with RLS policies

---

## RLS Fundamentals

### Always Enable RLS for Sensitive Data
```sql
ALTER TABLE <schema>.<table> ENABLE ROW LEVEL SECURITY;
```

**When to Enable**:
- ✅ Customer data (profiles, addresses, subscriptions)
- ✅ Business data (billing, payments, promotions)
- ✅ Organization data (if multi-tenant)

**When to Skip**:
- ❌ Public reference data (drop_types, time_slot_config)
- ❌ Audit logs that admins need full access to
- ❌ Configuration tables (networks, organizations if admin-managed)

---

## JWT Claims in Supabase

### Accessing JWT Claims
```sql
-- Get entire JWT as JSON
auth.jwt()

-- Get specific claim
auth.jwt()->>'sub'        -- Clerk user ID
auth.jwt()->>'org_id'     -- Organization ID
auth.jwt()->>'org_role'   -- Organization role
auth.jwt()->>'org_slug'   -- Organization slug

-- Get role
auth.role()  -- 'authenticated', 'anon', or 'service_role'
```

### JWT Structure (Clerk)
```json
{
  "sub": "user_2abc123xyz",
  "org_id": "org_2def456",
  "org_role": "org:admin",
  "org_slug": "orangeburg",
  "email": "user@example.com",
  "iss": "https://clerk.com",
  "aud": "authenticated",
  "exp": 1234567890
}
```

---

## Pattern 1: User Owns Data (Customer Portal)

**Use Case**: Customers can only see their own profiles, subscriptions, addresses

**Example**: `subscribers.profiles` table

```sql
-- ========================================
-- POLICY: Users can select/update own profile
-- ========================================

CREATE POLICY "users_select_own_profile"
ON subscribers.profiles
FOR SELECT
TO authenticated
USING (clerk_user_id = (auth.jwt()->>'sub'));

CREATE POLICY "users_update_own_profile"
ON subscribers.profiles
FOR UPDATE
TO authenticated
USING (clerk_user_id = (auth.jwt()->>'sub'))
WITH CHECK (clerk_user_id = (auth.jwt()->>'sub'));

-- Cannot delete own profile (admin only)
CREATE POLICY "prevent_user_profile_deletion"
ON subscribers.profiles
FOR DELETE
TO authenticated
USING (FALSE);  -- Block all deletes for authenticated users
```

**Tested With**:
```sql
-- As authenticated user
SET request.jwt.claims TO '{"sub": "user_123", "org_id": "orangeburg"}';

SELECT * FROM subscribers.profiles;
-- Returns: Only rows where clerk_user_id = 'user_123'
```

---

## Pattern 2: Organization-Based Access (Management Portals)

**Use Case**: CRM users see data for their organization's networks

**Example**: `public.subscription_promotions` table

```sql
-- ========================================
-- POLICY: Network operators access their networks' promotions
-- ========================================

CREATE POLICY "network_access_subscription_promotions"
ON public.subscription_promotions
FOR ALL
TO authenticated
USING (
    network_id IN (
        SELECT n.id
        FROM public.networks n
        WHERE n.organization_id = (auth.jwt()->>'org_id')
    )
);
```

**Explanation**:
- User's JWT contains `org_id`
- Query public.networks to find networks for that org
- Filter subscription_promotions to those networks only

**Tested With**:
```sql
SET request.jwt.claims TO '{"sub": "user_abc", "org_id": "orangeburg", "org_role": "org:admin"}';

SELECT * FROM public.subscription_promotions;
-- Returns: Only rows where network_id belongs to 'orangeburg' organization
```

---

## Pattern 3: Role-Based Access (Admin Features)

**Use Case**: Only admins can access certain tables or perform certain operations

**Example**: `public.billing_queue` table

```sql
-- ========================================
-- POLICY: Only admins can view billing queue
-- ========================================

-- Helper function (created in separate migration)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt()->>'org_role') = 'org:admin',
        FALSE
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy using helper function
CREATE POLICY "admin_access_billing_queue"
ON public.billing_queue
FOR ALL
TO authenticated
USING (public.is_admin());

-- Service role always has access (for workers)
CREATE POLICY "service_role_full_access_billing_queue"
ON public.billing_queue
FOR ALL
TO service_role
USING (TRUE);
```

**Why Helper Function?**
- Reusable across multiple policies
- Centralized role logic
- Easier to update (change function, not every policy)
- SECURITY DEFINER prevents injection

**Tested With**:
```sql
-- As admin
SET request.jwt.claims TO '{"sub": "user_abc", "org_role": "org:admin"}';
SELECT * FROM public.billing_queue;
-- Returns: All rows

-- As non-admin
SET request.jwt.claims TO '{"sub": "user_xyz", "org_role": "org:sales_management"}';
SELECT * FROM public.billing_queue;
-- Returns: Zero rows (blocked by policy)
```

---

## Pattern 4: Multi-Role Access

**Use Case**: Multiple roles can access (admin, sales_management, address_manager)

**Example**: `subscribers.inquiries` table

```sql
-- ========================================
-- POLICY: Sales roles can view inquiries
-- ========================================

CREATE POLICY "sales_roles_view_inquiries"
ON subscribers.inquiries
FOR SELECT
TO authenticated
USING (
    (auth.jwt()->>'org_role') IN ('org:admin', 'org:sales_management')
);

-- ========================================
-- POLICY: Only admins can manage inquiries
-- ========================================

CREATE POLICY "admin_manage_inquiries"
ON subscribers.inquiries
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (
    (auth.jwt()->>'org_role') = 'org:admin'
);

-- ========================================
-- POLICY: Anonymous users can create inquiries (lead capture)
-- ========================================

CREATE POLICY "anon_create_inquiry"
ON subscribers.inquiries
FOR INSERT
TO anon
WITH CHECK (TRUE);  -- Allow all anonymous insertions

-- ========================================
-- POLICY: Users can update their own inquiries
-- ========================================

CREATE POLICY "users_update_own_inquiries"
ON subscribers.inquiries
FOR UPDATE
TO authenticated
USING (
    user_id = (
        SELECT id FROM subscribers.profiles
        WHERE clerk_user_id = (auth.jwt()->>'sub')
    )
);
```

**Multiple Policies on Same Table**:
- Policies are OR-ed together
- User gets access if ANY policy matches
- More specific policies take precedence

---

## Pattern 5: Vendor Network Access

**Use Case**: Vendors have access to specific networks (not all)

**Example**: `public.work_orders` table

```sql
-- ========================================
-- POLICY: Admins see all work orders
-- ========================================

CREATE POLICY "admin_access_work_orders"
ON public.work_orders
FOR ALL
TO authenticated
USING (public.is_admin());

-- ========================================
-- POLICY: Vendors see work orders for assigned networks
-- ========================================

CREATE POLICY "vendor_network_access_work_orders"
ON public.work_orders
FOR SELECT
TO authenticated
USING (
    network_id IN (
        SELECT vna.network_id
        FROM public.vendor_network_access vna
        JOIN public.vendors v ON v.id = vna.vendor_id
        WHERE v.clerk_organization_id = (auth.jwt()->>'org_id')
          AND vna.is_active = TRUE
    )
);
```

**Tables Involved**:
- `vendors` - Vendor companies
- `vendor_network_access` - Junction table (vendor_id, network_id, access_level)

**Logic**: User's org_id → vendor record → vendor_network_access → allowed network_ids

---

## Pattern 6: Superuser Bypass

**Use Case**: Superuser organization has access to all data

**Example**: `public.promotions` table

```sql
-- ========================================
-- POLICY: Network operators manage their promotions
-- ========================================

CREATE POLICY "network_operators_manage_promotions"
ON public.promotions
FOR ALL
TO authenticated
USING (
    -- Either superuser
    (auth.jwt()->>'org_id') = 'superusers'
    OR
    -- Or network operator for this promotion's network
    network_id IN (
        SELECT n.id FROM public.networks n
        WHERE n.organization_id = (auth.jwt()->>'org_id')
    )
);
```

**Pattern**: Always check for superusers first, then normal access rules

---

## Pattern 7: Service Role Bypass

**Use Case**: Background workers (Python) need full access

**Example**: All tables with RLS

```sql
-- Policy for service role (Python workers)
CREATE POLICY "service_role_full_access_<table>"
ON <schema>.<table>
FOR ALL
TO service_role
USING (TRUE)
WITH CHECK (TRUE);
```

**Authentication**:
```python
# Python worker uses service role key
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY  # Not anon key!
)

# Bypasses all RLS policies
```

**Security**: Keep service_role_key secret, never expose to frontend

---

## Pattern 8: Conditional Policies (Different Rules per Operation)

**Example**: Profiles - users can SELECT/UPDATE own, but only admins can DELETE

```sql
-- Users can view own profile
CREATE POLICY "users_view_own_profile"
ON subscribers.profiles
FOR SELECT
TO authenticated
USING (clerk_user_id = (auth.jwt()->>'sub'));

-- Users can update own profile
CREATE POLICY "users_update_own_profile"
ON subscribers.profiles
FOR UPDATE
TO authenticated
USING (clerk_user_id = (auth.jwt()->>'sub'))
WITH CHECK (clerk_user_id = (auth.jwt()->>'sub'));

-- Only admins can delete
CREATE POLICY "admin_delete_profiles"
ON subscribers.profiles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Admins can also view/update all
CREATE POLICY "admin_full_access_profiles"
ON subscribers.profiles
FOR SELECT, UPDATE
TO authenticated
USING (public.is_admin());
```

**Result**:
- Regular users: SELECT + UPDATE own data only
- Admins: SELECT + UPDATE all data + DELETE

---

## Pattern 9: Cross-Schema Policy (Network Schema → Public)

**Example**: Subscriptions can reference products from public schema

**RLS on public.products**:
```sql
-- Anyone can view products (they're public catalog)
CREATE POLICY "public_read_products"
ON public.products
FOR SELECT
TO authenticated, anon
USING (is_active = TRUE);

-- Only admins can manage products
CREATE POLICY "admin_manage_products"
ON public.products
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (public.is_admin());
```

**No special policy needed**: Network schema tables can query public schema freely (FK relationship handles security)

---

## Pattern 10: Time-Based Policies

**Example**: Archive data only accessible after certain date

```sql
CREATE POLICY "recent_archive_access"
ON public.billing_queue_archive
FOR SELECT
TO authenticated
USING (
    public.is_admin()
    OR
    archived_at >= NOW() - INTERVAL '30 days'  -- Last 30 days
);
```

---

## Helper Functions for RLS

### Standard Helper Functions

**File**: `20251002000003_create_rls_helper_functions.sql`

```sql
-- ========================================
-- Helper function: is_admin()
-- ========================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt()->>'org_role') = 'org:admin',
        FALSE
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Helper function: is_sales_manager()
-- ========================================

CREATE OR REPLACE FUNCTION public.is_sales_manager()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt()->>'org_role') = 'org:sales_management',
        FALSE
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Helper function: is_schedule_manager()
-- ========================================

CREATE OR REPLACE FUNCTION public.is_schedule_manager()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt()->>'org_role') = 'org:schedule_manager',
        FALSE
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Helper function: is_address_manager()
-- ========================================

CREATE OR REPLACE FUNCTION public.is_address_manager()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt()->>'org_role') = 'org:address_manager',
        FALSE
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Helper function: get_user_organization_id()
-- ========================================

CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS TEXT AS $$
BEGIN
    RETURN (auth.jwt()->>'org_id');
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Helper function: is_superuser_org()
-- ========================================

CREATE OR REPLACE FUNCTION public.is_superuser_org()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN COALESCE(
        (auth.jwt()->>'org_id') = 'superusers',
        FALSE
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Pattern**: All helper functions have EXCEPTION handler returning FALSE (fail-safe)

---

## Common RLS Patterns

### Pattern 1: User Owns Record
```sql
-- User can only access their own records
USING (clerk_user_id = (auth.jwt()->>'sub'))

-- Variation: Via foreign key
USING (
    user_id IN (
        SELECT id FROM subscribers.profiles
        WHERE clerk_user_id = (auth.jwt()->>'sub')
    )
)
```

### Pattern 2: Organization Access
```sql
-- User can access records for their organization
USING (organization_id = (auth.jwt()->>'org_id'))
```

### Pattern 3: Network Access
```sql
-- User can access records for their organization's networks
USING (
    network_id IN (
        SELECT n.id FROM public.networks n
        WHERE n.organization_id = (auth.jwt()->>'org_id')
    )
)
```

### Pattern 4: Role Check
```sql
-- Only specific roles can access
USING ((auth.jwt()->>'org_role') = 'org:admin')

-- Multiple roles
USING ((auth.jwt()->>'org_role') IN ('org:admin', 'org:sales_management'))
```

### Pattern 5: Combined Checks (AND)
```sql
-- Must be in organization AND have role
USING (
    network_id IN (
        SELECT n.id FROM public.networks n
        WHERE n.organization_id = (auth.jwt()->>'org_id')
    )
    AND (auth.jwt()->>'org_role') IN ('org:admin', 'org:sales_management')
)
```

### Pattern 6: Combined Checks (OR)
```sql
-- Either admin OR own data
USING (
    public.is_admin()
    OR
    clerk_user_id = (auth.jwt()->>'sub')
)
```

---

## Real-World Examples

### Example 1: Billing Queue (Admin Only)

```sql
ALTER TABLE public.billing_queue ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage billing queue
CREATE POLICY "admin_access_billing_queue"
ON public.billing_queue
FOR ALL
TO authenticated
USING (public.is_admin());

-- Service role (Python workers) needs full access
CREATE POLICY "service_role_full_access_billing_queue"
ON public.billing_queue
FOR ALL
TO service_role
USING (TRUE);
```

**Why**: Billing queue contains sensitive financial data, should be admin-only

---

### Example 2: Available Addresses (Role-Based)

```sql
ALTER TABLE subscribers.available_addresses ENABLE ROW LEVEL SECURITY;

-- Anonymous users can search addresses (public marketing data)
CREATE POLICY "anon_select_available_addresses"
ON subscribers.available_addresses
FOR SELECT
TO anon
USING (TRUE);

-- Authenticated users can search
CREATE POLICY "authenticated_select_available_addresses"
ON subscribers.available_addresses
FOR SELECT
TO authenticated
USING (TRUE);

-- Only address managers can insert/update/delete
CREATE POLICY "address_manager_manage_addresses"
ON subscribers.available_addresses
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (
    public.is_admin()
    OR
    public.is_address_manager()
);

-- Service role for CSV imports
CREATE POLICY "service_role_full_access_addresses"
ON subscribers.available_addresses
FOR ALL
TO service_role
USING (TRUE);
```

**Why**: Addresses are public marketing data (anyone can search), but only managers can modify

---

### Example 3: Service Subscriptions (User + Admin)

```sql
ALTER TABLE subscribers.service_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view own subscriptions
CREATE POLICY "users_view_own_subscriptions"
ON subscribers.service_subscriptions
FOR SELECT
TO authenticated
USING (
    user_id IN (
        SELECT id FROM subscribers.profiles
        WHERE clerk_user_id = (auth.jwt()->>'sub')
    )
);

-- Users can insert own subscriptions (during signup)
CREATE POLICY "users_create_own_subscriptions"
ON subscribers.service_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
    user_id IN (
        SELECT id FROM subscribers.profiles
        WHERE clerk_user_id = (auth.jwt()->>'sub')
    )
);

-- Admins can view/update all subscriptions
CREATE POLICY "admin_access_subscriptions"
ON subscribers.service_subscriptions
FOR ALL
TO authenticated
USING (public.is_admin());

-- Service role for billing system
CREATE POLICY "service_role_access_subscriptions"
ON subscribers.service_subscriptions
FOR ALL
TO service_role
USING (TRUE);
```

**Why**: Users manage own subscriptions during signup, admins manage all, workers process billing

---

### Example 4: Work Orders (Vendor Access)

```sql
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

-- Admins see all work orders
CREATE POLICY "admin_access_work_orders"
ON public.work_orders
FOR ALL
TO authenticated
USING (public.is_admin());

-- Schedule managers see work orders for their networks
CREATE POLICY "schedule_manager_access_work_orders"
ON public.work_orders
FOR SELECT, UPDATE
TO authenticated
USING (
    public.is_schedule_manager()
    AND
    network_id IN (
        SELECT n.id FROM public.networks n
        WHERE n.organization_id = (auth.jwt()->>'org_id')
    )
);

-- Vendors see work orders for networks they have access to
CREATE POLICY "vendor_access_work_orders"
ON public.work_orders
FOR SELECT, UPDATE
TO authenticated
USING (
    network_id IN (
        SELECT vna.network_id
        FROM public.vendor_network_access vna
        JOIN public.vendors v ON v.id = vna.vendor_id
        WHERE v.clerk_organization_id = (auth.jwt()->>'org_id')
          AND vna.is_active = TRUE
          AND vna.access_level IN ('read', 'write', 'admin')
    )
);
```

**Complex Access**: Vendors → vendor_network_access table → network_ids

---

## Testing RLS Policies

### Test Script Template
```sql
-- ========================================
-- RLS POLICY TESTS FOR: <table_name>
-- ========================================

-- Setup: Create test data
DO $$
DECLARE
    v_user1_id UUID;
    v_user2_id UUID;
BEGIN
    -- Create test users in different orgs
    INSERT INTO subscribers.profiles (clerk_user_id, email)
    VALUES ('user_1', 'user1@orangeburg.com')
    RETURNING id INTO v_user1_id;

    -- Create test subscriptions
    INSERT INTO subscribers.service_subscriptions (user_id, price_monthly, status)
    VALUES (v_user1_id, 5000, 'active');
END $$;

-- ========================================
-- TEST 1: User sees own data only
-- ========================================

SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "user_1", "org_id": "orangeburg"}';

SELECT COUNT(*) FROM subscribers.service_subscriptions;
-- Expected: 1 (user_1's subscription only)

-- ========================================
-- TEST 2: User cannot see other users' data
-- ========================================

SET request.jwt.claims TO '{"sub": "user_2", "org_id": "orangeburg"}';

SELECT COUNT(*) FROM subscribers.service_subscriptions;
-- Expected: 0 (no access to user_1's data)

-- ========================================
-- TEST 3: Admin sees all
-- ========================================

SET request.jwt.claims TO '{"sub": "admin_user", "org_id": "orangeburg", "org_role": "org:admin"}';

SELECT COUNT(*) FROM subscribers.service_subscriptions;
-- Expected: All subscriptions for Orangeburg network

-- ========================================
-- TEST 4: Cross-org access blocked
-- ========================================

SET request.jwt.claims TO '{"sub": "user_3", "org_id": "jamestown_bpu"}';

SELECT COUNT(*) FROM subscribers.service_subscriptions;
-- Expected: 0 (different organization)

-- ========================================
-- CLEANUP
-- ========================================

RESET ROLE;
-- DELETE test data
```

---

## Debugging RLS Issues

### Check Effective Policies
```sql
-- See which policies apply to table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = '<table_name>';
```

### Check Current JWT Claims
```sql
-- As authenticated user
SELECT current_setting('request.jwt.claims', true)::json;

-- Extract specific claim
SELECT current_setting('request.jwt.claims', true)::json->>'org_id';
```

### Check Policy Evaluation
```sql
-- Enable RLS debugging in Supabase client
const supabase = createClient(url, key, {
  auth: { debug: true }
});

-- Logs show which policies matched/failed
```

### Bypass RLS for Testing
```sql
-- Temporarily disable RLS (local only!)
ALTER TABLE <table> DISABLE ROW LEVEL SECURITY;

-- Query without RLS
SELECT * FROM <table>;

-- Re-enable
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
```

---

## Performance Considerations

### Expensive Policies
**Problem**: Subquery policies can be slow

```sql
-- ❌ SLOW: Subquery per row
USING (
    network_id IN (
        SELECT id FROM networks WHERE organization_id = (auth.jwt()->>'org_id')
    )
)
```

**Solution 1**: Index the subquery table
```sql
CREATE INDEX idx_networks_org ON public.networks(organization_id);
```

**Solution 2**: Use helper function with caching
```sql
CREATE FUNCTION get_user_network_ids()
RETURNS UUID[]
LANGUAGE plpgsql
STABLE  -- Can be cached during query
AS $$
BEGIN
    RETURN ARRAY(
        SELECT id FROM networks WHERE organization_id = (auth.jwt()->>'org_id')
    );
END;
$$;

-- Policy
USING (network_id = ANY(get_user_network_ids()))
```

---

## Common Mistakes

### ❌ Mistake 1: Forgetting WITH CHECK
```sql
-- Bad: Only USING clause
CREATE POLICY "users_update"
ON table FOR UPDATE
USING (user_id = current_user_id);

-- Good: Both USING and WITH CHECK
CREATE POLICY "users_update"
ON table FOR UPDATE
USING (user_id = current_user_id)
WITH CHECK (user_id = current_user_id);
```

**Why**: USING checks OLD row, WITH CHECK validates NEW row

---

### ❌ Mistake 2: Overly Permissive Anonymous Access
```sql
-- Bad: Allows anon to do anything
CREATE POLICY "anon_access"
ON table FOR ALL TO anon
USING (TRUE);

-- Good: Specific operation only
CREATE POLICY "anon_create_inquiry"
ON inquiries FOR INSERT TO anon
WITH CHECK (TRUE);  -- Only INSERT, not SELECT/UPDATE/DELETE
```

---

### ❌ Mistake 3: No Service Role Policy
```sql
-- Bad: Service role blocked by RLS
-- (workers can't access data)

-- Good: Always add service role policy
CREATE POLICY "service_role_access"
ON table FOR ALL TO service_role
USING (TRUE);
```

---

## Policy Maintenance

### Updating Policies
```sql
-- Drop old policy
DROP POLICY IF EXISTS "old_policy_name" ON <schema>.<table>;

-- Create new policy
CREATE POLICY "new_policy_name"
ON <schema>.<table>
FOR ALL
TO authenticated
USING (<new_condition>);
```

### Renaming Policies
**Not Supported**: Must drop and recreate

```sql
DROP POLICY "old_name" ON table;
CREATE POLICY "new_name" ON table FOR ALL USING (...);
```

---

## RLS Policy Checklist

Before deploying RLS policies:

- [ ] Table has RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- [ ] Policy for `authenticated` role exists
- [ ] Policy for `service_role` exists (if needed by workers)
- [ ] Policy for `anon` exists (if public access needed)
- [ ] Helper functions exist (is_admin, etc.)
- [ ] Tested with different JWT claims
- [ ] Tested superuser access
- [ ] Tested cross-org blocking
- [ ] Performance tested (check EXPLAIN ANALYZE)
- [ ] No unintended data leakage

---

**Reference**: For complete RLS examples, see migrations in `app-support-billing-discounts/supabase/migrations/`
