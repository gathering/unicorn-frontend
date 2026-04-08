---
name: High - Vote eligibility filter
about: Correct vote eligibility filtering logic
title: "[High][Integrity] Correct vote eligibility filtering logic"
labels: [high, owasp-a04, frontend, voting]
assignees: []
---

## Summary
Vote eligibility filter includes an unconditional true branch, bypassing intended status checks.

## Why this matters
Users can be shown entries that should not be votable, undermining confidence in vote flow.

## Evidence
- [Eligibility branch](src/views/CompetitionVote.tsx#L30)

## Standards mapping
- OWASP Top 10 (2021): A04 Insecure Design

## Acceptance criteria
- [ ] Eligibility logic enforces agreed status rules consistently.
- [ ] Ineligible entries never appear in votable list.
- [ ] QA scenario covers multiple entry statuses.

## Priority
- P1

## Audit source
- [Frontend UX Documentation Audit 2026-04-08](docs/audits/frontend-ux-audit-2026-04-08.md)
