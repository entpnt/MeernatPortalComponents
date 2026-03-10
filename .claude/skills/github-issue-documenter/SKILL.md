---
name: github-issue-documenter
description: Automatically create or update GitHub issues to document planned development work. Use this skill when the user discusses a plan to address an issue, add a new feature, or make architectural changes. The skill creates comprehensive issue documentation including problem statement, methodology, architecture, database schema changes, and detailed implementation plan. Always triggered when planning work, before implementation begins.
---

# GitHub Issue Documenter

Automatically create or update GitHub issues to document planned development work with comprehensive technical details.

## When to Use This Skill

This skill should be triggered automatically when:
- User discusses or requests a plan for addressing an issue
- User wants to add a new feature
- User plans architectural changes or refactoring
- User mentions fixing a bug and wants to document the approach
- User references an existing GitHub issue number and wants to update it

**Key principle:** Documentation happens BEFORE implementation. This skill creates the roadmap; implementation follows.

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

## Core Workflow

### Step 1: Analyze the Request

When the user describes work to be done, analyze:
- Is this a new issue or an update to an existing one?
- What is the core problem being addressed?
- What solution approach is being proposed?
- What are the technical components involved?
- What database changes are needed (if any)?

### Step 2: Check for Existing Issue

If the user mentions an issue number (e.g., "for issue #123"), check if it exists:

```python
from scripts.github_api import GitHubAPI

api = GitHubAPI()
issue = api.get_issue(123)

if issue:
    print(f"Existing issue found: {issue['title']}")
    # Proceed with update
else:
    print("Issue not found, will create new one")
```

You can also search for issues by keyword:

```python
issues = api.search_issues("password reset", state="open")
for issue in issues:
    print(f"#{issue['number']}: {issue['title']}")
```

### Step 3: Gather Information

Before creating/updating the issue, ensure you have:

1. **Problem Statement**
   - What problem is being solved?
   - Why does it matter?
   - What's the impact if not addressed?

2. **Proposed Solution**
   - High-level approach
   - Key components
   - Dependencies

3. **Architecture Details**
   - Design patterns
   - Technology stack
   - Component interactions
   - API design (if applicable)

4. **Database Schema** (if applicable)
   - Current schema (tables being modified)
   - Proposed changes (new tables, alterations)
   - Migration strategy
   - Data impact

5. **Implementation Plan**
   - Broken down into phases
   - Each phase has specific tasks
   - Tasks have checkboxes for tracking
   - Include testing and documentation tasks

6. **Acceptance Criteria**
   - What defines "done"
   - Quality requirements
   - Performance benchmarks

### Step 4: Generate Issue Body

Read the template from `references/issue_template.md` to structure the issue body:

```python
with open('references/issue_template.md', 'r') as f:
    template_content = f.read()
```

Create a comprehensive issue body following the template structure. Include all relevant sections, omitting only those that truly don't apply.

### Step 5: Create or Update Issue

**Creating a new issue:**

```python
from scripts.github_api import GitHubAPI

api = GitHubAPI()

title = "[Feature]: Add user password reset flow"
body = """
## 🎯 Problem Statement
[Your comprehensive issue description following the template]
...
"""

# Optional: Add labels, assignees
labels = ["enhancement", "backend", "frontend"]
assignees = ["username"]

issue = api.create_issue(
    title=title,
    body=body,
    labels=labels,
    assignees=assignees
)

print(f"✅ Created issue #{issue['number']}: {issue['html_url']}")
```

**Updating an existing issue:**

```python
issue = api.update_issue(
    issue_number=123,
    body=updated_body  # Keep title unless specifically changing it
)

print(f"✅ Updated issue #{issue['number']}: {issue['html_url']}")
```

### Step 6: Inform the User

After creating/updating the issue:
1. Provide the issue number and URL
2. Summarize what was documented
3. Confirm that the plan is ready for implementation

Example output:
```
✅ Created issue #234: Add user password reset flow
   https://github.com/owner/repo/issues/234

Documented:
- Problem: Users cannot reset passwords (15% of support tickets)
- Solution: Email-based token reset flow
- Database: New password_reset_tokens table
- Plan: 4 phases with 18 tasks

Ready to begin implementation!
```

