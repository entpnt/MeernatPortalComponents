# Application Family - Billing Discounts System

**Last Updated**: 2025-12-03
**Total Applications**: 8
**Shared Supabase Instance**: meernat-base-structure
**Architecture**: Multi-app monorepo with shared and standalone patterns

---

## Application Overview

```
billing-discounts/
├── network-sites/
│   ├── jamestown-billing-discounts/      (Customer Portal - Jamestown)
│   └── orangeburg-billing-discounts/     (Customer Portal - Orangeburg)
├── app-support-billing-discounts/        (Infrastructure Hub)
├── services-billing-discounts/           (Python Workers)
├── crm-billing-discounts/                (Management Portal - CRM)
├── partner-billing-discounts/            (Management Portal - Partner)
├── installer-billing-discounts/          (Management Portal - Installer)
└── billing-portal-billing-discounts/     (Standalone Portal - Billing)
```

---

## Application Groups

### Group A: Network Sites (Customer-Facing)

#### Jamestown BPU Network Site
**Directory**: `network-sites/jamestown-billing-discounts/`
**Tech Stack**: React 18 + Vite + Clerk + Supabase + i18next
**Database Schema**: `jamestown_bpu`
**Purpose**: Customer portal for Jamestown fiber network

**Key Features**:
- Multi-language support (i18next + Weglot)
- Address verification with USPS
- Customer signup with onboarding
- My Account dashboard
- Blog/resources library

**Config Pattern**: Function-based with caching
**Entry Point**: `src/main.tsx` → `src/App.tsx`

---

#### Orangeburg Network Site
**Directory**: `network-sites/orangeburg-billing-discounts/`
**Tech Stack**: React 18 + Vite + Clerk + Supabase
**Database Schema**: `subscribers`
**Purpose**: Customer portal for Orangeburg fiber network

**Key Features**:
- Advanced installation tracking
- Enhanced checkout with payments
- Downpayment handling
- Data security utilities
- Accessibility testing (axe-core)

**Config Pattern**: NetworkConfigContext Provider (RECOMMENDED)
**Entry Point**: `src/main.tsx` → `NetworkConfigProvider` → `App.tsx`

**Differences from Jamestown**:
- Newer dependencies (Clerk 5.53.3 vs 5.39.0, Supabase 2.80.0 vs 2.45.6)
- Context Provider eliminates race conditions
- Built-in accessibility testing

---

### Group B: Infrastructure & Services

#### App Support (Supabase Hub)
**Directory**: `app-support-billing-discounts/`
**Tech Stack**: Supabase (PostgreSQL + Edge Functions)
**Purpose**: Central database migrations and edge functions

**Structure**:
```
app-support-billing-discounts/
├── supabase/
│   ├── config.toml                    # Supabase project config
│   ├── migrations/                    # 186 SQL migration files
│   ├── functions/                     # 28 TypeScript edge functions
│   └── network_migration_templates/   # Templates for new networks
├── database/documentation/            # 18+ markdown docs
├── scripts/                           # Deployment utilities
└── environments/                      # Config templates
```

**Key Resources**:
- 186 existing migrations
- 130+ RPC functions
- 38 database views
- 28 edge functions

---

#### Services (Python Workers)
**Directory**: `services-billing-discounts/`
**Tech Stack**: Python 3.11 + FastAPI + Supabase Client
**Purpose**: Background job processing (email, billing, payments)

**Workers**:
1. **EmailQueueWorker** - Postmark email delivery
2. **AddressQueueWorker** - Address validation/updates
3. **BillingQueueWorker** - Automated billing job creation
4. **BillingNotificationWorker** - Billing notifications
5. **PaymentProcessorWorker** - Stripe payment processing

**Deployment**: Render.com (worker dyno)
**Health Check**: FastAPI server on port 8080

---

### Group C: Management Portals (Shared Core Framework)

**Shared Characteristics**:
- All use portable `src/auth/` module (Clerk integration)
- All use portable `src/supabase/` module (database client)
- Project-specific `src/config/app-config.ts` for roles/permissions
- App-specific `src/database/` for business logic

---

#### CRM Portal
**Directory**: `crm-billing-discounts/`
**Tech Stack**: React 18 + Vite + Clerk + Supabase + React Query
**Database Schema**: `public` (organization-isolated)
**Purpose**: Multi-network customer management

