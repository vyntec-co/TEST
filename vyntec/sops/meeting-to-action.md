# SOP: Meeting → Action

**Owner:** chief-of-staff · **Approver:** Vinny Mele · **Version:** 2.0 (from 1.0, 2026-09-22; task layer moved off ClickUp) · **Review:** monthly for the first quarter, then quarterly

## 1. Purpose
Turn every finished meeting into concrete system updates (tasks, calendar holds, email drafts, CRM notes, a filed record) within 24 hours, with nothing sent externally without approval. **No commitment made on a call gets lost, and nothing goes out in Vinny's name that he hasn't seen.**

## 2. Scope
In: Zoom, Google Meet and phone calls captured by Granola, Zoom transcripts or AI summaries, or pasted notes. Prospect calls (incl. Precinct), client calls, partner/vendor calls (payment processing, platform), internal vyntec meetings.
Out: in-person meetings with no notes (log manually); legal or contract negotiation details needing counsel (flag only); payments, card data or credentials (never entered into any system).

## 3. Systems
| System | Receives | Tier |
|---|---|---|
| Granola, Zoom | source transcript and summary | read (T0) |
| Task layer | tasks, waiting items, the review task | T0 (create/update); executing approved items T1 |
| Google Calendar | follow-ups, deadline holds, prep blocks | holds with no guests T1; external guests T2 |
| Gmail | recap and follow-up emails | drafts T0; sending T2, per email |
| Platform (Vyntec sub-account) | contact notes, opportunity stage | T1 |
| Google Drive | filed meeting record | T1 |

## 4. Steps
| # | Step | Executor | Output |
|---|---|---|---|
| 1 | Capture | recording tool (Granola/Zoom) or Vinny pastes notes | transcript available |
| 2 | Trigger | Vinny: "Process my meeting with ___", or a scheduled run (later) | request |
| 3 | Ledger check | chief-of-staff | skip if the meeting's ID is already in Processed Items |
| 4 | Pull & verify | chief-of-staff | Granola first, then Zoom, then pasted. Cross-check the Calendar event (title, date, attendee emails). Two matches → ask which; never guess |
| 5 | Classify | chief-of-staff | Prospect · Client · Partner/Vendor · Internal |
| 6 | Extract | chief-of-staff | the extraction schema below |
| 7 | Duplicate check | chief-of-staff | each item tagged NEW or UPDATE [link] after searching tasks, Calendar and the platform contact |
| 8 | Action plan | chief-of-staff | ONE review task in the task layer, `Review: Action plan — [Org] — [YYYY-MM-DD]`, status Needs your review, assigned to Vinny, body = extraction + action plan + drafts in full. **Nothing is created before this is approved** |
| 9 | Approve | Vinny | approves all / all except N / edits, by setting the task Approved (cockpit button) or replying |
| 10 | Execute | each item's executing agent, in order: tasks → Calendar → platform → Drive → Gmail drafts | links to everything created |
| 11 | Confirm | chief-of-staff | list of items created with links, plus any failed item and why; ledger row Result updated |
| 12 | Send | Vinny only (T2), or an agent on an explicit "send it" for one specific draft | sent email; the "send recap" task Done |

Executing agents for step 10: tasks and Calendar holds → chief-of-staff; prospect platform notes, stage and recap drafts → head-of-sales-onboarding; client platform notes and recap drafts → head-of-customer-relations (waiting-on items → client-liaison); partner and internal summaries → chief-of-staff; Drive filing → ops-admin; build requests → head-of-delivery; content ideas → vp-of-social.

### Classification defaults
| Type | Signals | Default outputs |
|---|---|---|
| Prospect | Precinct demo, discovery, pricing talk, new org | recap draft, platform note + stage check, follow-up meeting, tasks |
| Client | existing client, onboarding, support, build requests | recap draft, tasks with the Client set, platform note |
| Partner/Vendor | merchant processing, integrations, suppliers | internal summary, tasks, follow-up draft if we owe something |
| Internal | vyntec team only | tasks, internal summary; no external email |

### Extraction rules
- An action item needs an **owner**. Ambiguous → `owner: UNCLEAR`; never assign by guess.
- Dates only if stated or clearly implied ("by Friday" → that Friday). Otherwise `due: none — suggest`.
- Separate **what we owe them** from **what they owe us**; theirs becomes a `Waiting:` task.
- Nothing sensitive (pricing concessions, payment details, personal info) goes into an email draft without Vinny's confirmation. Flag anything that sounds like a legal or contractual commitment (NEEDS HUMAN).

```
MEETING: [title] | [date] | [type] | [source: Granola/Zoom/pasted] | [source item ID]
ATTENDEES: [name — org — email]
SUMMARY: 3–5 sentences
DECISIONS: [decision] — [who decided]
ACTION ITEMS (ours): [task] — [owner] — [due] — [priority] — [evidence quote ≤ 1 line]
WAITING ON (theirs): [item] — [who] — [expected by]
FOLLOW-UP MEETINGS: [purpose] — [proposed time] — [attendees]
CRM FACTS: [budget, timeline, decision-maker, objections, stage signals]
OPEN QUESTIONS / RISKS: [item]
```

