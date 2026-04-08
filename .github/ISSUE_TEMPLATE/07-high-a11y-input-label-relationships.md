---
name: High - Accessibility input label relationships
about: Fix programmatic label relationships in shared input component
title: "[High][Accessibility] Fix programmatic label relationships in shared input component"
labels: [accessibility, high, wcag-1.3.1, wcag-4.1.2, frontend, forms]
assignees: []
---

## Summary
Shared input component label wiring can produce invalid or incomplete accessible-name relationships.

## Why this matters
Core forms may be difficult to complete with assistive technologies, affecting registration and profile workflows.

## Evidence
- [Input aria-labelledby reference](src/components/Input/Input.tsx#L73)

## Standards mapping
- WCAG 2.2 AA: 1.3.1 Info and Relationships
- WCAG 2.2 AA: 4.1.2 Name, Role, Value

## Acceptance criteria
- [ ] All input rendering branches provide deterministic accessible names.
- [ ] Programmatic relationships are valid for label, help text, and error semantics.
- [ ] Accessibility QA confirms proper screen reader announcements.

## Priority
- P1

## Audit source
- [Frontend UX Documentation Audit 2026-04-08](docs/audits/frontend-ux-audit-2026-04-08.md)