**Allowed Roles**: admin, sales_management
**Allowed Organizations**: superusers, orangeburg

**Key Features**:
- Multi-network dashboard
- Subscriber management (19-column table)
- Work order tracking
- Analytics with Recharts
- Export to CSV

**React Query**: 5-minute stale time, 1 retry

---

#### Partner Portal
**Directory**: `partner-billing-discounts/`
**Tech Stack**: React 18 + Vite + Clerk + Supabase
**Database Schema**: `public`
**Purpose**: Partner portal for schedules, addresses, sales

**Allowed Roles**: admin, address_manager, sales_management, schedule_manager
**Allowed Organizations**: superusers, orangeburg, nationalondemand

**Key Features**:
- Address management
- Schedule manager for installations
- Lead/sales tracking
- CSV import/export (Papa Parse)
- Multiple role support

**Differences from CRM**:
- More specialized roles (address_manager, schedule_manager)
- CSV capabilities
- No React Query (simpler)

---

#### Installer Portal
**Directory**: `installer-billing-discounts/`
**Tech Stack**: React 18 + Vite + Clerk + Supabase
**Database Schema**: `public`
**Purpose**: Service installer workflows

**Allowed Roles**: admin, partner_manager, service_installer
**Allowed Organizations**: superusers, orangeburg, nationalondemand

**Key Features**:
- Installation request management
- Installer notes with HTML sanitization (DOMPurify)
- Dashboard statistics
- Network-specific installation views

**Simplest Portal**: No React Query, no analytics

---

### Group D: Standalone Portal

#### Billing Portal
**Directory**: `billing-portal-billing-discounts/`
**Tech Stack**: React 18 + Vite + Clerk + Supabase + React Query
**Database Schema**: `public`
**Purpose**: Service provider billing management

**Key Features**:
- Payment management (display, filter, manage)
- Organization management
- Notification system
- Product catalog
- Role-based dashboards (Service Provider vs Network Operator)

**Architecture**: Standalone (does NOT use shared core framework)
- Custom Supabase client: `src/lib/getSupabaseClientWithAuth.tsx`
- Direct Clerk integration (no shared auth module)
- Independent patterns

---

## Shared Resources

### Database (Supabase)
**URL**: https://meernat-base-structure.supabase.co
**Anon Key**: Shared across all apps (public read access)
**Schemas**: public, subscribers, jamestown_bpu

**Access Patterns**:
- Network Sites: Single schema (own network)
- Management Portals: Multi-schema (all networks via views)
- Services: All schemas via RPC functions
- Billing Portal: Public schema only

---

### Authentication (Clerk)
**Provider**: Clerk (Third-party JWT)
**Integration**: Custom Supabase JWT template

**JWT Flow**:
1. User authenticates with Clerk
2. Clerk issues JWT with custom claims (org_id, org_role)
3. React app gets token: `await getToken({ template: 'supabase' })`
4. Supabase client created with JWT in Authorization header
5. RLS policies validate JWT claims

**Shared Across**: ALL React applications

---

### Deployment

**React Apps**: Vercel
- Build: `npm run build` → `/dist`
- Deploy: Auto from GitHub push
- SPA routing: All routes → `/index.html`

**Python Services**: Render.com
- Build: `pip install -r requirements.txt`
- Start: `python main.py`
- Health checks: Port 8080

**Database**: Supabase Cloud
- Migrations: `supabase db push`
- Edge Functions: `supabase functions deploy`

---

## Application Interdependencies

### Dependency Graph
```
App Support (Database)
    ↓ Provides schemas/RPCs/views
    ├─→ Services (Python) - Calls RPCs
    │       ↓ Processes billing
    │       └─→ Creates Stripe invoices
    │
    ├─→ CRM Portal - Queries public + network schemas
    ├─→ Partner Portal - Queries public + network schemas
    ├─→ Installer Portal - Queries public schema
    ├─→ Billing Portal - Queries public schema
    ├─→ Orangeburg Site - Queries subscribers schema
    └─→ Jamestown Site - Queries jamestown_bpu schema
```

### Critical Path for New Features
1. **Database migrations** (App Support) - MUST deploy first
2. **Backend integration** (Services) - Depends on database
3. **Frontend UIs** (All React apps) - Depend on database, can parallelize

---

## Communication Between Apps

### Pattern 1: Database as Integration Point
**Most Common**: Apps don't communicate directly, share data via database

