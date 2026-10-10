# SOP: Meeting Transcript → Systems Implementation

**Owner:** chief-of-staff | **Approver:** Vinny Mele (vyntec) | **Executors:** named per step below
**Version:** 2.0 (rewritten from `_source/meeting-to-action-sop.md` v1.0; task layer moved off ClickUp) | **Last Updated:** 2026-10-10 | **Review Cadence:** Monthly for the first quarter, then quarterly

---

## 1. Purpose

Every virtual meeting produces commitments, decisions, and follow-ups that currently live in a transcript nobody rereads. This SOP turns a finished meeting into concrete system updates — tasks, calendar events, email drafts, CRM notes, and a filed record — within 24 hours, with nothing sent externally without approval.

The goal is simple: **no commitment made on a call gets lost, and nothing goes out in Vinny's name that he hasn't seen.**

## 2. Scope

**In scope:** Zoom, Google Meet, and phone calls captured by Granola, Zoom transcripts/AI summaries, or pasted notes. Covers Precinct prospect and client calls, partner/vendor calls (e.g., payment processing, platform-related), and internal vyntec meetings.

**Out of scope:** In-person meetings with no notes (log manually), legal or contract negotiation details that need counsel review (flag only), and anything involving payments, card data, or account credentials (never entered into any system by an agent).

## 3. Systems Map

| System | Connector | What it receives | Permission level |
|---|---|---|---|
| Granola | Granola MCP | Source transcript + summary | Read |
| Zoom | Zoom for Claude MCP | Source transcript, recordings, meeting assets | Read |
| Task layer | see Task layer | Tasks, subtasks, comments, due dates; the review task; the processed-items ledger | Review task and ledger: create (T0). Other tasks: create/update after batch approval (T1) |
| Google Calendar | Google Calendar MCP | Follow-up meetings, deadline holds, prep blocks | Create after approval (T1); invites to external guests need explicit yes (T2) |
| Gmail | Gmail MCP | Recap and follow-up emails | **Drafts only** (T0). Sending requires explicit yes per email (T2) |
| Platform (Vyntec sub-account) | leadconnector MCP | Contact notes, opportunity stage, tags | Update after approval (T1) |
| Google Drive | Google Drive MCP | Filed meeting record | Create after approval (T1) |

## 4. RACI

| Step | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Capture transcript | Recording tool (Granola/Zoom) | Vinny | — | — |
| Trigger processing | Vinny | Vinny | — | — |
| Extract & classify | chief-of-staff | Vinny | — | — |
| Review action plan | Vinny | Vinny | Meeting attendees (if unclear) | — |
| Create tasks / events / CRM updates | executing agents (Step 8) | Vinny | — | Task assignees |
| Send external emails | Vinny (approves) / agents (draft) | Vinny | — | External attendees |
| File record | ops-admin | Vinny | — | — |
| Weekly audit | Vinny | Vinny | chief-of-staff | — |

## 5. Process Flow

```
Meeting ends
    │
    ▼
[1] Capture ── transcript available in Granola / Zoom / pasted
    │
    ▼
[2] Trigger ── Vinny: "Process my meeting with ___"
    │
    ▼
[3] Pull & verify ── already processed? right meeting? attendees? date?
    │
    ▼
[4] Classify ── Prospect | Client | Partner/Vendor | Internal
    │
    ▼
[5] Extract ── decisions, action items, dates, open questions, CRM facts
    │
    ▼
[6] Duplicate check ── existing tasks, calendar events, platform records
    │
    ▼
[7] ACTION PLAN ── one review task for Vinny ◄── APPROVAL GATE
    │         │
    │     edits / rejects → revise → back to [7]
    ▼
[8] Execute ── tasks → Calendar → platform → Drive → Gmail drafts
    │
    ▼
[9] Confirm ── links to everything created; emails await send approval
    │
    ▼
[10] Send ── only emails Vinny explicitly approves
```

## 6. Detailed Steps

### Step 1: Capture
- **Executors:** recording tool (Granola or Zoom); Vinny when pasting.
- **When:** Every external meeting and any internal meeting with decisions.
- **How:** Granola running, or Zoom cloud recording + transcript enabled. If neither, Vinny pastes notes or a voice-memo transcript into chat.
- **Output:** A transcript or summary accessible by connector or in chat.

