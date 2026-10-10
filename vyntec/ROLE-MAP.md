# Role map: 25 original roles → vyntec-hq agents

Source: the `vyntec-departments` skill. The old user-level agent files (~/.claude/agents/ on Vinny's PC) were not available in the build session, so they have not been compared yet.

| # | Old role | New agent | Status | Reports to | Method lost? |
|---|---|---|---|---|---|
| — | (new) | chief-of-staff | new | Vinny Mele | n/a |
| — | (new) | head-of-sales-onboarding | new | chief-of-staff | n/a |
| — | (new) | head-of-customer-relations | new | chief-of-staff | n/a |
| 01 | VP of Social | vp-of-social | kept | chief-of-staff | no |
| 02 | Social Data Analyst | social-data-analyst | kept | vp-of-social | no |
| 03 | Platform Strategist | platform-strategist | kept | vp-of-social | no |
| 04 | Art Director | art-director | kept | vp-of-social | no |
| 05 | Video Producer | video-producer | kept | vp-of-social | no |
| 06 | Social Copywriter | social-copywriter | kept | vp-of-social | no |
| 07 | Community Manager | community-manager | kept | vp-of-social | no |
| 08 | Paid Social Manager | paid-social-manager | kept | vp-of-social | no |
| 09 | Market Intel Analyst | market-intel-analyst | kept | vp-of-social | no |
| 10 | Content Repurposer | content-repurposer | kept | vp-of-social | no |
| 11 | Ops Producer (social) | social-ops-producer | renamed | vp-of-social | no |
| 12 | Head of Delivery | head-of-delivery | kept (now owns the radar SOP) | chief-of-staff | no |
| 13 | Workflow Engineer | workflow-engineer | kept | head-of-delivery | no |
| 14 | Account Architect | account-architect | kept | head-of-delivery | no |
| 15 | Website Builder | website-builder | kept (absorbs 20) | head-of-delivery | no |
| 16 | Comms & Compliance Writer | comms-compliance-writer | kept | head-of-delivery | no |
| 17 | Client Liaison | client-liaison | moved, made generic | head-of-customer-relations | no |
| 18 | Ops Admin | ops-admin | moved | chief-of-staff | no |
| 19 | Data Steward | data-steward | kept | head-of-delivery | no |
| 20 | Top Truck Page Publisher | → website-builder | removed, merged | head-of-delivery | no: generic method lines are website-builder step "(from 20)"; Top Truck details are in clients/top-truck |
| 21 | Consent Packet Engineer (CS Laser) | forms-consent-engineer | renamed, made generic | head-of-delivery | no (context → clients/cs-laser) |
| 22 | Packages & Payments Engineer (CS Laser) | payments-engineer | renamed, made generic | head-of-delivery | no (context → clients/cs-laser) |
| 23 | Dashboard & Pipeline Builder | dashboard-pipeline-builder | kept (CS Laser context moved out) | head-of-delivery | no (context → clients/cs-laser) |
| 24 | Engagement & Membership Engineer (SEA / Union OS) | engagement-membership-engineer | renamed, made generic | head-of-delivery | no (context → clients/sea) |
| 25 | QA Lead | qa-lead | kept | head-of-delivery | no |

## Edits made to Method or Output text (all others are word for word)
| Role | Before | After |
|---|---|---|
| 01 Output | Delegation (role, deliverable, due date, ClickUp list) | Delegation (role, deliverable, due date, Notion task (Department, Client)) |
| 11 Method | (logged per vyntec-work-tracking, in the relevant client list or Internal Operations, since no separate social space exists yet) | (logged per sops/work-tracking.md, Department = Social) |
| 12 Method | (ClickUp tasks, build notes) | (Notion tasks, build notes) |
| 24 Method | Say what Union OS or SEA must confirm first. | Say what the client (see clients/<slug>/CLAUDE.md) must confirm first. |
| 25 Output | marked complete in ClickUp | marked complete in Notion |
| 15 Method/Output | (none removed) | + step "(from 20)" and "Link test results (from 20)" added |
