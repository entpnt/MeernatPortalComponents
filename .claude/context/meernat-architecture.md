# Meernat System Architecture

**System Name**: Meernat Billing & Customer Management Platform
**Last Updated**: 2025-12-03
**Components**: 8 Applications, 1 Database, 5+ External Services

---

## System Overview

**Purpose**: Comprehensive billing, customer management, and service delivery platform for fiber internet service providers across multiple geographic networks.

**Business Model**: Open-access network platform where:
- **Service Providers** (e.g., Meernat) sell internet service
- **Network Operators** (e.g., Orangeburg, Jamestown BPU) own fiber infrastructure
- Platform manages the complete customer lifecycle from signup to billing

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│  Clerk Auth  │  Stripe  │  Postmark  │  USPS API  │  FlowOps   │
└────┬─────────┴────┬────┴─────┬──────┴─────┬──────┴──────┬──────┘
     │              │          │            │             │
     │ Auth         │ Payment  │ Email      │ Address     │ Provisioning
     │              │          │            │             │
┌────▼──────────────▼──────────▼────────────▼─────────────▼──────┐
│                   APPLICATION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   CUSTOMER   │  │  MANAGEMENT  │  │   PROVIDER   │         │
│  │    SITES     │  │   PORTALS    │  │   PORTALS    │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │ • Jamestown  │  │ • CRM        │  │ • Billing    │         │
│  │ • Orangeburg │  │ • Partner    │  │              │         │
│  │              │  │ • Installer  │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              BACKGROUND WORKERS (Python)                 │  │
│  │  Email │ Billing │ Payments │ Address │ Notifications   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Database Queries
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    DATABASE LAYER (Supabase)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   PUBLIC     │  │  SUBSCRIBERS │  │ JAMESTOWN_   │         │
│  │   SCHEMA     │  │   SCHEMA     │  │  BPU SCHEMA  │         │
│  │              │  │              │  │              │         │
│  │ Infrastructure│  │  Orangeburg  │  │  Jamestown   │         │
│  │ Products     │  │  Customers   │  │  Customers   │         │
│  │ Billing      │  │  ~46 users   │  │  ~14 users   │         │
│  │ Work Orders  │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  Migrations: 186 files                                          │
│  RPC Functions: 130+                                            │
│  Views: 38                                                      │
│  Edge Functions: 28                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend (7 React Apps)
- **Framework**: React 18.2.0
- **Language**: TypeScript 5.x
- **Build**: Vite 6.2+
- **UI**: Radix UI (shadcn/ui) + Tailwind CSS 3.4+
- **Auth**: Clerk 5.33-5.53 (varies by app)
- **Database**: Supabase JS Client 2.45-2.80
- **State**: React Query (CRM, Billing Portal) or useState/useEffect (others)
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel

### Backend (Python Workers)
- **Language**: Python 3.11+
- **Framework**: FastAPI 0.121 (health check API)
- **Database**: Supabase Python Client 2.23.2
- **Scheduler**: APScheduler 3.10.4
- **Logging**: Structlog 25.5.0 (JSON logs)
- **Email**: Postmark API
- **Deployment**: Render.com (worker)

### Database (Supabase)
- **Database**: PostgreSQL 15+
- **Extensions**: pg_trgm, uuid-ossp, fuzzystrmatch
- **Schemas**: 3 (public, subscribers, jamestown_bpu)
- **Edge Runtime**: Deno (TypeScript edge functions)
- **Deployment**: Supabase Cloud

---

## Data Flow Patterns

### Customer Signup Flow
```
1. Customer visits network site (Jamestown or Orangeburg)
   ↓
2. Checks address availability
   ↓ Calls edge function: address-search
   ↓ Queries: <network_schema>.available_addresses
   ↓
3. Creates inquiry (lead)
   ↓ RPC: create_inquiry()
   ↓ Inserts: <network_schema>.inquiries
   ↓
4. Signs up (Clerk authentication)
   ↓ Clerk creates user
   ↓ Clerk JWT issued
   ↓
5. Completes account setup
   ↓ RPC: complete_account_setup()
   ↓ Creates: profiles, service_addresses, onboarding_progress
   ↓ Marks inquiry as converted
   ↓
6. Selects product and creates subscription
   ↓ RPC: create_subscription()
   ↓ Creates: service_subscriptions
   ↓ Triggers: Auto-apply promotions (if configured)
   ↓
7. Checkout with Stripe
   ↓ Edge function: create-checkout-session
   ↓ Stripe session created
   ↓
8. Payment method saved
   ↓ Stripe webhook → Edge function
   ↓ Updates: service_subscriptions with stripe_session_data
```