### Step 2: Trigger
- **Executors:** Vinny.
- **When:** Same day as the meeting — target within 4 hours, hard limit 24 hours.
- **How:** Use the trigger prompt in Section 10. Multiple meetings can be batched ("process all my meetings from today").
- **Output:** Processing request.

### Step 3: Pull & Verify
- **Executors:** chief-of-staff.
- **How:** First check the processed-items ledger by the meeting's source ID; a meeting already there is not processed again. Pull from Granola first, then Zoom, then fall back to pasted content. Cross-check against the Google Calendar event for title, date, and attendee emails. If two meetings match, ask which one — never guess.
- **Output:** Confirmed source meeting with attendee list.

### Step 4: Classify
- **Executors:** chief-of-staff.

| Type | Signals | Default outputs |
|---|---|---|
| **Prospect** | Precinct demo, discovery, pricing talk, new org | Recap email, platform note + stage check, follow-up meeting, tasks |
| **Client** | Existing Precinct/agency client, onboarding, support, build requests | Recap email, tasks for that client, platform note |
| **Partner/Vendor** | Merchant processing, integrations, suppliers | Internal summary, tasks, follow-up email if we owe something |
| **Internal** | vyntec team only | Tasks, internal summary; no external email |

### Step 5: Extract
- **Executors:** chief-of-staff.
- **How:** Pull every item into the schema below. Rules:
  - An action item needs an **owner**. If the transcript is ambiguous, mark `owner: UNCLEAR` — do not assign by guess.
  - Dates are only set if stated or clearly implied ("by Friday" → that Friday). Otherwise `due: none — suggest`.
  - Separate **what we owe them** from **what they owe us**. What they owe us becomes a follow-up/waiting task, not their task.
  - Quote nothing sensitive (pricing concessions, payment details, personal info) into email drafts without Vinny's confirmation.
  - Flag anything that sounds like a legal or contractual commitment (NEEDS HUMAN).

**Extraction schema:**
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
- **Output:** Completed extraction.

### Step 6: Duplicate Check
- **Executors:** chief-of-staff.
- **How:** Search the task layer for open tasks with the same client/topic, Calendar for already-scheduled follow-ups, and the platform for the contact/opportunity (read operations only). Existing items get **updated or commented on**, not duplicated.
- **Output:** Each proposed item tagged `NEW` or `UPDATE [link]`.

### Step 7: Action Plan (Approval Gate)
- **Executors:** chief-of-staff presents; Vinny approves.
- **How:** One consolidated plan in the fixed format (Section 7a), grouped by system, each item numbered, saved as ONE review task `Review: Action plan — [Org] — [YYYY-MM-DD]` assigned to Vinny, with the extraction and every external email shown in full as a draft. Vinny replies with "approve all," "approve except 3, 7," or edits, or presses Approve / Reject in the cockpit.
- **Output:** Approved plan. **Nothing is created before this step** except the review task and the ledger row.

#### 7a. Action plan format (fixed)
| # | Action | System | Details | Executing agent | Approval tier | NEW / UPDATE |
|---|---|---|---|---|---|---|
| 1 | Create task | Task layer | `Send Precinct pricing deck — Acme County GOP` · due 2026-10-14 · High · evidence "…" | chief-of-staff | T1 | NEW |
| 2 | Deadline hold | Google Calendar | Vinny only, no guests | chief-of-staff | T1 | NEW |
| 3 | Contact note | Platform | date, 3-line summary, next step | head-of-sales-onboarding | T1 | NEW |
| 4 | Recap email | Gmail | draft shown in full below | head-of-sales-onboarding | draft T0 · send T2 | NEW |

Every row fills all columns. Approval tiers are defined in `CLAUDE.md` (T0 autonomous, T1 plan approval, T2 explicit yes).

