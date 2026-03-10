---
name: agent-comms
description: "Use the SQLite communication database to send and receive messages between agent teams. Teaches agents how to check inbox, post messages, acknowledge receipts, and coordinate with other teams."
---

# Agent Communication via SQLite

Your team communicates with other teams through a shared SQLite database at `../AgentCommunication/comms.db`. Use the `sqlite3` CLI to interact with it.

## Finding the Database

The comms database is located one level up from your worktree:

```bash
sqlite3 ../AgentCommunication/comms.db
```

## Identifying Yourself

Your team identity is based on your worktree directory name. Look up your team ID:

```bash
sqlite3 ../AgentCommunication/comms.db "SELECT id, name FROM teams WHERE worktree_dir LIKE '%$(basename $(pwd))%';"
```

Store your team ID for use in subsequent queries.

## Core Operations

### Check Your Inbox

View unread messages addressed to your team:

```bash
sqlite3 -header -column ../AgentCommunication/comms.db "
  SELECT id, subject, priority, category, from_team, message, created_at
  FROM unread_messages
  WHERE to_team = '{YourTeamName}' OR to_team IS NULL;
"
```

The `unread_messages` view automatically sorts by priority (CRITICAL first) then by date.

### Acknowledge a Message

After reading and acting on a message:

```bash
sqlite3 ../AgentCommunication/comms.db "
  UPDATE messages SET acknowledged = 1, acknowledged_at = datetime('now')
  WHERE id = {message_id};
"
```

### Post a Message

Send a message to a specific team:

```bash
sqlite3 ../AgentCommunication/comms.db "
  INSERT INTO messages (from_team_id, to_team_id, subject, priority, category, message, metadata)
  VALUES (
    {your_team_id},
    (SELECT id FROM teams WHERE name = '{TargetTeamName}'),
    '{Subject line}',
    '{CRITICAL|HIGH|MEDIUM|LOW}',
    '{category}',
    '{Message body}',
    '{json_metadata_or_null}'
  );
"
```

### Broadcast to All Teams

Send a message to everyone (set `to_team_id` to NULL):

```bash
sqlite3 ../AgentCommunication/comms.db "
  INSERT INTO messages (from_team_id, to_team_id, subject, priority, category, message)
  VALUES (
    {your_team_id},
    NULL,
    '{Subject line}',
    'MEDIUM',
    'announcement',
    '{Message body}'
  );
"
```

### Check Breaking Changes

Always check for breaking changes before starting new work:

```bash
sqlite3 -header -column ../AgentCommunication/comms.db "
  SELECT * FROM breaking_changes WHERE acknowledged = 0;
"
```

## Message Categories

Use the correct category for each message type:

| Category | When to Use | Typical Priority |
|----------|-------------|-----------------|
| `breaking_change` | Your changes break another team's code | CRITICAL |
| `feature_handoff` | Your deliverables are ready for the next team | HIGH |
| `status_update` | Progress report or deployment notice | MEDIUM |
| `question` | Need clarification from another team | MEDIUM |
| `announcement` | General info for all teams | LOW-MEDIUM |
| `dependency` | Declaring or resolving a dependency | HIGH |
| `blocker` | Something is blocking your progress | HIGH-CRITICAL |

## Metadata Templates

Include structured JSON metadata for richer messages:

### Breaking Change
```json
{
  "affected_object": "enqueue_email",
  "old_signature": "p_send_to TEXT",
  "new_signature": "p_context_data JSONB",
  "migration_path": "Rename p_send_to to p_context_data",
  "affected_files": ["BulkEnqueuePage.tsx"]
}
```

### Feature Handoff
```json
{
  "deliverables": ["billing_dashboard_view", "get_dashboard_data RPC"],
  "status": "DEPLOYED",
  "integration_notes": "Call supabase.rpc('get_dashboard_data', {network_id})",
  "rls_note": "Requires admin role"
}
```

### Blocker
```json
{
  "blocked_task": "CRM-003",
  "waiting_on": "DatabaseTeam",
  "waiting_for": "billing_dashboard_view deployment",
  "workaround": "Using mock data temporarily"
}
```

### Question
```json
{
  "context": "Implementing dashboard filters",
  "question": "Should network filtering use schema isolation or WHERE clause?",
  "options": ["Schema isolation (current pattern)", "WHERE clause (simpler)"],
  "needed_by": "Before CRM-004 can start"
}
```

## When to Check Messages

Check your inbox at these points:
1. **Start of session** — Before beginning any work
2. **Before starting a new task** — Check for breaking changes or dependency updates
3. **After completing deliverables** — Post a feature_handoff message
4. **When blocked** — Post a blocker message and check for responses
5. **After receiving a breaking_change** — Acknowledge and assess impact

## Useful Queries

### All messages in a thread
```bash
sqlite3 -header -column ../AgentCommunication/comms.db "
  SELECT m.id, ft.name as from_team, m.subject, m.message, m.created_at
  FROM messages m JOIN teams ft ON m.from_team_id = ft.id
  WHERE m.thread_id = {thread_id}
  ORDER BY m.created_at;
"
```

### Your team's sent messages
```bash
sqlite3 -header -column ../AgentCommunication/comms.db "
  SELECT id, subject, priority, category, created_at
  FROM messages WHERE from_team_id = {your_team_id}
  ORDER BY created_at DESC LIMIT 10;
"
```

### All unacknowledged messages (PM overview)
```bash
sqlite3 -header -column ../AgentCommunication/comms.db "SELECT * FROM unread_messages;"
```
