---
name: github-pr-creator
description: Create comprehensive GitHub Pull Requests documenting completed work. Use this skill when all tasks from an issue are completed and code is ready for review. The skill creates detailed PR descriptions including work summary, implementation status, testing instructions, database changes, commit summary, and deployment notes. Only triggered when work is COMPLETE, not during development.
---

# GitHub PR Creator

Create comprehensive GitHub Pull Requests that document completed work with detailed technical information.

## When to Use This Skill

This skill should be triggered when:
- User explicitly states work is complete
- User requests PR creation
- All checklist items from the related GitHub issue are marked done
- User says "ready for review" or similar phrases
- Code has been committed and pushed to a feature branch

**Key principle:** PRs document COMPLETED work. This skill is used AFTER implementation, not during development.

## PR Rules — Non-Negotiable

1. **No Anthropic signatures** — the PR title, body, and all comments must contain no reference to Claude, AI, or Anthropic. No `🤖 Generated with Claude Code`, no `Co-Authored-By`, no AI attribution of any kind.
2. **No AI attribution** — the PR represents the engineering team's work. Write it as a professional engineer would.
3. **Commits must follow git-commit skill rules** — before creating a PR, verify all commits on the branch follow the `git-commit` skill conventions (no Anthropic signatures in commit messages either).
4. **PR title format** — `<type>(<scope>): <description>` matching commit convention, or a plain descriptive title for multi-concern PRs. Under 72 characters.

## Prerequisites

### 1. GitHub CLI

This skill requires the GitHub CLI (`gh`) to be installed:

```bash
# Check if installed
gh --version

# Install on macOS
brew install gh

# Install on Linux
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Install on Windows
winget install --id GitHub.cli
```

### 2. GitHub Authentication

Authenticate with GitHub CLI:

```bash
gh auth login
```

Follow the prompts to authenticate. The GitHub CLI will handle authentication for the API.

Alternatively, set the `GITHUB_TOKEN` environment variable with a Personal Access Token:

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
```

**Creating a token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Copy token and save it securely

### 3. Repository Context

Either set `GITHUB_REPO` environment variable OR work from within a git repository:

```bash
# Option 1: Set environment variable
export GITHUB_REPO="owner/repo-name"

# Option 2: Work from git repository (auto-detected)
cd /path/to/your/repo
```

### 3. Python Dependencies

Install required package:

```bash
pip install requests --break-system-packages
```

### 4. Git Repository State

Ensure:
- All work is committed
- Feature branch is pushed to remote
- Working directory is clean (no uncommitted changes)
- You're on the feature branch (not main/master)

## Core Workflow

### Step 1: Verify Readiness

Before creating a PR, verify:

```python
from scripts.github_api import GitHubAPI
import subprocess

# Check we're on a feature branch
api = GitHubAPI()
current_branch = api.get_current_branch()

if current_branch in ['main', 'master', 'develop']:
    print("⚠️ Warning: You're on the base branch. Switch to feature branch first.")
    # Exit or prompt user
```

Check for uncommitted changes:

```bash
git status --porcelain
```

If output is not empty, prompt user to commit changes first.

### Step 2: Gather PR Information

Collect all necessary information for the PR:

1. **Work Summary**
   - What was accomplished?
   - What issue does this address?
   
2. **Implementation Status**
   - Was the original plan fully implemented?
   - Were there any deviations from the plan?
   - Any items deferred to future PRs?

3. **Changes Made**
   - Files added/modified/removed
   - Features added/enhanced
   - Bugs fixed

4. **Testing Status**
   - What features are ready for testing?
   - How to test each feature?
   - Test coverage information

5. **Database Changes** (if applicable)
   - Migrations applied
   - Schema impact
   - Rollback plan

6. **Commits**
   - List of all commits in this PR
   - Commit organization (feature/fix/refactor)

### Step 3: Get Commit History

Extract commits that are on feature branch but not on base:

```python
api = GitHubAPI()

# Get current branch and commits
feature_branch = api.get_current_branch()
base_branch = "main"  # or detect from repo default

commits = api.get_commits_on_branch(feature_branch, base_branch)