**Example**: CRM creates promotion → Database stores → Partner Portal queries

### Pattern 2: Webhook Events
**Edge Functions**: Clerk webhooks, Stripe webhooks

**Example**: Stripe invoice paid → Webhook edge function → Update database → Apps query updated data

### Pattern 3: Email Queue
**Services**: Apps enqueue emails → EmailQueueWorker sends

**Example**: Network site signup → Edge function calls `enqueue_signup_inquiry_email()` → Worker sends email

---

## Tech Stack Matrix

| Component | Tech | All Apps | Shared Core Apps | Standalone Apps |
|-----------|------|----------|------------------|-----------------|
| **Frontend Framework** | React 18 | ✅ | ✅ | ✅ |
| **Build Tool** | Vite 6.2+ | ✅ | ✅ | ✅ |
| **Language** | TypeScript 5.x | ✅ | ✅ | ✅ |
| **UI Components** | Radix UI (shadcn/ui) | ✅ | ✅ | ✅ |
| **Styling** | Tailwind CSS 3.4+ | ✅ | ✅ | ✅ |
| **Authentication** | Clerk | ✅ | ✅ | ✅ |
| **Database** | Supabase | ✅ | ✅ | ✅ |
| **Shared Auth Module** | src/auth/ | ❌ | ✅ | ❌ |
| **Shared DB Module** | src/supabase/ | ❌ | ✅ | ❌ |
| **State Management** | React Query | Some | CRM only | Billing Portal |

---

## Environment Variables

### Common Across All React Apps
```env
VITE_SUPABASE_URL=https://meernat-base-structure.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Network-Specific (Network Sites Only)
```env
# Orangeburg
VITE_NETWORK=orangeburg

# Jamestown
VITE_NETWORK=jamestown
VITE_NETWORK_SCHEMA=jamestown_bpu
```

### Python Services
```env
SUPABASE_URL=https://meernat-base-structure.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # Service role (elevated)
POLL_INTERVAL=10  # Seconds
BATCH_SIZE=10     # Jobs per poll
```

---

## Build Commands by App Type

### React Apps (All)
```bash
npm run dev              # Dev server (http://localhost:5173)
npm run build           # Production build → /dist
npm run preview         # Preview production build
npm run lint            # ESLint
npm run types:supabase  # Generate Supabase types
```

### Python Services
```bash
python main.py          # Start workers
pytest tests/           # Run tests
```

### Supabase (App Support)
```bash
supabase migration new <name>     # Create migration
supabase db reset                 # Reset local DB
supabase db push                  # Deploy migrations
supabase functions deploy <name>  # Deploy edge function
```

---

## Port Assignments

| Application | Port | Environment |
|------------|------|-------------|
| Jamestown Site | 5173 | Dev (Vite) |
| Orangeburg Site | 5173 | Dev (Vite) |
| CRM Portal | 5173 | Dev (Vite) |
| Partner Portal | 5173 | Dev (Vite) |
| Installer Portal | 5173 | Dev (Vite) |
| Billing Portal | 5173 | Dev (Vite) |
| Services API | 8080 | Health checks |

**Note**: React apps use same dev port (run one at a time locally)

---

## Application Roles & Permissions

### Defined in app-config.ts (Shared Core Apps)

**CRM Portal**:
```typescript
allowedRoles: ['admin', 'sales_management']
featurePermissions: {
  viewLeads: ['admin', 'sales_management'],
  manageLeads: ['admin', 'sales_management'],
  viewAnalytics: ['admin'],
  viewNetworks: ['admin']
}
```

**Partner Portal**:
```typescript
allowedRoles: ['admin', 'address_manager', 'sales_management', 'schedule_manager']
featurePermissions: {
  viewAddresses: ['admin', 'address_manager'],
  manageAddresses: ['admin', 'address_manager'],
  viewSchedules: ['admin', 'schedule_manager'],
  manageSchedules: ['admin', 'schedule_manager'],
  viewLeads: ['admin', 'sales_management']
}
```

**Installer Portal**:
```typescript
allowedRoles: ['admin', 'partner_manager', 'service_installer']
```

**Network Sites & Billing Portal**: No explicit role configuration (customer access or org-based)

---

## Shared Core Framework (CRM, Partner, Installer)

### What is Shared?

**Portable Modules** (can be copied between projects):
```
src/
├── auth/                   # PORTABLE - Clerk integration
│   ├── components/         # SignIn, SignUp, AuthGuard
│   ├── hooks/              # useAuth, useRoleCheck, useAppAccess
│   ├── ClerkAuthProvider.tsx
│   └── README.md
│
├── supabase/               # PORTABLE - Database client
│   ├── client.ts           # Clerk-authenticated Supabase client
│   ├── hooks/              # useSupabase, useQuery, useMutation
│   ├── utils/              # Error handling, RLS debugging
│   └── README.md
│
├── config/                 # PROJECT-SPECIFIC
│   └── app-config.ts       # Roles, orgs, permissions
│
└── database/               # PROJECT-SPECIFIC
    ├── services/           # Business logic
    └── hooks/              # React hooks for DB operations
