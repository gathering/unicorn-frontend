---
name: High - Auth state machine
about: Complete auth token fetch status state machine
title: "[High][Auth] Complete auth token fetch status state machine"
labels: [high, owasp-a07, frontend, auth]
assignees: []
---

## Summary
Auth flow dispatches SET_FETCH_STATUS actions without a reducer case, creating inconsistent state tracking.

## Why this matters
Auth transitions become harder to reason about and more error-prone under refresh and login edge cases.

## Evidence
- [Fetch status dispatch](src/context/Auth.tsx#L206)
- [Reducer switch](src/context/Auth.tsx#L109)

## Standards mapping
- OWASP Top 10 (2021): A07 Identification and Authentication Failures

## Acceptance criteria
- [ ] Auth state machine has complete and coherent transitions.
- [ ] Pending, resolved, and rejected states are represented and consumed consistently.
- [ ] Edge-case scenarios (refresh failure, logout, login retry) are validated.

## Priority
- P1

## Audit source
- [Frontend UX Documentation Audit 2026-04-08](docs/audits/frontend-ux-audit-2026-04-08.md)