print(f"Found {len(commits)} commits:")
for commit in commits:
    print(f"  {commit['sha'][:7]} - {commit['message']}")
```

### Step 4: Generate PR Body

Read the template from `references/pr_template.md`:

```python
with open('references/pr_template.md', 'r') as f:
    template_content = f.read()
```

Create a comprehensive PR body following the template structure. Key sections to include:

- **Summary**: High-level overview with issue reference
- **Changes Made**: Detailed list of additions/modifications/fixes
- **Implementation Status**: Full/partial implementation, plan adherence
- **Testing & Validation**: Ready-for-testing features with instructions
- **Database Changes**: Migrations, schema impact, rollback plan
- **Technical Details**: Architecture changes, dependencies, env vars
- **Commits Summary**: Organized list of all commits
- **Breaking Changes**: Any breaking changes (if applicable)
- **Security Considerations**: Security review checklist
- **Deployment Notes**: Pre/post deployment steps
- **Reviewer Notes**: Focus areas and testing instructions

### Step 5: Create the Pull Request

```python
from scripts.github_api import GitHubAPI

api = GitHubAPI()

title = "Feature: Add user password reset flow"
body = """
## 📝 Summary

[Your comprehensive PR description following the template]
...
"""

# Get current feature branch
head_branch = api.get_current_branch()
base_branch = "main"  # or your default branch

pr = api.create_pull_request(
    title=title,
    body=body,
    head=head_branch,
    base=base_branch,
    draft=False  # Set to True if creating as draft
)

print(f"✅ Created PR #{pr['number']}: {pr['html_url']}")
```

### Step 6: Link to Related Issue

If this PR closes an issue, include in the PR body:

```markdown
**Related Issue:** Closes #234
```

GitHub will automatically link and close the issue when the PR is merged.

### Step 7: Inform the User

After creating the PR:
1. Provide the PR number and URL
2. Summarize what was documented
3. Remind about next steps (request reviews, CI checks)

Example output:
```
✅ Created PR #456: Feature: Add user password reset flow
   https://github.com/owner/repo/pull/456

Documented:
- 12 commits across 4 phases
- Database migration: password_reset_tokens table
- 2 new API endpoints, 2 new UI pages
- Comprehensive testing instructions
- Links to issue #234

Next steps:
- Request reviews from team members
- Wait for CI checks to pass
- Address any review feedback
```

## Implementation Status Documentation

### Fully Implemented

When original plan was completely implemented:

```markdown
## 🎯 Implementation Status

**Plan Adherence:** ✅ Fully Implemented

