---
name: High - Accessibility image alternatives
about: Add meaningful text alternatives to content images
title: "[High][Accessibility] Add meaningful text alternatives to content images"
labels: [accessibility, high, wcag-1.1.1, frontend]
assignees: []
---

## Summary
Multiple content-bearing images use empty alt values, which hides important information from assistive technologies.

## Why this matters
This is a WCAG 2.2 AA conformance risk and impacts discoverability and usability for screen reader users.

## Evidence
- [Competition details image](src/views/CompetitionDetails.tsx#L127)
- [Vote image](src/views/CompetitionVote.tsx#L73)
- [Admin entry image](src/features/competitionAdmin/views/CompetitionAdminEntry.tsx#L152)

## Standards mapping
- WCAG 2.2 AA: 1.1.1 Non-text Content

## Acceptance criteria
- [ ] Meaningful images expose appropriate text alternatives.
- [ ] Decorative images remain intentionally empty and documented as decorative.
- [ ] Accessibility QA confirms announced content is sufficient for task completion.

## Priority
- P1

## Audit source
- [Frontend UX Documentation Audit 2026-04-08](docs/audits/frontend-ux-audit-2026-04-08.md)
