---
name: frontend-ux-documentation-audit
description: 'Run a documentation-first static analysis of a frontend codebase. Use for UX architecture reviews, OWASP Top 10 checks, WCAG coverage, issue prioritization (Critical/High/Medium/Low), and feature-readiness planning before implementing new features.'
argument-hint: 'Scope and goal, for example: whole app, voting flow, or admin UX with OWASP and WCAG checks'
user-invocable: true
---

# Frontend UX Documentation Audit

## What This Skill Produces
- A rigorous, evidence-driven frontend audit from static code analysis.
- A prioritized risk register mapped to OWASP Top 10 and WCAG.
- A feature-readiness handoff that identifies what must be stabilized before new feature work.
- A documentation output suitable for engineering and product stakeholders.

## When To Use
- Before adding significant features to an existing frontend.
- After major refactors when UX consistency and risk posture are unknown.
- When stakeholders need a no-code-change architecture and quality assessment.
- When a security/accessibility review is needed but implementation changes are out of scope.

## Inputs To Collect From Context
Collect these from chat, repository files, and existing docs. Ask only if missing.
1. Audit scope
- Entire app, specific feature, or specific routes/views.
2. Product goals and audience
- Event users, participants, admins, moderators, or mixed audiences.
3. Technical constraints
- Stack, release timeline, browser support, accessibility target (for example WCAG 2.2 AA), and security posture expectations.
4. Delivery format
- Full report, Critical/High only report, or executive summary.

## Non-Negotiable Operating Rules
1. Prefer static analysis first.
2. Be evidence-driven and cite exact file paths and lines.
3. Do not propose direct code edits unless explicitly asked.
4. Rank findings by user impact and exploitability.
5. Keep recommendations realistic for current stack and team maturity.

## Procedure

### Step 1: Map The Solution End-To-End
Build a concise architecture model from repository evidence.
- Entry points and app shell.
- Routing and navigation topology.
- Auth/session/token flow.
- Data-fetching and state patterns.
- Feature module boundaries.
- Deployment assumptions and runtime environment.

Completion check:
- You can explain how a user discovers, logs in, registers, votes, and logs out.

### Step 2: Trace Core User Journeys
Trace critical routes and identify friction points.
- Discovery and browsing flow.
- Authenticated participation flow.
- Voting flow.
- Admin and moderation flow.

Completion check:
- You can list at least 3 likely user pain points with evidence.

### Step 3: Run OWASP Top 10 Static Checks
Assess frontend-exposed risks and map each confirmed finding.
- A01 Broken Access Control: route guards, role checks, conditional rendering leaks.
- A02 Cryptographic Failures: token/session handling and insecure client assumptions.
- A03 Injection: unsafe HTML rendering, URL/query construction, parser usage.
- A04 Insecure Design: missing guardrails in business-critical paths.
- A05 Security Misconfiguration: build/runtime mismatches, unsafe defaults.
- A06 Vulnerable and Outdated Components: dependency and runtime risk indicators.
- A07 Identification and Authentication Failures: login/logout/refresh logic gaps.
- A08 Software and Data Integrity Failures: integrity assumptions in updates/caching.
- A09 Security Logging and Monitoring Failures: visible client-side observability gaps.
- A10 SSRF: frontend-induced backend fetch patterns that may permit abuse.

Decision rule:
- Mark only evidence-backed issues as findings.
- Mark uncertain items as assumptions or open questions.

Completion check:
- Every Critical/High security finding is mapped to at least one OWASP category.

### Step 4: Run WCAG Static Checks
Review accessibility across common interactions.
- Perceivable: text alternatives, color contrast signals, semantic content.
- Operable: keyboard reachability, focus visibility, focus order.
- Understandable: labels, instructions, predictable behavior, error clarity.
- Robust: programmatic name/role/value and assistive-tech compatibility cues.

Minimum criterion checks:
- 1.1.1 Non-text Content
- 1.3.1 Info and Relationships
- 2.1.1 Keyboard
- 2.4.7 Focus Visible
- 3.3.1 Error Identification
- 4.1.2 Name, Role, Value

Completion check:
- Every High/Critical accessibility finding is mapped to a specific WCAG criterion.

### Step 5: Prioritize Findings
Create a ranked findings list.
For each item include:
- Severity: Critical, High, Medium, Low
- Impact
- Affected area
- Rationale
- Evidence path and line reference
- Standard mapping: OWASP and/or WCAG when applicable

Prioritization logic:
- Critical: exploitable security issue, severe access control break, or severe user harm in core journey.
- High: major flow break, high-likelihood data or trust impact, significant accessibility non-conformance.
- Medium: notable quality, consistency, or maintainability issue with moderate impact.
- Low: minor issue with limited impact.

### Step 6: Feature-Readiness Handoff
Produce a precursor plan for adding new features.
- Stabilization prerequisites: what must be fixed first.
- Dependency risks: what may block roadmap work.
- Safe expansion zones: areas suitable for feature growth.
- Validation plan: how to confirm improvements before shipping new features.

Completion check:
- The handoff clearly states what should be done before feature implementation starts.

## Required Output Structure
Use this section order unless the user requests a narrower format.
1. Complete Solution Description
2. Issues Found
3. Potential Improvements (No Edits)
4. Suggested Features
5. Backend Setup Hypothesis
6. Open Questions

If requested, also produce:
- Critical and High Findings Only (OWASP + WCAG mapped)
- Executive one-pager for stakeholders

## Quality Bar
- Specific and evidence-backed, not generic best-practice lists.
- Clear distinction between confirmed findings and assumptions.
- Actionable and prioritized recommendations.
- Language appropriate for both product and engineering audiences.
- No contradictory severity assignments.

## Ambiguity Handling
When confidence is limited, do not guess silently.
- State assumption.
- Assign confidence level.
- Add a concise open question.

## Example Invocation Prompts
- /Frontend-UX-Documentation-Audit full app static analysis with OWASP Top 10 and WCAG 2.2 AA mapping.
- /Frontend-UX-Documentation-Audit voting and registration routes only, deliver Critical and High findings.
- /Frontend-UX-Documentation-Audit admin workflow audit plus feature-readiness handoff for next sprint.

### Finalizing steps
- Review all findings and ensure they are evidence-backed.
- Confirm that all Critical and High issues are mapped to OWASP and WCAG standards.
- Validate that the feature-readiness handoff clearly states prerequisites and risks.
- Summarize the overall UX risk posture and key improvement areas in the conclusion.
- Create github issues for each Critical and High finding
- create a md file in the repo with the full report and link to it in the issues