---
name: Critical - Vote overview access guard
about: Fix unauthenticated access guard behavior on vote overview route
title: "[Critical][Access] Fix unauthenticated guard behavior on vote overview route"
labels: [security, critical, owasp-a01, frontend, auth, voting]
assignees: []
---

## Summary
The unauthenticated branch in vote overview does not return its guard UI, resulting in inconsistent route protection behavior.

## Why this matters
Access control presentation and flow become unreliable in a sensitive area (voting).

## Evidence
- [Unauthenticated vote overview branch](src/views/CompetitionVoteOverview.tsx#L25)

## Standards mapping
- OWASP Top 10 (2021): A01 Broken Access Control

## Acceptance criteria
- [ ] Unauthenticated route behavior is explicit and deterministic.
- [ ] Vote overview consistently enforces intended unauthenticated UX path.
- [ ] Auth-route behavior test scenario added for this route.

## Priority
- P0

## Audit source
- [Frontend UX Documentation Audit 2026-04-08](docs/audits/frontend-ux-audit-2026-04-08.md)