---

### Automated Billing Flow
```
1. Daily: BillingQueueWorker polls
   ↓ RPC: get_subscriptions_due_for_billing()
   ↓ Returns: All subscriptions where next_billing_date <= today + 24hrs
   ↓
2. For each subscription:
   ↓ RPC: calculate_promotion_credits_for_subscription()
   ↓ Returns: {original_amount, credit_amount, net_amount}
   ↓
3. Insert into billing_queue
   ↓ Stores: subscription_id, network_schema, amounts
   ↓
4. PaymentProcessorWorker processes queue
   ↓ Fetches: billing_queue records with status='pending'
   ↓
5. Creates Stripe invoice
   ↓ Line Item 1: +$50 (subscription charge)
   ↓ Line Item 2: -$50 (promotion credit)
   ↓ Total: $0
   ↓
6. Finalize invoice (charges customer)
   ↓ Stripe charges payment method on file
   ↓
7. Update database
   ↓ Insert: payment_records
   ↓ Update: service_subscriptions (next_billing_date += 1 month)
   ↓ Update: billing_queue (status='completed')
   ↓ Update: promotion_credits (status='applied')
   ↓
8. Archive billing job
   ↓ Move: billing_queue → billing_queue_archive
```

---

### Installation Request Flow
```
1. Customer schedules installation (network site)
   ↓ RPC: create_simple_installation_request()
   ↓ Insert: <network_schema>.installation_requests
   ↓
2. Edge function creates work order
   ↓ Edge function: process-installation-requests
   ↓ RPC: convert_installation_request_to_work_order()
   ↓ Insert: public.work_orders
   ↓
3. Installer Portal shows work order
   ↓ Query: public.work_orders (filtered by network)
   ↓ Installer marks started: start_installation_rpc()
   ↓
4. Installation completed
   ↓ RPC: complete_installation_rpc()
   ↓ Update: work_orders, installation_requests, service_addresses
   ↓
5. Confirmation email sent
   ↓ RPC: enqueue_installation_email()
   ↓ Insert: email_queue_jobs
   ↓ EmailQueueWorker processes
   ↓ Postmark sends email
```

---

## Authentication Flow

### Clerk → Supabase JWT Integration

```
1. User signs in via Clerk
   ↓ Clerk authenticates
   ↓ Clerk session created
   ↓
2. React app requests Supabase token
   ↓ await getToken({ template: 'supabase' })
   ↓ Clerk generates JWT with custom claims
   ↓
3. JWT Claims Structure:
   {
     "sub": "user_xxx",           // Clerk user ID
     "org_id": "org_yyy",         // Organization ID
     "org_role": "org:admin",     // Role in organization
     "org_slug": "orangeburg",    // Organization slug
     "iss": "https://clerk.com",
     "aud": "authenticated"
   }
   ↓
4. Supabase client created with JWT
   ↓ Authorization: Bearer <jwt>
   ↓
5. RLS policies validate JWT
   ↓ auth.jwt()->>'org_id'
   ↓ auth.jwt()->>'org_role'
   ↓ auth.jwt()->>'sub'
   ↓
6. Database queries filtered by RLS
   ↓ User sees only authorized data
```

---

## External Service Integrations

### Clerk (Authentication)
**Usage**: All React applications
**Integration**: Third-party JWT
**Organizations**: Maps to network operators (orangeburg, jamestown_bpu, etc.)
**Roles**: org:admin, org:sales_management, org:address_manager, etc.

### Stripe (Payments)
**Usage**: Services (Python), Edge Functions
**Integration**: Stripe JS SDK, Stripe API
**Features**:
- Checkout sessions (signup)
- Invoices (billing)
- Payment intents (charges)
- Webhooks (invoice.paid, payment.failed)

