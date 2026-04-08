---
name: High - Vote cache integrity
about: Stabilize vote cache update after create and update actions
title: "[High][Data Integrity] Stabilize vote cache update after create/update actions"
labels: [high, owasp-a08, frontend, swr, voting]
assignees: []
---

## Summary
Current local vote mutation removes existing vote state but does not merge returned updated vote, causing inconsistent post-action UI.

## Why this matters
Users receive misleading vote feedback, which reduces trust and increases support burden.

## Evidence
- [Vote mutate path](src/views/CompetitionVote.tsx#L48)

## Standards mapping
- OWASP Top 10 (2021): A08 Software and Data Integrity Failures

## Acceptance criteria
- [ ] Vote UI reflects server-accepted state after create and update actions.
- [ ] No disappearing or stale vote states after mutation.
- [ ] Regression scenario covers rapid repeated vote changes.

## Priority
- P1

## Audit source
- [Frontend UX Documentation Audit 2026-04-08](docs/audits/frontend-ux-audit-2026-04-08.md)