## Database Schema Documentation

For Supabase projects, document schema changes thoroughly:

### Current Schema
Show existing tables/columns that will be affected:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Proposed Changes
Show only the changes (new tables, alterations):

```sql
-- New table
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- New indexes
CREATE INDEX idx_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_reset_tokens_token ON password_reset_tokens(token);
```

### Migration Strategy
Document how changes will be applied:
- Migration file naming convention
- Testing approach
- Rollback procedure
- Type definition updates

### Supabase-Specific Considerations
- Row Level Security (RLS) policies
- Database functions/triggers
- API auto-generation impact
- Realtime subscription implications

## Implementation Plan Structure

Break work into clear phases with checkboxes:

```markdown
### Phase 1: Foundation
- [ ] Create database migration file
- [ ] Design API endpoints
  - [ ] Define request/response schemas
  - [ ] Document error cases
- [ ] Set up environment variables

### Phase 2: Backend Implementation
- [ ] Implement password reset request endpoint
  - [ ] Email validation
  - [ ] Token generation
  - [ ] Email sending
- [ ] Implement password reset confirm endpoint
  - [ ] Token validation
  - [ ] Password strength check
  - [ ] Update user password

### Phase 3: Frontend Implementation
- [ ] Create forgot password page
- [ ] Create reset password confirmation page
- [ ] Add loading states
- [ ] Add error handling

### Phase 4: Testing & Documentation
- [ ] Write unit tests (target: 80% coverage)
- [ ] Write integration tests
- [ ] Manual testing checklist
- [ ] Update README
- [ ] Update API documentation
```

## Labels and Organization

Suggested labels to use:
- `feature` - New functionality
- `bug` - Bug fixes
- `enhancement` - Improvements to existing features
- `documentation` - Documentation updates
- `infrastructure` - DevOps, deployment, configuration
- `frontend` - Frontend changes
- `backend` - Backend changes
- `database` - Database schema changes
- `security` - Security-related changes
- `performance` - Performance improvements

Apply labels that match the work being documented.

## Tips for Quality Documentation

1. **Be Specific**: Vague descriptions lead to scope creep
2. **Include Context**: Explain WHY, not just WHAT
3. **Break Down Tasks**: No task should take more than 4 hours
4. **Define Success**: Clear acceptance criteria prevent confusion
5. **Link Resources**: Reference designs, docs, similar implementations
6. **Consider Edge Cases**: Document error scenarios, edge cases
7. **Think About Data**: Always consider impact on existing data
8. **Security First**: Include security considerations in the plan
9. **Plan for Testing**: Testing is part of implementation, not an afterthought
10. **Document Assumptions**: Make implicit assumptions explicit

## Handling Updates

When updating an existing issue:

1. **Preserve Original Context**: Don't delete the original problem statement
2. **Add Updates Section**: Use a timestamp or "Update: [date]" heading
3. **Mark Completed Tasks**: Check off boxes as work progresses
4. **Document Changes**: If the plan changes, document why
5. **Link Related Issues**: Reference other issues or PRs as they're created

Example update structure:
```markdown
## Updates

### Update: 2025-01-15
After further analysis, we're splitting this into two phases:
- Phase 1 (this issue): Basic email reset flow
- Phase 2 (#235): Advanced features (rate limiting, account recovery)

Updated implementation plan below reflects Phase 1 scope only.
```

## Troubleshooting

### Authentication Errors
```
Error: GitHub token required
```
**Solution:** Set `GITHUB_TOKEN` environment variable

### Repository Not Found
```
Error: Repository required
```
**Solution:** Set `GITHUB_REPO` or run from within a git repository

### API Rate Limiting
```
Error: API rate limit exceeded
```
**Solution:** Wait for rate limit to reset or use authenticated requests (higher rate limit)

### Permission Denied
```
Error: 403 Forbidden
```
**Solution:** Verify token has `repo` scope permissions

## Resources

- `references/issue_template.md` - Complete issue template with examples
- `scripts/github_api.py` - GitHub API client library