**Connected Accounts**: Each service provider has stripe_account_id

### Postmark (Email)
**Usage**: Services (EmailQueueWorker), Edge Functions
**Integration**: Postmark API
**Features**:
- Transactional emails
- Email templates
- Delivery tracking

**Configuration**: network_email_configs table (per network Postmark tokens)

### USPS API (Address Validation)
**Usage**: Network sites (Jamestown)
**Integration**: Direct API calls
**Purpose**: Validate customer addresses during signup

### FlowOps (Provisioning)
**Usage**: Edge Functions, Services
**Integration**: FlowOps API
**Purpose**: Provision internet service, manage subscriptions in ISP management system

**Tables**: Columns with `flowops_` prefix (flowops_subscription_id, flowops_account_id, etc.)

---

## Network Architecture

### Current Networks

**Network 1: Orangeburg Fiber**
- **Schema**: `subscribers`
- **Organization**: orangeburg
- **Account Prefix**: OF-YYYY-XXXXXX
- **Customer Portal**: `network-sites/orangeburg-billing-discounts/`
- **Customers**: ~46 profiles
- **Subscriptions**: ~48 active

**Network 2: Jamestown BPU**
- **Schema**: `jamestown_bpu`
- **Organization**: jamestown_bpu
- **Account Prefix**: JB-YYYY-XXXXXX
- **Customer Portal**: `network-sites/jamestown-billing-discounts/`
- **Customers**: ~14 profiles
- **Subscriptions**: ~8 active

---

## Organizational Structure

### Organizations in Database
```sql
SELECT id, name, organization_slug FROM public.organizations;

-- Results (9 organizations):
-- orangeburg             - Network Operator (Orangeburg Fiber)
-- jamestown_bpu          - Network Operator (Jamestown BPU)
-- meernat                - Service Provider
-- nationalondemand       - Vendor/Partner
-- superusers             - Admin organization
-- ... others
```

### Organization Types
1. **Service Providers**: Sell internet service, own Stripe accounts
2. **Network Operators**: Own fiber infrastructure, charge network fees
3. **Vendors**: Installation companies, sales partners
4. **Superusers**: Platform administrators (cross-network access)

---

## Revenue Flow

```
Customer pays $100/month for internet
    ↓
Stripe collects payment
    ↓ (splits via Stripe Connect)
    ├─→ Service Provider: $100 - network_fee - platform_fee
    ├─→ Network Operator: network_fee (e.g., $10)
    └─→ Platform: platform_fee (e.g., $5)
    ↓
Database tracks:
    - payment_records (full $100 payment)
    - platform_fees table (platform fee amounts)
    - network_fees table (network operator fees)
```

**Tables**:
- `public.products` - Has `network_fee` column ($ per month)
- `public.platform_fees` - Platform fee per network operator
- `public.network_fees` - Network operator fee per product
- `public.payment_records` - All payments recorded

---

## Security Architecture

### Authentication Layer (Clerk)
- **Multi-Organization**: Users can belong to multiple orgs
- **Role-Based**: Roles assigned per organization (admin, sales_management, etc.)
- **JWT Claims**: Organization context passed to Supabase

### Authorization Layer (RLS)
- **Row Level Security**: Every table with sensitive data has RLS enabled
- **Organization Isolation**: RLS policies filter by org_id from JWT
- **Network Isolation**: Network schemas + RLS policies
- **Role-Based Access**: Helper functions check roles (is_admin(), is_sales_manager())

### Data Access Matrix

| User Type | Access Level | RLS Enforcement |
|-----------|-------------|-----------------|
| **Customer** | Own data only | clerk_user_id = JWT.sub |
| **Network Operator** | Own network only | organization_id = JWT.org_id |
| **Service Provider** | Payment records only | organization_id = JWT.org_id |
| **Superuser Admin** | All networks | org_id = 'superusers' OR org_role = 'org:admin' |
| **Sales Rep** | Assigned networks | vendor_network_access table + role check |
| **Service Role** (Python workers) | All data | No RLS (service_role key bypasses) |

---

## Scalability Architecture