### Step 8: Execute
- **Executors:** tasks and Calendar holds → chief-of-staff; prospect platform notes, stage and recap drafts → head-of-sales-onboarding; client platform notes and recap drafts → head-of-customer-relations (waiting-on items → client-liaison); partner and internal summaries → chief-of-staff; Drive filing → ops-admin; build requests → head-of-delivery; content ideas → vp-of-social.
- **Order:** tasks → Calendar → platform → Drive → Gmail drafts (tasks first so their links can go into the other records).

**Task standards**
- Assignee: **always Vinny Mele**, plus any other named owner.
- Name: `[Verb] [object] — [Client/Org]` (e.g., "Send Precinct pricing deck — Acme County GOP").
- Description: context sentence, the evidence quote, link to the filed meeting record.
- Due date: only if approved; otherwise leave blank and mark `needs-date`.
- Priority: Urgent (≤48h or revenue at risk), High (this week), Normal, Low.
- Tags: meeting type (`prospect` / `client` / `partner` / `internal`) + `from-meeting`.
- "Waiting on" items: one task named `Waiting: [item] — [Org]`, due on the expected date, so it surfaces for follow-up.
- Placement: per Section 11.

**Google Calendar standards**
- Follow-up meetings: title `[Org] × vyntec — [purpose]`, agenda in description, link to prior meeting record.
- Adding external guests sends an invite — requires explicit yes for that event.
- Deadline holds and prep blocks go on Vinny's calendar only, no guests.

**Platform standards**
- Add a note to the contact: date, 3-line summary, next step.
- Update opportunity stage only if the meeting clearly moved it; state the reason in the note.
- Never edit billing, payment, or subscription settings from this workflow.

**Google Drive filing**
- Path: `Meetings / [YYYY] / [Type] / [YYYY-MM-DD] [Org] — [Title]`
- Contents: extraction (Step 5) + links to everything created.

**Gmail standards**
- Created as **drafts** in Vinny's Gmail, threaded as a reply where a prior thread exists.
- Uses the templates in Section 9. Never names the platform vendor.

### Step 9: Confirm
- **Executors:** chief-of-staff.
- **How:** Short confirmation listing every item created, with links, plus any item that failed and why; ledger row updated.
- **Output:** Confirmation message.

### Step 10: Send
- **Executors:** Vinny (or an agent on an explicit "send it" for a specific draft).
- **When:** Recap emails same day as the meeting.
- **Output:** Sent email; "send recap" task closed.

## 7. Exceptions & Edge Cases

| Scenario | What to do |
|---|---|
| No transcript found | Ask Vinny to paste notes or a voice memo; don't reconstruct from the calendar invite alone. |
| Transcript quality poor / names garbled | Match against calendar attendees; list anything still unclear in Open Questions. |
| Owner of an action item unclear | Mark `UNCLEAR`, raise in the action plan. Never assign by guess. |
| Conflicting commitments across meetings | Flag both, link both, let Vinny decide. |
| Meeting was recorded but attendees didn't consent / sensitive topic | Don't file the full transcript; file the summary only and flag. |
| Pricing, discount, or contract terms discussed | Capture internally; exclude specifics from outgoing email unless Vinny confirms. Flag contractual language for review. |
| Payment details, card numbers, credentials mentioned | Never copy into any system. Note "sensitive info discussed — handle directly." |
| Follow-up time proposed but not agreed | Draft a scheduling email with 2–3 options instead of creating an event. |
| Existing task already covers the item | Comment on it with the update; don't duplicate. |
| Connector down or auth expired | Complete everything else, list the failed items, and keep them in the confirmation for retry. |
| Internal meeting with no actions | File summary only; no tasks created. |
| Meeting already in the processed-items ledger | Skip it and say so. |

### Failure rules
- A failed tool call is retried at most 2 times. Then the item is marked **NEEDS HUMAN** (task Blocked, with the error) and the run moves on to the other items. No loops.
- A failed item is never retried in a later step of the same run; it stays in the confirmation for Vinny.

## 8. Quality Checklist (run before presenting the plan)

- [ ] Correct meeting pulled; date and attendees match calendar
- [ ] Every action item has an owner or is marked UNCLEAR
- [ ] Ours vs. theirs separated
- [ ] No invented due dates
- [ ] Duplicate check done; UPDATE items linked
- [ ] Vinny Mele assigned on every task
- [ ] Email drafts contain no sensitive pricing/payment details unless confirmed, and never the platform vendor's name
- [ ] External invites flagged for explicit approval