```

### Porting Process
1. Copy `src/auth/` and `src/supabase/` directories
2. Update `src/config/app-config.ts` with new app's roles/orgs
3. Create `src/database/services/` for app-specific logic
4. Update `package.json` dependencies
5. Configure environment variables

**Time to Port**: 2-4 hours (mostly configuration)

---

## Standalone Architecture (Billing Portal, Network Sites)

**Why Standalone?**
- **Billing Portal**: Pre-dates core framework, established patterns
- **Network Sites**: Customer-facing (different architecture needs)

**Trade-offs**:
- **Pros**: Full flexibility, optimized for use case
- **Cons**: No shared improvements, more maintenance

---

## Application Access Patterns

### By User Type

**Customers** (Network Sites):
- Jamestown Site: `jamestown_bpu` schema only
- Orangeburg Site: `subscribers` schema only
- See only their own data (RLS enforced)

**Network Operators** (CRM):
- Can select network to view
- Queries `all_*` views (cross-network)
- Filtered by organization RLS

**Sales Team** (Partner Portal):
- Can access assigned networks
- Applies promotions to subscribers
- Manages leads/inquiries

**Service Providers** (Billing Portal):
- View payment records for their networks
- Manage promotion opt-in/opt-out
- Organization-level access

**Installers** (Installer Portal):
- View installation requests for assigned networks
- Update installation status
- Add installer notes

---

## Database Access Patterns

### Pattern 1: Direct Table Queries (Network Sites)
```typescript
// Single network, single schema
const { data } = await supabase
  .from('service_subscriptions')
  .schema('subscribers')
  .select('*')
  .eq('user_id', userId);
```

### Pattern 2: View Queries (Management Portals)
```typescript
// Multi-network aggregated data
const { data } = await supabase
  .from('all_service_address_subscriptions_view')
  .select('*')
  .eq('schema', selectedNetwork.schema_name);
```

### Pattern 3: RPC Calls (Complex Operations)
```typescript
// Business logic in database
const { data } = await supabase.rpc('apply_promotion_to_subscription', {
  p_network_id: networkId,
  p_subscription_id: subscriptionId,
  p_promotion_id: promotionId,
  p_applied_by: userId
});

// Returns: {success: true/false, message: '...'}
```

### Pattern 4: Service Role Queries (Python Workers)
```python
# Elevated privileges for background jobs
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY  # Not anon key!
)

# Can bypass RLS with service role
```

---

## React Component Patterns

### UI Component Library
**All Apps Use**: Radix UI (shadcn/ui) + Tailwind CSS

**Common Components**:
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/dialog.tsx`
- `components/ui/table.tsx`
- `components/ui/badge.tsx`
- `components/ui/select.tsx`
- `components/ui/input.tsx`

**Styling**: Tailwind utility classes

---

### Data Fetching Patterns

**CRM Portal & Billing Portal** (React Query):
```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['key', param],
  queryFn: async () => {
    const { data } = await supabase.from('table').select('*');
    return data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

**Partner Portal, Installer Portal, Network Sites** (useState + useEffect):
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    const { data } = await supabase.from('table').select('*');
    setData(data);
    setLoading(false);
  }
  fetchData();
}, []);
```

---

## Application-Specific Patterns

### CRM Portal - Network Selection
```typescript
// NetworkContext provides selected network
const { selectedNetwork, setSelectedNetwork } = useNetworkContext();

// All queries filtered by selected network
const { data } = useQuery({
  queryKey: ['subscribers', selectedNetwork?.id],
  queryFn: () => fetchSubscribers(selectedNetwork.schema_name),
  enabled: !!selectedNetwork
});
```