## 5. Action plan format (fixed)
| # | Action | System | Details | Executing agent | Approval tier | NEW / UPDATE |
|---|---|---|---|---|---|---|
| 1 | Create task | Task layer | `Send pricing deck — Acme` · due 2026-10-14 · High · evidence "…" | chief-of-staff | T1 | NEW |
| 2 | Hold | Google Calendar | `Acme × vyntec — follow-up`, Vinny only | chief-of-staff | T1 | NEW |
| 3 | Recap email | Gmail | draft shown in full below | head-of-sales-onboarding | draft T0 · send T2 | NEW |

Every row has all seven columns. Vinny answers "approve all", "approve except 3, 7", or edits.

## 6. Standards
- **Tasks:** see Task layer below.
- **Calendar:** follow-up title `[Org] × vyntec — [purpose]`, agenda in the description, link to the meeting record. Adding external guests sends an invite: T2 for that event. Holds and prep blocks: Vinny's calendar only, no guests.
- **Platform:** contact note = date, 3-line summary, next step. Change an opportunity stage only if the meeting clearly moved it, reason in the note. Never edit billing, payment or subscription settings from this workflow.
- **Drive:** `Meetings / [YYYY] / [Type] / [YYYY-MM-DD] [Org] — [Title]`, containing the extraction and links to everything created.
- **Gmail:** drafts in Vinny's Gmail, threaded as a reply where a prior thread exists, using the templates below. Never names the platform vendor.

## 7. Failure rules
- A failed tool call is retried at most 2 times. Then the item is marked **NEEDS HUMAN** (task Blocked, with the error) and the run continues with the other items. No loops.
- Connector down or auth expired: finish everything else, list failed items in the confirmation, ledger Result = NEEDS HUMAN.
- No transcript found: ask Vinny to paste notes; never reconstruct from the calendar invite alone.

## 8. Exceptions
| Scenario | What to do |
|---|---|
| Names garbled | match against Calendar attendees; list anything still unclear under Open Questions |
| Conflicting commitments across meetings | flag both, link both, Vinny decides |
| Recorded without consent / sensitive topic | file the summary only, flag it |
| Pricing, discount or contract terms discussed | capture internally; exclude specifics from drafts unless Vinny confirms; flag contract language |
| Payment details, card numbers, credentials mentioned | never copy anywhere; note "sensitive info discussed — handle directly" |
| Follow-up time proposed but not agreed | draft a scheduling email with 2–3 options instead of an event |
| Existing task covers the item | update it; don't duplicate |
| Internal meeting with no actions | file the summary only; no tasks |

## 9. Quality checklist (before step 8)
- [ ] Correct meeting; date and attendees match Calendar
- [ ] Every action item has an owner or UNCLEAR
- [ ] Ours vs theirs separated; no invented due dates
- [ ] Duplicate check done; UPDATE items linked
- [ ] Vinny assigned on every task
- [ ] Drafts free of sensitive pricing/payment details unless confirmed, and of the vendor name
- [ ] External invites marked T2

## 10. Templates
**Recap email (prospect/client)**
```
Subject: Recap — [Topic] | [Date]

Hi [First name],

Thanks for the time today. Quick recap so we're aligned:

What we covered
- [Point 1]
- [Point 2]

Next steps
- vyntec: [item] by [date]
- [Their org]: [item] by [date]

[Next meeting: [date/time] — invite coming] OR [Would any of these work for a follow-up? [options]]

Talk soon,
Vinny
```
**Internal summary (partner/internal):** `[Org] — [Title] — [Date]` · Summary · Decisions · Our actions (task — owner — due) · Waiting on (item — who — by) · Risks/open questions · Links.
**Task body:** `From: [Meeting title] on [date] ([type])` · `Context:` one sentence · `Evidence: "[short line]"` · `Record: [Drive link]`.

## 11. Trigger prompts
- `Process my meeting with [person/org] from [today/date] per the meeting SOP.`
- `Process all my meetings from today per the meeting SOP.`
- `Process these notes per the meeting SOP: [paste]`
- Fast mode (internal only): `Process [meeting] — tasks only, no emails.`

## 12. Configuration to fill in
| Setting | Value |
|---|---|
| Platform pipeline + stages for prospects (Precinct) | TO FILL |
| Drive root folder for meeting records | TO FILL |
| Primary transcript source | Granola (then Zoom) |
| Email signature block | TO FILL |

## 13. Metrics and weekly audit (Fridays, 15 min)
Targets: processed < 24h (goal < 4h, from the ledger Date vs meeting end) · external recaps sent same day ≥ 90% · action items with owner + due ≥ 95% · duplicate tasks 0 · Waiting items followed up by due date 100%.
Audit: close done meeting tasks and date any `needs-date` ones; check overdue `Waiting:` tasks and draft nudges; compare the week's Calendar against the ledger and process missed meetings; note any friction and update this SOP.

## Task layer
Tasks live in the Notion database **vyntec Tasks**; the ledger is **Processed Items** (IDs and statuses in `sops/work-tracking.md`). Step 3 queries Processed Items by the meeting's source ID; step 8 creates the review task (Source = Meeting, Department = Chief of Staff, Executing agent = chief-of-staff, Approval tier = T1 Plan approval, Assignee = Vinny) and a Processed Items row (Result = Review task created, Task = its URL). Approved tasks from step 10 are created with Status Queued, `Waiting:` items with Status Blocked, and the Client set.
