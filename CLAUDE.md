# DesignSystemTeam

## Tech Stack
React, TypeScript, Storybook

## Responsibility
Meernat Design Framework — shared design system and component library

## Key Paths
- PRDs: ../ProjectDocumentation/PRDs/Applications/DesignSystemTeam/
- TDD: ../ProjectDocumentation/TechnicalDesignDocuments/DesignSystemTeam/
- Tasks: ../ProjectDocumentation/Tasks/DesignSystemTeam/
- Agent Plans: ../ProjectDocumentation/AgentPlans/DesignSystemTeam/
- Comms DB: ../AgentCommunication/comms.db

## Communication

This team uses SQLite for inter-team communication. Use the `agent-comms` skill to check your inbox, post messages, and coordinate with other teams.

### Quick Reference
```bash
# Check inbox
sqlite3 ../AgentCommunication/comms.db "SELECT * FROM unread_messages WHERE to_team = 'DesignSystemTeam' OR to_team IS NULL;"

# Acknowledge a message
sqlite3 ../AgentCommunication/comms.db "UPDATE messages SET acknowledged = 1, acknowledged_at = datetime('now') WHERE id = {message_id};"

# Check for breaking changes
sqlite3 ../AgentCommunication/comms.db "SELECT * FROM breaking_changes WHERE acknowledged = 0;"
```

## Workflow
1. Check inbox for PRD assignments and breaking changes
2. Review `.claude/RULES.md` for team-specific behavioral constraints
3. Review your PRD and task breakdown
4. Use sub-agents in `.claude/agents/` for specialized tasks
5. Implement tasks in sequence
6. Post status updates and feature handoffs via comms.db
7. Acknowledge messages from other teams
