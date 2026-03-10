# Issue Documentation Template

Use this template when creating or updating GitHub issues to document planned work.

## Issue Title Format

```
[Feature/Fix/Enhancement]: Brief description of the work
```

Examples:
- `Feature: Add user authentication system`
- `Fix: Resolve database connection timeout`
- `Enhancement: Improve dashboard performance`

## Issue Body Structure

### 1. Problem Statement

Clear, concise description of what needs to be addressed.

**Format:**
```markdown
## 🎯 Problem Statement

[Describe the problem, need, or opportunity that this work addresses]

**Context:**
- [Relevant background information]
- [Why this matters]
- [Impact if not addressed]
```

### 2. Proposed Solution / Methodology

How the problem will be solved.

**Format:**
```markdown
## 💡 Proposed Solution

**Approach:**
[High-level description of the solution approach]

**Key Components:**
- [Component 1]
- [Component 2]
- [Component 3]

**Dependencies:**
- [External dependencies]
- [Related issues/PRs]
```

### 3. Technical Architecture

Detailed technical design and architecture decisions.

**Format:**
```markdown
## 🏗️ Architecture

**Design Pattern:**
[Description of architectural pattern being used]

**Components & Interactions:**
```mermaid
[Optional: Include a mermaid diagram if complex]
```

**Technology Stack:**
- Frontend: [Technologies]
- Backend: [Technologies]
- Database: [Technologies]
- Infrastructure: [Technologies]

**API Design:**
[If applicable, describe API endpoints, methods, request/response formats]

**State Management:**
[How state/data flow will be managed]
```

### 4. Database Schema Changes

Document current and proposed Supabase database structure.

**Format:**
```markdown
## 🗄️ Database Schema

### Current Schema
\`\`\`sql
-- Existing tables and columns affected by this work
CREATE TABLE existing_table (
  id UUID PRIMARY KEY,
  -- current columns
);
\`\`\`

### Proposed Changes
\`\`\`sql
-- New tables
CREATE TABLE new_table (
  id UUID PRIMARY KEY,
  -- new columns
);

-- Modified tables (show only changes)
ALTER TABLE existing_table
  ADD COLUMN new_column TEXT,
  ADD CONSTRAINT fk_constraint FOREIGN KEY (column) REFERENCES other_table(id);
\`\`\`

### Migration Strategy
- [ ] Create migration file: `YYYYMMDDHHMMSS_description.sql`
- [ ] Test migration on development database
- [ ] Document rollback procedure
- [ ] Update type definitions

### Data Impact
- **Existing Data:** [How existing data will be handled]
- **Migrations Required:** [Yes/No - describe if yes]
- **Backward Compatibility:** [Yes/No - explain]
```

### 5. Implementation Plan

Detailed breakdown of tasks with checkboxes for tracking.

**Format:**
```markdown
## 📋 Implementation Plan

### Phase 1: Foundation
- [ ] Task 1: Description
  - [ ] Subtask 1.1
  - [ ] Subtask 1.2
- [ ] Task 2: Description
- [ ] Task 3: Description

### Phase 2: Core Implementation
- [ ] Task 1: Description
- [ ] Task 2: Description
- [ ] Task 3: Description

### Phase 3: Testing & Refinement
- [ ] Unit tests for [component]
- [ ] Integration tests for [workflow]
- [ ] Manual testing checklist
- [ ] Performance testing
- [ ] Security review

### Phase 4: Documentation & Deployment
- [ ] Update README
- [ ] Add code comments
- [ ] Update API documentation
- [ ] Create user guide (if applicable)
- [ ] Deploy to staging
- [ ] Deploy to production

**Estimated Effort:** [Time estimate]
**Priority:** [High/Medium/Low]
**Blockers:** [List any blockers or dependencies]
```

### 6. Acceptance Criteria

Define what "done" looks like.

