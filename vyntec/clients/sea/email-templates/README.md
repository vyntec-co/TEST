# SEA email templates (11): engagement, committee, dues

Status: **draft, PENDING APPROVAL (Vinny)**. Built 2026-10-10. Nothing placed, sent or wired.

**Spec source:** the 11 `DRAFT –` templates already in the SEA sub-account (created 2026-10-08, plain HTML with `[CONFIRM]` notes), read with list/get-email-template. They match the "11 engagement, committee and dues email templates drafted" line in the SEA Deployment Plan (Oct 8). Gaps were filled from the sub-account's custom fields and custom values and from the Deployment Plan. Every fact and its source is in each folder's `claims.md`.

**Scope conflict (NEEDS HUMAN: Vinny):** ClickUp task 86e2g1wqe ("Email Wiring — 11 Engagement/Committee/Dues templates", the same item as Notion VT-108) lists a *different* set: intake-form confirmations (pop-up confirmation, meeting notification list, workload tracking + reminder, legislative rapid response, school board speaker + prep tips, worksite organizing interest, PR committee invitation, general volunteer pool). Their copy is said to be in `SEA_Intake_Form_Emails.docx` and `SEA_Engagement_Pipeline_Workflow.docx`, which I couldn't find in Drive. Those are **not built**. Recommended default: treat them as a second batch once the docx files turn up.

## Templates

| Folder | Name | Subject | Sent by | Status | Open placeholders |
|---|---|---|---|---|---|
| engagement-points-earned | Engagement: Points Earned | You just earned engagement points, {{contact.first_name}} | unknown | draft | none |
| engagement-new-level-reached | Engagement: New Level Reached | You've reached {{contact.engagement}} status | unknown | draft | recognition/benefit per level |
| engagement-welcome | Engagement: Welcome to the Engagement Program | Welcome, {{contact.first_name}}: here's how SEA engagement works | unknown | draft | points for committee joined, recruiting, rep/board/ambassador (x3); July 1 reset |
| committee-interest-received | Committee: Interest Received | Thanks for volunteering, {{contact.first_name}} | unknown | draft | follow-up timeframe |
| committee-assigned | Committee: Assigned to a Committee | Welcome to your SEA committee, {{contact.first_name}} | unknown | draft | committee name merge source |
| committee-meeting-reminder | Committee: Meeting Reminder | Reminder: your SEA committee meets [[MEETING DATE]] | unknown | draft | committee name, date/time (subject + body), location, what to bring |
| dues-payment-failed | Dues: Payment Failed | Your SEA dues payment didn't go through | unknown | draft | payment link, auto-retry |
| dues-payment-reminder | Dues: Payment Reminder | Friendly reminder about your SEA dues | unknown | draft | payment link |
| dues-past-due-30 | Dues: Past Due (30+ Days) | Your SEA dues are past due | unknown | draft | payment link, past-due policy wording |
| dues-delinquent-45 | Dues: Delinquent (45+ Days) | Important: your SEA membership is at risk | unknown | draft | payment link, **delinquency policy (NEEDS HUMAN: Thomas Bugos, possibly counsel; do not send without it)** |
| dues-resolved-paid | Dues: Resolved / Paid | Thank you, your SEA dues are up to date | unknown | draft | confirm next-billing-date field is filled |

**Sent by:** no workflow in the sub-account sends these yet. These are the likely triggers (INFERRED from workflow names only, not checked):
- Points Earned: `Engagement - Award Points: *` (Member Recruited and Committee Joined are published; the rest are drafts).
- New Level: `Contact - Recalculate Engagement Tier` (draft).
- Committee: `Committee Intake - Activate Member`, `Associate Chair to Committee`.
- Dues: `Dues - Sync Pipeline Stage to Status Field`, `Dues – Create Collections Case on Payment Failure`, `Dues Payment Activated`. Exempt members are suppressed by `"Dues – Exempt Status Suppresses Delinquency Sequence`.

## Merge fields used (all read from the sub-account)
- Contact: `{{contact.first_name}}`, `{{contact.engagement_points}}`, `{{contact.engagement}}` (Engagement Level), `{{contact.worksite_name}}`, `{{contact.committees_of_interest}}`, `{{contact.dues_renewalnext_billing_date}}`
- Custom value: `{{ custom_values.sea_main_line }}` (407-388-1131)
- Footer: `{{location.full_address}}` and `{{email.unsubscribe_link}}`, the same keys the account's existing templates use. (`{{location.address}}` isn't used anywhere in the account, so I used `full_address`.)

## Other open items
- Sending address for member emails: open (Deployment Plan Q16). The from name is "Seminole Education Association", as in the existing drafts.
- Dues amounts (FT $733.00/yr, PT $325.20/yr, per the Deployment Plan Q9) are **not** in the copy, because no contact field says which rate a member pays.
- Logo and colours: none on file. The templates use a neutral, accessible palette (text #1f2933 on #ffffff, accent #1f4e79) and a `LOGO` comment in the header.

## Placement steps (after Vinny approves)
1. Fill or delete every `[[...]]` placeholder and get Thomas Bugos's answers (policy wording needs his written OK).
2. **vyntec Test Lab first:** for each folder, call API op `create-email-template` (`POST /emails/locations/{locationId}/templates`) with `editorType: "html"`, name = meta.json `name`, subject and preview text from meta.json, and the body = `template.html`. Read it back with `get-email-template` and send a test to an internal address only.
3. **SEA (uRaVZsAUjEiZ8MyuCIb3) only after Vinny approves the Test Lab versions.** The SEA sub-account already holds the 11 `DRAFT –` versions (ids are in each claims.md). Vinny decides whether to update those or create new ones and archive the drafts. Recommended default: update in place, so there are no duplicates.
4. Wiring to workflows is a separate T1 build (ClickUp 86e2g1wqe / Notion VT-108). Any send is T2.
