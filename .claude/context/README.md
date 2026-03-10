# Claude Context Files - Billing Discounts System

**Last Updated**: 2025-12-03
**Total Context Files**: 8
**Total Size**: ~200 KB of reference documentation

---

## Purpose

These context files provide comprehensive reference documentation for Claude agents working on the Billing Discounts system. They are automatically loaded at different phases of work to provide relevant context without needing to search the codebase.

---

## Loading Strategy

### Always Load (Base Context)

These files are loaded for EVERY conversation to provide essential reference:

1. **`database-architecture.md`** (20 KB)
   - Schema structure (public, subscribers, jamestown_bpu)
   - Table relationships and foreign keys
   - Cross-schema reference patterns
   - Data types and conventions
   - Index strategies
   - RLS policy patterns

2. **`multi-network-structure.md`** (29 KB)
   - Multi-network architecture explained
   - Schema isolation strategy
   - Network configuration patterns
   - Cross-network aggregation
   - Billing across networks
   - Network site environment config

3. **`supabase-standards.md`** (23 KB)
   - Migration file standards
   - Table creation templates
   - RPC function templates
   - View creation standards
   - Trigger patterns
   - Testing standards
   - Deployment procedures

**When Loaded**: Every conversation
**Purpose**: Core architectural knowledge

---

### Load During Planning

These files provide high-level architecture for planning cross-app features:

4. **`application-family.md`** (21 KB)
   - All 8 applications overview
   - Application groups (Network Sites, Management Portals, etc.)
   - Shared Core Framework explained
   - Tech stack matrix
   - Application roles & permissions
   - Database access patterns
   - File locations reference

5. **`meernat-architecture.md`** (23 KB)
   - Overall system architecture
   - Business model (service providers, network operators)
   - System diagram
   - Data flow patterns (signup, billing, installation)
   - Authentication flow (Clerk → Supabase)
   - External service integrations
   - Scalability considerations
   - System health indicators

**When Loaded**: During planning phase (before implementation)
**Purpose**: Understand system-wide impact of features

---

### Load During Implementation

These files provide detailed implementation examples for writing code:

6. **`migration-patterns.md`** (34 KB)
   - Complete migration file examples (copy-paste ready)
   - Billing queue table creation (actual code)
   - RPC function creation (actual code)
   - View creation (actual code)
   - Trigger creation (actual code)
   - Network schema template
   - Column addition pattern (with backfill)
   - Materialized view pattern

7. **`rls-best-practices.md`** (24 KB)
   - JWT claim access patterns
   - RLS helper functions (is_admin, etc.)
   - 10 real RLS policy patterns
   - User owns data pattern
   - Organization-based access
   - Role-based access
   - Vendor network access
   - Testing RLS policies
   - Debugging techniques

8. **`rpc-examples.md`** (33 KB)
   - 10 complete RPC function examples
   - Simple query function
   - Insert with validation
   - Update operation (atomic)
   - Complex calculation function
   - Multi-schema dynamic SQL
   - Account setup (multi-insert)
   - Toggle function (upsert)
   - Batch operations
   - Worker queue fetch (row locking)
   - Eligibility check function

**When Loaded**: During implementation phase (writing code)
**Purpose**: Copy-paste patterns for common operations

---

## How to Use

### For Planning Agents
**Load**:
- Always load files (base context)
- application-family.md (app overview)
- meernat-architecture.md (system architecture)

**Use For**:
- Understanding which apps are affected by a feature
- Determining database schema changes needed
- Estimating effort across applications
- Identifying integration points

---

### For Database Agents
**Load**:
- Always load files (base context)
- migration-patterns.md (implementation examples)
- rls-best-practices.md (security patterns)
- rpc-examples.md (function examples)

**Use For**:
- Writing migration files (copy templates)
- Creating RPC functions (copy examples)
- Implementing RLS policies (copy patterns)
- Testing database changes

---

### For Backend Agents (Python)
**Load**:
- Always load files (base context)
- application-family.md (understand Services app)
- rpc-examples.md (how to call RPCs from Python)

**Use For**:
- Integrating with RPC functions
- Understanding worker patterns
- Calling Supabase from Python

---

### For Frontend Agents (React)
**Load**:
- Always load files (base context)
- application-family.md (understand app architecture)
- rpc-examples.md (how to call RPCs from React)

**Use For**:
- Understanding shared core framework
- Calling RPC functions from React
- Network configuration patterns
- Component patterns

---

## Additional References

### Complete SQL Inventory
**File**: `ProjectDocumentation/DatabaseAnalysis/INVENTORY.md` (51 KB, 1,959 lines)
**Contents**:
- Complete SQL code for 50+ RPC functions
- Complete SQL code for all views
- Tables accessed by each function
- Usage examples
- Key features and patterns

**When to Reference**: When you need to see exact implementation of existing functions

---

### Overall System Documentation
**File**: `/Users/dev007/Sites/projects/billing-discounts/CLAUDE.md` (62 KB)
**Contents**:
- Comprehensive system overview
- All 8 applications detailed
- Database architecture
- Authentication flow
- Common patterns & code examples
- Development workflows

**When to Reference**: For comprehensive system understanding

---

### Promotions Feature Documentation
**Directory**: `ProjectDocumentation/`
**Contents**:
- Overall PRD (48 KB system architecture)
- 7 application-specific PRDs
- Task breakdowns by agent
- Agent communication logs
- Analysis files (family, database, impact)

**When to Reference**: For promotions feature implementation

---

## File Sizes Summary

```
Context Files (8 total):
├── database-architecture.md        20 KB  ✅ Always load
├── multi-network-structure.md      29 KB  ✅ Always load
├── supabase-standards.md           23 KB  ✅ Always load
├── application-family.md           21 KB  📋 Planning phase
├── meernat-architecture.md         23 KB  📋 Planning phase
├── migration-patterns.md           34 KB  🔨 Implementation phase
├── rls-best-practices.md           24 KB  🔨 Implementation phase
└── rpc-examples.md                 33 KB  🔨 Implementation phase

Total: ~200 KB of reference documentation
```

---

## Key Benefits

✅ **No Codebase Search Needed**: All patterns documented and ready to use
✅ **Copy-Paste Ready**: Real code examples from production migrations
✅ **Consistent Patterns**: Follow established conventions
✅ **Complete SQL**: Full implementations, not just snippets
✅ **Testing Examples**: How to test each pattern
✅ **Security Included**: RLS policies with every pattern
✅ **Multi-Network Aware**: All examples handle network isolation

---

## Quick Reference Guide

**Need to...**

**Understand database structure?**
→ Read `.claude/context/database-architecture.md`

**Understand multi-network isolation?**
→ Read `.claude/context/multi-network-structure.md`

**Create a migration?**
→ Copy template from `.claude/context/migration-patterns.md`

**Create an RPC function?**
→ Copy example from `.claude/context/rpc-examples.md`

**Add RLS policies?**
→ Copy pattern from `.claude/context/rls-best-practices.md`

**Understand application architecture?**
→ Read `.claude/context/application-family.md`

**See complete SQL for existing RPC?**
→ Search `ProjectDocumentation/DatabaseAnalysis/INVENTORY.md`

---

## Maintenance

### When to Update

**Update context files when**:
- Major architectural changes
- New patterns established
- New applications added
- New networks added
- Standards changed

**Update INVENTORY.md when**:
- New RPC functions added
- New views created
- Major database changes

### Validation

**Quarterly**: Review context files for accuracy
**After Major Changes**: Update affected context files
**Before Release**: Verify all examples still work

---

**Status**: ✅ All context files complete and ready for use by Claude agents