## 9. Templates

### 9a. External recap email (Prospect / Client)
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

### 9b. Internal summary (Partner / Internal)
```
[Org] — [Title] — [Date]
Summary: [3–5 sentences]
Decisions: [...]
Our actions: [task — owner — due]
Waiting on: [item — who — by]
Risks/open questions: [...]
Links: [Task] [Drive record]
```

### 9c. Task description
```
From: [Meeting title] on [date] ([type])
Context: [one sentence]
Evidence: "[short transcript line]"
Record: [Drive link]
```

## 10. Trigger Prompts

- **Single meeting:** `Process my meeting with [person/org] from [today/date] per the meeting SOP.`
- **Batch:** `Process all my meetings from today per the meeting SOP.`
- **Pasted notes:** `Process these notes per the meeting SOP: [paste]`
- **Fast mode (internal only):** `Process [meeting] — tasks only, no emails.`

## 11. Configuration To Fill In

These need real values before the SOP runs cleanly. The four task-list rows replace the source's ClickUp lists: each is now a value of the task's Client and Department fields (Task layer).

| Setting | Value |
|---|---|
| Task placement — Precinct prospects | `[Client / Department value]` |
| Task placement — Clients | Client = the Client value given in `clients/<slug>/CLAUDE.md` |
| Task placement — Partners/Vendors | `[Client / Department value]` |
| Task placement — Internal / vyntec ops | Client = `vyntec internal` |
| Platform location (sub-account) for Precinct pipeline | `[location]` |
| Platform pipeline + stage names | `[pipeline: stages]` |
| Drive root folder for meeting records | `VYNTEC Internal / Meetings` — https://drive.google.com/drive/folders/1t4e_Hz1I6kuyjlrwMK1fgvimJwR4_gGP (folder ID `1t4e_Hz1I6kuyjlrwMK1fgvimJwR4_gGP`, owner info@vyntec.co) |
| Primary transcript source | Granola / Zoom |
| Email signature block | `[signature]` |

## 12. Metrics

| Metric | Target | How to measure |
|---|---|---|
| Time from meeting end to processed | < 24h (goal < 4h) | Ledger row date (or Drive record timestamp) vs. calendar end |
| Recap emails sent same day (external) | ≥ 90% | Gmail sent vs. external meetings |
| Action items with owner + due date | ≥ 95% | Tasks tagged `from-meeting`, `needs-date` count |
| Duplicate tasks created | 0 | Weekly audit |
| "Waiting on" items followed up by due date | 100% | Overdue `Waiting:` tasks |

## 13. Weekly Audit (Fridays, 15 min)

1. Filter tasks by `from-meeting` → close done items, date anything marked `needs-date`.
2. Check overdue `Waiting:` tasks → draft nudges (sending is T2).
3. Compare the week's calendar against the ledger and Drive records → process any missed meetings.
4. Note any step in this SOP that caused friction → update the SOP.

## 14. Related

- Task assignment rule: always assign Vinny Mele
- Precinct sales process / platform pipeline documentation
- Partner contact records (payment processing)
- `sops/work-tracking.md`, `sops/platform-radar.md`

## Task layer

Tasks live in the Notion database **vyntec Tasks**; the processed-items ledger is the Notion database **Processed Items** (IDs, statuses and properties in `sops/work-tracking.md`). Step 3 queries Processed Items by the meeting's source ID. Step 7 creates the review task (Status = Needs your review, Source = Meeting, Department = Chief of Staff, Executing agent = chief-of-staff, Approval tier = T1 Plan approval, Assignee = Vinny Mele) and one Processed Items row (Source = Granola/Zoom/Pasted, Item ID = the meeting ID, Result = Review task created, Task = the review task's URL). Approval is Status = Approved. Tasks from Step 8 are created Queued with Client, Department and Executing agent set; `Waiting:` tasks are created Blocked. Tags and priority from Section 8 go in the task body until the database has properties for them.