### Completed Items
- [x] All items from original implementation plan (issue #234)
- [x] Additional improvements discovered during development
  - Email template testing across clients
  - Rate limiting to prevent abuse
```

### Partially Implemented

When some items were deferred:

```markdown
## 🎯 Implementation Status

**Plan Adherence:** ⚠️ Partially Implemented

### Completed Items
- [x] Basic password reset flow
- [x] Email integration
- [x] Frontend UI components
- [x] Database migrations

### Deferred Items
The following items have been deferred to a future PR:

- [ ] Advanced rate limiting with Redis
  - **Reason:** Requires Redis infrastructure setup
  - **Tracked in:** #567

- [ ] Multi-factor authentication for reset
  - **Reason:** Awaiting security review
  - **Tracked in:** #568
```

### Modified from Original Plan

When implementation differed from original plan:

```markdown
## 🎯 Implementation Status

**Plan Adherence:** 🔄 Modified from Original Plan

**Original Approach:**
Use JWT tokens for password reset links

**Actual Implementation:**
Used database-backed tokens with UUID identifiers

**Reasoning:**
- Simpler revocation mechanism (delete from database)
- Better auditability (track token usage)
- No secret key rotation concerns
- More flexible expiration handling
```

## Testing Instructions Format

For each feature ready for testing, provide:

```markdown
### Ready for Testing

- [ ] **Password Reset Request Flow**
  - Description: Users can request password reset from login page
  - How to test:
    1. Navigate to http://localhost:3000/login
    2. Click "Forgot Password?" link
    3. Enter: test@example.com
    4. Submit form
    5. Check email inbox (or console logs in dev)
  - Expected behavior: 
    - Success message appears
    - Email received within 30 seconds
    - Email contains reset link with 6-hour validity

- [ ] **Password Reset Confirmation**
  - Description: Users can set new password via email link
  - How to test:
    1. Click reset link from email
    2. Should redirect to /reset-password?token=xxx
    3. Enter new password: TestPass123!
    4. Confirm password: TestPass123!
    5. Submit form
    6. Try logging in with new credentials
  - Expected behavior:
    - Password updated successfully
    - Redirect to login page
    - Can log in with new password
    - Old password no longer works
```

## Database Changes Documentation

Document all database changes made in this PR:

```markdown
## 🗄️ Database Changes

### Migrations Applied

\`\`\`sql
-- Migration: 20250115143000_add_password_reset.sql
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
CREATE INDEX idx_reset_tokens_expires ON password_reset_tokens(expires_at);
\`\`\`

### Schema Impact
- **New Tables:** `password_reset_tokens`
- **Modified Tables:** None
- **New Indexes:** 3 indexes on password_reset_tokens
- **New Functions:** `cleanup_expired_tokens()` (cron job)

### Data Migration
- **Required:** No (new table, no existing data to migrate)
- **Backward Compatible:** Yes (additive only, no breaking changes)
- **Rollback Plan:** 
  \`\`\`sql
  DROP TABLE password_reset_tokens CASCADE;
  \`\`\`

### Supabase-Specific Changes
- [x] Row Level Security (RLS) policies added
  - Users can only SELECT their own tokens
  - Service role can manage all tokens
- [x] Database function created: `cleanup_expired_tokens()`
  - Runs daily via pg_cron
  - Deletes tokens older than 7 days
- [x] Type definitions updated in `types/database.ts`
- [x] API auto-generated endpoints reviewed (no issues)
```

## Commit Organization

Organize commits by type for clarity:

```markdown
## 📦 Commits Summary

This PR includes **12** commits from branch `feature/password-reset` into `main`:

### Feature Commits (7)
- `a1b2c3d` - Add password_reset_tokens table migration
- `e4f5g6h` - Implement token generation and validation utilities
- `i7j8k9l` - Create reset-password-request API endpoint
- `m0n1o2p` - Create reset-password-confirm API endpoint
- `q3r4s5t` - Add forgot password UI page
- `u6v7w8x` - Add password reset confirmation page
- `y9z0a1b` - Integrate SendGrid email service

### Fix Commits (2)
- `c2d3e4f` - Fix email template rendering on Outlook
- `g5h6i7j` - Fix token expiration timezone handling

### Test Commits (2)
- `k8l9m0n` - Add unit tests for token utilities (23 tests)
- `o1p2q3r` - Add integration tests for complete reset flow (5 tests)

### Documentation Commit (1)
- `s4t5u6v` - Update README with password reset documentation
```

## Breaking Changes

If there are breaking changes, document them clearly:

```markdown
## ⚠️ Breaking Changes

### API Changes

**Endpoint Modified:** `POST /api/auth/login`
- **Change:** Now returns `user` object with `email_verified` field
- **Before:** 
  \`\`\`json
  { "token": "...", "user": { "id": "...", "email": "..." } }
  \`\`\`
- **After:**
  \`\`\`json
  { "token": "...", "user": { "id": "...", "email": "...", "email_verified": true } }
  \`\`\`
- **Migration:** Update frontend to handle new field (backward compatible - field can be ignored)
- **Timeline:** Immediate (no deprecation period needed due to backward compatibility)

### Environment Variables

**New Required Variable:** `SENDGRID_API_KEY`
- **Impact:** Application will fail to start without this variable
- **Migration:** Add to .env files before deploying
- **Documentation:** Updated in README.md
```

## Security Review Checklist

Always include a security checklist:

```markdown
## 🔒 Security Considerations

- [x] No sensitive data exposed in logs (tokens are hashed in logs)
- [x] Input validation implemented (email format, password strength)
- [x] Authentication/Authorization checked (users can only reset own password)
- [x] SQL injection prevented (using parameterized queries)
- [x] XSS vulnerabilities addressed (email input sanitized)
- [x] CSRF protection maintained (existing middleware)
- [x] Rate limiting implemented (5 requests/hour per email)
- [x] Secrets properly managed (SendGrid key in environment variables)
- [x] Tokens cryptographically secure (crypto.randomBytes(32))
- [x] Tokens time-limited (6-hour expiration)
- [x] Tokens single-use (marked as used after consumption)
- [x] Password strength requirements enforced (min 8 chars, uppercase, number)

**Security Review:**
Password reset tokens use cryptographically secure random generation with 32 bytes of entropy. Rate limiting prevents brute force attacks. Email validation prevents user enumeration attacks by returning the same success message for both valid and invalid emails.
```

## Deployment Notes

Provide clear deployment instructions:

```markdown
## 🚀 Deployment Notes

### Pre-Deployment Checklist
1. [ ] Add `SENDGRID_API_KEY` to production environment variables
2. [ ] Add `PASSWORD_RESET_URL` to production environment variables  
3. [ ] Verify SendGrid domain authentication for production domain
4. [ ] Review and approve database migration
5. [ ] Notify team of brief downtime (if applicable)

### Deployment Steps
1. **Database Migration** (Run first)
   \`\`\`bash
   supabase migration up --environment production
   \`\`\`
   
2. **Backend Deployment**
   - Deploy API endpoints
   - Verify endpoints are accessible
   
3. **Frontend Deployment**
   - Deploy UI changes
   - Clear CDN cache if applicable

### Post-Deployment Verification
1. [ ] Verify migration applied successfully
   \`\`\`sql
   SELECT * FROM password_reset_tokens LIMIT 1;
   \`\`\`
2. [ ] Test password reset flow end-to-end in production
3. [ ] Monitor error logs for 1 hour
4. [ ] Check email delivery success rate in SendGrid dashboard
5. [ ] Verify rate limiting is working (test >5 requests)

### Rollback Plan
If issues are detected:

1. **Revert Application Code**
   \`\`\`bash
   git revert HEAD
   git push origin main
   \`\`\`

2. **Rollback Database** (if necessary)
   \`\`\`bash
   supabase migration down --environment production
   \`\`\`

3. **Remove Environment Variables**
   - Remove `SENDGRID_API_KEY`
   - Remove `PASSWORD_RESET_URL`

### Monitoring
**Metrics to Watch (first 24 hours):**
- Password reset request rate (expect spike initially)
- Email delivery success rate (should be >95%)
- Token expiration rate
- Failed reset attempts
- API error rates on new endpoints

**Alerts to Configure:**
- Email delivery failure >5%
- Reset request spike >100/minute (potential abuse)
- API error rate >1% on new endpoints
- Database query time >200ms on token lookups
```

## Tips for Quality PRs

1. **Link Issues**: Always reference related issue(s)
2. **Be Comprehensive**: Include all relevant information
3. **Provide Context**: Explain the "why" behind decisions
4. **Test Instructions**: Make it easy for reviewers to test
5. **Visual Evidence**: Include screenshots/videos when helpful
6. **Breaking Changes**: Highlight and explain clearly
7. **Deployment Plan**: Think through the deployment process
8. **Security First**: Complete security checklist
9. **Review Yourself**: Read the PR as if you were the reviewer
10. **Keep It Focused**: One logical change per PR (split if needed)

## Troubleshooting

### Creating PR from Main Branch
```
Error: Cannot create PR from main/master branch
```
**Solution:** Create and switch to a feature branch first

### No Commits to Create PR
```
Error: No commits between branches
```
**Solution:** Ensure commits are pushed and branches are different

### Authentication Errors
```
Error: GitHub token required
```
**Solution:** Set `GITHUB_TOKEN` environment variable

### Permission Denied
```
Error: 403 Forbidden
```
**Solution:** Verify token has `repo` scope permissions

## Resources

- `references/pr_template.md` - Complete PR template with examples
- `scripts/github_api.py` - GitHub API client library