### Partner Portal - Lead Tracking
**Screen**: `/lead-tracking`
**View**: Queries `inquiries` table from network schemas
**Features**: Date range filter, export CSV, conversion tracking

### Orangeburg - SignupDataCleanupProvider
**Unique Feature**: Automatic cleanup of incomplete signups

```typescript
<SignupDataCleanupProvider>
  <NetworkConfigProvider>
    <App />
  </NetworkConfigProvider>
</SignupDataCleanupProvider>
```

**Purpose**: Removes orphaned onboarding data after timeout

---

## File Locations Reference

### CRM Portal
- Entry: `/Users/dev007/Sites/projects/billing-discounts/crm-billing-discounts/src/main.tsx`
- Config: `/Users/dev007/Sites/projects/billing-discounts/crm-billing-discounts/src/config/app-config.ts`
- Auth: `/Users/dev007/Sites/projects/billing-discounts/crm-billing-discounts/src/auth/`
- DB: `/Users/dev007/Sites/projects/billing-discounts/crm-billing-discounts/src/database/`

### Partner Portal
- Entry: `/Users/dev007/Sites/projects/billing-discounts/partner-billing-discounts/src/main.tsx`
- Config: `/Users/dev007/Sites/projects/billing-discounts/partner-billing-discounts/src/config/app-config.ts`

### Billing Portal
- Entry: `/Users/dev007/Sites/projects/billing-discounts/billing-portal-billing-discounts/src/main.tsx`
- Supabase: `/Users/dev007/Sites/projects/billing-discounts/billing-portal-billing-discounts/src/lib/getSupabaseClientWithAuth.tsx`

### Orangeburg Site
- Entry: `/Users/dev007/Sites/projects/billing-discounts/network-sites/orangeburg-billing-discounts/src/main.tsx`
- Network Context: `/Users/dev007/Sites/projects/billing-discounts/network-sites/orangeburg-billing-discounts/src/contexts/NetworkConfigContext.tsx`

### Jamestown Site
- Entry: `/Users/dev007/Sites/projects/billing-discounts/network-sites/jamestown-billing-discounts/src/main.tsx`
- Network Config: `/Users/dev007/Sites/projects/billing-discounts/network-sites/jamestown-billing-discounts/src/config/networkConfig.ts`

### Services
- Entry: `/Users/dev007/Sites/projects/billing-discounts/services-billing-discounts/src/main.py`
- Workers: `/Users/dev007/Sites/projects/billing-discounts/services-billing-discounts/src/workers/`

### App Support
- Migrations: `/Users/dev007/Sites/projects/billing-discounts/app-support-billing-discounts/supabase/migrations/`
- Edge Functions: `/Users/dev007/Sites/projects/billing-discounts/app-support-billing-discounts/supabase/functions/`

---

## Adding a New Application

### Shared Core Framework App
1. Copy CRM or Partner Portal directory
2. Update `src/config/app-config.ts` (appName, roles, permissions)
3. Create `src/database/services/` for app logic
4. Update UI components in `src/components/`
5. Configure environment variables
6. Deploy to Vercel

**Time**: 4-8 hours

### Standalone App
1. Create new React app with Vite
2. Install dependencies (Clerk, Supabase, Radix UI, Tailwind)
3. Configure Clerk authentication
4. Configure Supabase client
5. Build UI components
6. Deploy to Vercel

**Time**: 1-2 days

---

## Cross-App Feature Development

### Scenario: Feature Touches Multiple Apps

**Example**: Promotions feature (current)

**Affected Apps**:
1. App Support - Database migrations
2. Services - Billing worker integration
3. CRM Portal - Promotion management UI
4. Partner Portal - Apply promotions UI
5. Billing Portal - Opt-in/opt-out UI
6. Orangeburg Site - Display promotions
7. Jamestown Site - Display promotions

**Coordination**:
1. **Database Team** deploys migrations first
2. **Backend Team** integrates workers (depends on database)
3. **Frontend Teams** build UIs in parallel (depend on database)
4. **QA Team** tests all integrations

**Documentation**: Use cross-app-feature-orchestrator pattern (ProjectDocumentation/)

---

**Summary**: 8 applications, 3 architecture patterns (shared core, standalone, infrastructure), single database instance, coordinated deployment.