**Format:**
```markdown
## ✅ Acceptance Criteria

- [ ] All implementation tasks completed
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] No new console errors or warnings
- [ ] Performance benchmarks met
- [ ] Security requirements satisfied
- [ ] Accessibility standards met (if applicable)
- [ ] Works on all supported browsers/devices
- [ ] Successfully deployed to production
```

### 7. Additional Context

Any supplementary information.

**Format:**
```markdown
## 📎 Additional Context

**References:**
- [Link to design docs]
- [Link to research]
- [Link to similar implementations]

**Screenshots/Mockups:**
[If applicable, include visual references]

**Related Issues:**
- Closes #123
- Related to #456
- Blocks #789

**Notes:**
[Any other relevant information]
```

## Complete Example

```markdown
## 🎯 Problem Statement

Users cannot currently reset their passwords if they forget them, leading to support tickets and poor user experience.

**Context:**
- 15% of support tickets are password reset requests
- Current workaround requires manual admin intervention
- Industry standard is self-service password reset

## 💡 Proposed Solution

**Approach:**
Implement a secure password reset flow using email verification tokens with time-based expiration.

**Key Components:**
- Password reset request endpoint
- Email service integration for sending reset links
- Token generation and validation system
- Password update endpoint with security checks

**Dependencies:**
- Supabase Auth functions
- SendGrid email service
- Frontend form components

## 🏗️ Architecture

**Design Pattern:**
Stateless token-based authentication with email verification

**Technology Stack:**
- Frontend: React, React Hook Form, Zod validation
- Backend: Supabase Edge Functions
- Database: Supabase PostgreSQL
- Email: SendGrid API

**API Design:**
- `POST /api/auth/reset-password-request` - Initiates reset
- `POST /api/auth/reset-password-confirm` - Completes reset

## 🗄️ Database Schema

### Current Schema
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Proposed Changes
\`\`\`sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_reset_tokens_token ON password_reset_tokens(token);
\`\`\`

### Migration Strategy
- [ ] Create migration file: `20250115000000_add_password_reset.sql`
- [ ] Test migration on development database
- [ ] Document rollback procedure

### Data Impact
- **Existing Data:** No impact to existing user records
- **Migrations Required:** Yes - creates new table
- **Backward Compatibility:** Yes - additive only

## 📋 Implementation Plan

### Phase 1: Database & Backend
- [ ] Create password_reset_tokens table migration
- [ ] Implement token generation utility
- [ ] Create reset-password-request endpoint
  - [ ] Email validation
  - [ ] Token generation (6-hour expiry)
  - [ ] Email sending
- [ ] Create reset-password-confirm endpoint
  - [ ] Token validation
  - [ ] Password strength check
  - [ ] Password hash update

### Phase 2: Frontend
- [ ] Create "Forgot Password" link on login page
- [ ] Build password reset request form
- [ ] Build password reset confirmation form
- [ ] Add success/error messaging
- [ ] Add loading states

### Phase 3: Testing
- [ ] Unit tests for token generation
- [ ] Unit tests for validation logic
- [ ] Integration test: Full reset flow
- [ ] Test token expiration
- [ ] Test used token rejection
- [ ] Security testing (rate limiting, injection)

### Phase 4: Deployment
- [ ] Update environment variables (SendGrid key)
- [ ] Deploy to staging
- [ ] Manual QA on staging
- [ ] Deploy to production
- [ ] Monitor error logs

**Estimated Effort:** 2-3 days
**Priority:** High

## ✅ Acceptance Criteria

- [ ] Users can request password reset via email
- [ ] Reset emails sent within 30 seconds
- [ ] Reset links expire after 6 hours
- [ ] Used tokens cannot be reused
- [ ] New password meets strength requirements
- [ ] All tests passing
- [ ] No security vulnerabilities
- [ ] Error messages are user-friendly

## 📎 Additional Context

**References:**
- OWASP Password Reset Best Practices
- Supabase Auth documentation

**Related Issues:**
- Related to #234 (Email service integration)
```
