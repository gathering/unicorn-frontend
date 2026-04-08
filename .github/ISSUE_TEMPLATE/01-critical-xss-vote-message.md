---
name: Critical - XSS vote message rendering
about: Track XSS risk from unsafe vote message HTML rendering
title: "[Critical][Security] Prevent XSS in vote message rendering path"
labels: [security, critical, owasp-a03, frontend, voting]
assignees: []
---

## Summary
Raw HTML from entry vote messages is rendered in the voting card UI, creating an XSS risk if content is not strictly sanitized.

## Why this matters
This is a trust and integrity risk in a core user journey. A malicious payload could execute in user sessions and alter behavior or data shown during voting.

## Evidence
- [Vote message render path](src/features/competitions/VoteCard/VoteCard.tsx#L131)

## Standards mapping
- OWASP Top 10 (2021): A03 Injection

## Acceptance criteria
- [ ] Rich-text rendering path is explicitly constrained by approved sanitization policy.
- [ ] Security review verifies no script-capable payload executes in vote message rendering.
- [ ] Regression checks exist for this rendering surface.

## Priority
- P0

## Audit source
- [Frontend UX Documentation Audit 2026-04-08](docs/audits/frontend-ux-audit-2026-04-08.md)