### Horizontal Scaling
- **React Apps**: Serverless (Vercel) - auto-scales
- **Python Workers**: Can run multiple instances on Render
- **Database**: Supabase handles scaling
- **Edge Functions**: Serverless - auto-scales

### Vertical Scaling
- **Database**: Supabase plan upgrade
- **Worker Memory**: Render dyno size upgrade

### Multi-Tenancy
- **Schema-Based**: Each network gets own schema
- **Scales to**: 10-20 networks per database (estimate)
- **Beyond 20**: Consider database sharding or separate Supabase instances

---

## Data Consistency Guarantees

### Strong Consistency
- **Within transaction**: ACID guarantees
- **Cross-schema**: Atomic transactions via RPC functions
- **Payment processing**: Two-phase commit (Stripe + database)

### Eventual Consistency
- **Email delivery**: Queued, retried with exponential backoff
- **Address updates**: Batch processed
- **Materialized views**: Refreshed daily

---

## Monitoring & Observability

### Application Monitoring
- **Frontend**: Vercel analytics (not configured)
- **Backend**: Render logs
- **Database**: Supabase dashboard

### Health Checks
- **Services**: FastAPI endpoint `/health` on port 8080
- **Database**: Supabase status page
- **Edge Functions**: Supabase function logs

### Error Tracking
- **Python Workers**: Structlog JSON logs
- **Edge Functions**: `edge_function_logs` table
- **Email Queue**: Dead letter queue (email_queue_dead_letters)
- **Billing Queue**: Dead letter queue (payment_processing_dead_letter_queue)

---

## Disaster Recovery

### Database Backups
- **Supabase**: Automatic daily backups
- **Point-in-Time Recovery**: Available (Supabase Pro plan)

### Application Recovery
- **React Apps**: Redeploy from GitHub (Vercel)
- **Python Services**: Redeploy from GitHub (Render)
- **Edge Functions**: Redeploy via `supabase functions deploy`

### Data Recovery
- **Billing Archive**: `billing_queue_archive` table (permanent record)
- **Payment Records**: Never deleted (audit trail)
- **Email Archive**: `email_queue_jobs` archived after 30 days

---

## Performance Characteristics

### Database Query Performance
- **Simple queries**: < 50ms
- **View queries** (mega views): 100-300ms
- **RPC functions** (single network): < 100ms
- **RPC functions** (multi-network): 200-500ms
- **Materialized view refresh**: 1-5 seconds (billing_revenue_projection_view)

### Application Load Times
- **Network Sites**: 1-2 seconds (first load)
- **Management Portals**: 2-3 seconds (first load)
- **Subsequent navigations**: < 500ms (SPA)

### Worker Processing
- **Email Queue**: ~10 emails/minute
- **Billing Queue**: ~100 subscriptions/minute
- **Payment Processing**: ~50 payments/minute

---

## Cost Structure (Estimated)

### Supabase
- **Plan**: Pro ($25/month)
- **Database**: Included
- **Bandwidth**: ~10 GB/month
- **Edge Functions**: ~1M invocations/month

### Vercel (7 React Apps)
- **Plan**: Hobby (free) or Pro ($20/month per app)
- **Deployments**: Unlimited
- **Bandwidth**: 100 GB/month (Hobby)

### Render (Python Workers)
- **Plan**: Starter ($7/month) or Standard ($25/month)
- **Memory**: 512 MB - 2 GB
- **CPU**: Shared or dedicated

### Clerk
- **Plan**: Pro ($25/month)
- **MAU**: 10,000 monthly active users
- **Organizations**: Unlimited

### Stripe
- **Plan**: Standard (pay per transaction)
- **Fee**: 2.9% + $0.30 per transaction
- **Connect**: Included

### Postmark
- **Plan**: ~$10-15/month
- **Emails**: 10,000/month

**Total Estimated Monthly Cost**: $150-250/month (for current scale)

---

## Future Architecture Considerations

### Scaling to 10+ Networks
**Challenges**:
- UNION ALL views become slow
- Migration management complexity
- RPC functions iterate 10+ schemas

**Solutions**:
1. **Materialized views**: Cache UNION ALL results
2. **Schema templates**: Automated network creation
3. **Sharding**: Separate Supabase instances per region

