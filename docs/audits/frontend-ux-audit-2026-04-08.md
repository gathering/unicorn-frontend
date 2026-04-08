# Frontend UX Documentation Audit

Date: 2026-04-08
Scope: Full app static analysis
Frameworks used: OWASP Top 10 (2021), WCAG 2.2 AA

## 1. Complete Solution Description

The frontend is a React 19 + TypeScript SPA built with Vite and Tailwind, using React Router v7 for route composition and SWR for API data fetching/caching. It is deployed as static files via Nginx with SPA fallback and a build-version polling mechanism for refresh prompts.

Key architecture elements:
- App bootstrap and route provider: src/index.tsx
- Route topology and nesting: src/routeConfig.tsx
- App shell and top-level navigation: src/App.tsx
- Auth/session state and token lifecycle: src/context/Auth.tsx
- Route authorization gate: src/components/ProtectedRoute/ProtectedRoute.tsx
- Fetch wrappers and API URL shaping: src/utils/fetcher.ts
- Participant flows: src/views/CompetitionOverview.tsx, src/views/CompetitionDetails.tsx, src/views/CompetitionRegistration.tsx, src/views/CompetitionVote.tsx
- Crew/admin flows: src/features/competitionAdmin/competitionAdmin.routes.tsx and src/features/competitionAdmin/views/*
- Deployment/runtime: Dockerfile, nginx.conf, vite.config.mts

End-to-end UX flow as implemented:
1. Users land on competition overview, filter/search published competitions, and navigate to competition details.
2. Unauthenticated users are prompted to login when attempting protected actions.
3. Authenticated users can register entries, upload files, manage contributors, and vote where allowed.
4. Crew users can access admin routes to manage competitions and moderate entries.
5. Session continuity relies on refresh token cookies and periodic refresh logic.

Likely friction points:
- Several routes render null during pending/error states, creating blank-screen behavior.
- Access guard behavior is inconsistent in one voting-related route.
- Voting correctness depends on fragile client-side branching and optimistic cache handling.
- Accessibility semantics are inconsistent for image alternatives and form labeling.

## 2. Issues Found

### Critical

1) Potential XSS via unsanitized HTML rendering
- Severity: Critical
- Impact: Session compromise and vote-page content injection risk
- Affected area: Voting card content rendering
- Rationale: Raw HTML from API data is rendered using dangerouslySetInnerHTML
- Evidence: src/features/competitions/VoteCard/VoteCard.tsx:131
- Standards mapping:
  - OWASP: A03 Injection

2) Broken access-control branch in vote overview for unauthenticated users
- Severity: Critical
- Impact: Inconsistent route protection behavior and unauthorized visibility path
- Affected area: Vote overview guard UX
- Rationale: Unauthenticated branch creates JSX but does not return it
- Evidence: src/views/CompetitionVoteOverview.tsx:25
- Standards mapping:
  - OWASP: A01 Broken Access Control

### High

3) Vote eligibility filtering bypass in client logic
- Severity: High
- Impact: Potentially exposes non-votable entries in voting surface
- Affected area: Competition voting list derivation
- Rationale: Unconditional return true bypasses intended status gating
- Evidence: src/views/CompetitionVote.tsx:30
- Standards mapping:
  - OWASP: A04 Insecure Design

4) Vote cache update can lose active vote state
- Severity: High
- Impact: User sees stale/missing vote state after action
- Affected area: SWR mutate logic for votes
- Rationale: Local mutation removes existing vote by entry but does not merge newly returned vote
- Evidence: src/views/CompetitionVote.tsx:48
- Standards mapping:
  - OWASP: A08 Software and Data Integrity Failures

5) Auth token fetch status actions are dispatched but not reduced
- Severity: High
- Impact: Unreliable auth state transitions, harder-to-debug auth behavior
- Affected area: Auth reducer state machine
- Rationale: SET_FETCH_STATUS is dispatched but reducer has no matching case
- Evidence: src/context/Auth.tsx:206 and src/context/Auth.tsx:109
- Standards mapping:
  - OWASP: A07 Identification and Authentication Failures

6) Missing text alternatives on meaningful images
- Severity: High
- Impact: Screen reader users lose critical context in core content flows
- Affected area: Competition detail, voting, and admin entry media
- Rationale: Multiple non-decorative images use empty alt values
- Evidence:
  - src/views/CompetitionDetails.tsx:127
  - src/views/CompetitionVote.tsx:73
  - src/features/competitionAdmin/views/CompetitionAdminEntry.tsx:152
- Standards mapping:
  - WCAG 2.2 AA: 1.1.1 Non-text Content

7) Inconsistent programmatic label associations in shared input component
- Severity: High
- Impact: Assistive technologies may receive incomplete/incorrect field labeling
- Affected area: Shared form input semantics
- Rationale: aria-labelledby references a label pattern not guaranteed to exist in all branches
- Evidence: src/components/Input/Input.tsx:73
- Standards mapping:
  - WCAG 2.2 AA: 1.3.1 Info and Relationships
  - WCAG 2.2 AA: 4.1.2 Name, Role, Value

### Medium

8) Blank-state reliability gap due to null rendering during loading/errors
- Severity: Medium
- Impact: Perceived instability and user drop-off
- Affected area: Details and vote routes
- Rationale: Null returns hide loading and recovery context
- Evidence:
  - src/views/CompetitionVote.tsx:53
  - src/views/CompetitionDetails.tsx:118

9) Scalability risk from repeated large list requests
- Severity: Medium
- Impact: Performance degradation with event-scale data volumes
- Affected area: Entries and votes data loading
- Rationale: Repeated limit=1000 requests and client filtering
- Evidence:
  - src/views/CompetitionDetails.tsx:106
  - src/views/CompetitionVote.tsx:19
  - src/features/competitionAdmin/views/CompetitionAdminDetails.tsx:55

10) Runtime version mismatch between engine policy and Docker build
- Severity: Medium
- Impact: Build/runtime drift and deployment unpredictability
- Affected area: Dev/prod parity
- Rationale: package engine expects Node >=24, Docker uses Node 22
- Evidence:
  - package.json:66
  - Dockerfile:1
- Standards mapping:
  - OWASP: A05 Security Misconfiguration

### Low

11) Role union typo in protected route typing
- Severity: Low
- Impact: Type clarity and maintainability degradation
- Affected area: Authorization types
- Rationale: Misspelled role union member
- Evidence: src/components/ProtectedRoute/ProtectedRoute.tsx:8

## 3. Potential Improvements (No Edits)

Priority 1: Trust and security stabilization
- Improvement: Resolve access-control and rendering safety findings in voting/auth flows first.
- Expected benefit: Restores integrity and trust in core event actions.
- Effort: M
- Dependencies: Security review signoff for OWASP A01/A03/A07/A08 findings.

Priority 2: Accessibility conformance baseline
- Improvement: Execute a targeted WCAG pass on non-text content and form semantics.
- Expected benefit: Improves inclusion and reduces compliance risk.
- Effort: M
- Dependencies: Confirm WCAG 2.2 AA acceptance baseline and QA criteria.

Priority 3: Reliability of route-state UX
- Improvement: Standardize loading/empty/error patterns across critical routes.
- Expected benefit: Better perceived performance and fewer confusion states.
- Effort: M
- Dependencies: Shared UX pattern decisions for fallback states.

Priority 4: Data-scale readiness
- Improvement: Reduce full-list client filtering and align pagination strategy with backend.
- Expected benefit: Faster route loads and lower memory/network pressure.
- Effort: L
- Dependencies: Backend endpoint capabilities and response contracts.

Priority 5: Runtime parity hardening
- Improvement: Align Node version expectations across local, CI, and container builds.
- Expected benefit: Predictable build behavior and lower release risk.
- Effort: S
- Dependencies: Platform/DevOps version policy approval.

## 4. Suggested Features

1) Participant action center
- User value: Single location for entry status, pending tasks, and vote reminders.
- Rough UX flow: Logged-in user opens dashboard with actionable cards.
- Frontend implications: Aggregate existing endpoints and normalize status states.
- Validation idea: Track task completion rates and reduced support requests.

2) Voting completion assistant
- User value: Helps users finish voting comprehensively.
- Rough UX flow: Progress indicator + jump to unvoted entries.
- Frontend implications: Stronger local vote-state model and UI persistence.
- Validation idea: Compare average number of votes per session before/after rollout.

3) Upload readiness checks
- User value: Fewer failed/disqualified submissions due to format mismatches.
- Rough UX flow: Pre-upload validation summary for required file categories.
- Frontend implications: Validation rules surfaced from upload form definitions.
- Validation idea: Reduction in disqualification reasons tied to upload format errors.

4) Moderation transparency timeline
- User value: Clear participant understanding of qualification/disqualification events.
- Rough UX flow: Entry page displays status timeline and moderator notes.
- Frontend implications: Timeline component with status-event data model.
- Validation idea: Fewer appeals and support contacts on moderation decisions.

## 5. Backend Setup Hypothesis

1) Likely architecture: Django + DRF-style REST
- Assumption: Permission naming and response contracts indicate Django ecosystem.
- Confidence: High

2) Likely auth/session model: OAuth2 authorization code + refresh token
- Assumption: Frontend explicitly exchanges code and refresh token at /oauth/token.
- Confidence: High

3) Likely API style: Resource-based endpoints with list pagination fields
- Assumption: count/next/previous/results contracts suggest standard list resources.
- Confidence: High

4) Likely data entities
- Assumption: Competitions, entries, contributors, files, votes, user profile, permissions.
- Confidence: High

5) Likely media handling
- Assumption: Resumable upload pipeline via tus endpoint with entry/file metadata headers.
- Confidence: High

6) Deployment/runtime expectations
- Assumption: Static SPA hosting via Nginx plus separate backend/API service.
- Confidence: High

## 6. Open Questions

1) Is WCAG 2.2 AA a hard release gate, or target-by-phase?
2) Is server-side sanitization guaranteed for all rich-text fields (including vote messages)?
3) Should unauthenticated users have any visibility into voting routes, or strict gating only?
4) What are expected peak volumes for entries/votes at event load?
5) Which outcome is top priority this cycle: voting integrity, registration throughput, or admin efficiency?
6) Is Node 24 the production standard that container builds must match immediately?
7) Are there browser/device support constraints that modify accessibility implementation choices?
8) Should this audit be repeated per sprint as a formal quality gate before feature merges?

## OWASP Top 10 Coverage Summary

- A01 Broken Access Control: Finding confirmed (Critical)
- A02 Cryptographic Failures: No confirmed Critical/High from current static evidence
- A03 Injection: Finding confirmed (Critical)
- A04 Insecure Design: Finding confirmed (High)
- A05 Security Misconfiguration: Concern confirmed (Medium)
- A06 Vulnerable and Outdated Components: No confirmed Critical/High from current static evidence
- A07 Identification and Authentication Failures: Finding confirmed (High)
- A08 Software and Data Integrity Failures: Finding confirmed (High)
- A09 Security Logging and Monitoring Failures: No confirmed Critical/High from current static evidence
- A10 Server-Side Request Forgery: No confirmed Critical/High from current static evidence

## WCAG 2.2 AA Coverage Summary

Confirmed fails from static evidence:
- 1.1.1 Non-text Content
- 1.3.1 Info and Relationships
- 4.1.2 Name, Role, Value

Not confirmed as fails from current static evidence alone (requires focused interaction testing and contrast measurement):
- 2.1.1 Keyboard
- 2.4.7 Focus Visible
- 3.3.1 Error Identification