### Microservices Migration
**Current**: Monolithic Python service
**Future**: Separate workers (email, billing, payments as independent services)

**Benefits**:
- Independent scaling
- Isolated failures
- Easier deployment

### Multi-Region Deployment
**Current**: Single region (US-East)
**Future**: Regional databases + edge caching

---

## Development Workflow

### Local Development
```bash
# Frontend
cd <app-directory>
npm install
npm run dev  # http://localhost:5173

# Backend
cd services-billing-discounts
python -m venv venv
source venv/bin/activate
python main.py

# Database
cd app-support-billing-discounts/supabase
supabase start  # Local Supabase
supabase db reset  # Reset to latest migrations
```

### Testing
```bash
# Frontend
npm run lint  # ESLint
npm run build  # Type check + build

# Backend
pytest tests/  # Python tests

# Database
# Run test queries in SQL editor
```

### Deployment
```bash
# Frontend
git push origin main  # Vercel auto-deploys

# Backend
git push origin main  # Render auto-deploys

# Database
supabase db push  # Manual deployment

# Edge Functions
supabase functions deploy <name>
```

---

## System Limits (Current)

### Database
- **Tables**: ~50 (across all schemas)
- **Rows**: ~60K (mostly available_addresses)
- **Active Users**: ~60 customers
- **Active Subscriptions**: ~56
- **Concurrent Connections**: ~20 (React apps + workers)

### Queue Sizes
- **Email Queue**: ~10-50 pending jobs
- **Billing Queue**: ~0-20 pending jobs (spikes during billing cycle)
- **Address Queue**: ~0-100 pending jobs (during bulk imports)

### File Storage
- **Migrations**: 186 files (~500 KB total)
- **Edge Functions**: 28 functions (~2 MB total)
- **Documentation**: ~50 files (~5 MB total)

---

## Critical System Dependencies

### Must Be Running
1. **Supabase** - Database, Auth, Edge Functions
2. **Clerk** - Authentication (all apps blocked without Clerk)
3. **Stripe** - Payment processing (billing blocked without Stripe)

### Should Be Running
4. **Services (Python)** - Billing and email processing
5. **Postmark** - Email delivery

### Can Tolerate Downtime
6. **FlowOps** - Provisioning (manual fallback)
7. **USPS API** - Address validation (can skip)

---

## System Health Indicators

### Green (Healthy)
- [ ] All React apps accessible
- [ ] Services health check returns 200
- [ ] Billing queue processing (< 10 pending jobs)
- [ ] Email queue processing (< 20 pending jobs)
- [ ] No jobs in dead letter queues
- [ ] Supabase response time < 200ms

### Yellow (Warning)
- [ ] Billing queue > 50 pending jobs
- [ ] Email DLQ > 10 jobs
- [ ] Services health check slow (> 1s)

### Red (Critical)
- [ ] Supabase down
- [ ] Services down (health check fails)
- [ ] Stripe integration failing
- [ ] Billing queue > 200 pending jobs

---

## Documentation Locations

### System Documentation
- **Main**: `/Users/dev007/Sites/projects/billing-discounts/CLAUDE.md` (62 KB)
- **App Support**: `/Users/dev007/Sites/projects/billing-discounts/app-support-billing-discounts/README.md`

### Application Documentation
- **CRM**: `crm-billing-discounts/CLAUDE.md` (14.9 KB)
- **Partner**: `partner-billing-discounts/Claude.md` (3.8 KB)
- **Installer**: `installer-billing-discounts/Claude.md` (3.8 KB)
- **Each app**: Individual README.md files

### Database Documentation
- **RPC Functions**: `app-support-billing-discounts/database/documentation/rpc_functions/`
- **Edge Functions**: `app-support-billing-discounts/database/documentation/edge-functions/`
- **Networks**: `app-support-billing-discounts/database/documentation/networks/`
- **Complete Inventory**: `ProjectDocumentation/DatabaseAnalysis/INVENTORY.md` (51 KB)

---

**Summary**: Meernat is a multi-tenant SaaS platform for fiber ISP management, built on Supabase with schema-based network isolation, serving 2 networks with 8 interconnected applications.
