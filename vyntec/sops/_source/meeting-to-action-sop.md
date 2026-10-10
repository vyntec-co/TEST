# SOP: Meeting Transcript → Systems Implementation

**Owner:** Vinny Mele (vyntec) | **Executor:** Claude (VYNTEC Chief of Staff project) + Vinny for approvals
**Version:** 1.0 | **Last Updated:** 2026-09-22 | **Review Cadence:** Monthly for the first quarter, then quarterly

---

## 1. Purpose

Every virtual meeting produces commitments, decisions, and follow-ups that currently live in a transcript nobody rereads. This SOP turns a finished meeting into concrete system updates — ClickUp tasks, calendar events, email drafts, CRM notes, and a filed record — within 24 hours, with nothing sent externally without approval.

The goal is simple: **no commitment made on a call gets lost, and nothing goes out in Vinny's name that he hasn't seen.**

## 2. Scope

**In scope:** Zoom, Google Meet, and phone calls captured by Granola, Zoom transcripts/AI summaries, or pasted notes. Covers Precinct prospect and client calls, partner/vendor calls (e.g., payment processing, GHL-related), and internal vyntec meetings.

**Out of scope:** In-person meetings with no notes (log manually), legal or contract negotiation details that need counsel review (flag only), and anything involving payments, card data, or account credentials (never entered into any system by Claude).

## 3. Systems Map

| System | Connector | What it receives | Claude's permission level |
|---|---|---|---|
| Granola | Granola MCP | Source transcript + summary | Read |
| Zoom | Zoom for Claude MCP | Source transcript, recordings, meeting assets | Read |
| ClickUp | ClickUp MCP | Tasks, subtasks, comments, due dates | Create/update after batch approval |
| Google Calendar | Google Calendar MCP | Follow-up meetings, deadline holds, prep blocks | Create after approval; invites to external guests need explicit yes |
| Gmail | Gmail MCP | Recap and follow-up emails | **Drafts only.** Sending requires explicit yes per email |
| GHL / LeadConnector | leadconnector MCP | Contact notes, opportunity stage, tags | Update after approval |
| Google Drive | Google Drive MCP | Filed meeting record | Create after approval |
| Notion (optional) | Notion MCP | Meeting log database, if used | Create after approval |

## 4. RACI

| Step | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Capture transcript | Recording tool (Granola/Zoom) | Vinny | — | — |
| Trigger processing | Vinny | Vinny | — | — |
| Extract & classify | Claude | Vinny | — | — |
| Review action plan | Vinny | Vinny | Meeting attendees (if unclear) | — |
| Create tasks / events / CRM updates | Claude | Vinny | — | Task assignees |
| Send external emails | Vinny (approves) / Claude (drafts) | Vinny | — | External attendees |
| File record | Claude | Vinny | — | — |
| Weekly audit | Vinny | Vinny | Claude | — |

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
[3] Pull & verify ── right meeting? attendees? date?
    │
    ▼
[4] Classify ── Prospect | Client | Partner/Vendor | Internal
    │
    ▼
[5] Extract ── decisions, action items, dates, open questions, CRM facts
    │
    ▼
[6] Duplicate check ── existing ClickUp tasks, calendar events, GHL records
    │
    ▼
[7] ACTION PLAN ── one batch shown to Vinny ◄── APPROVAL GATE
    │         │
    │     edits / rejects → revise → back to [7]
    ▼
[8] Execute ── ClickUp → Calendar → GHL → Drive → Gmail drafts
    │
    ▼
[9] Confirm ── links to everything created; emails await send approval
    │
    ▼
[10] Send ── only emails Vinny explicitly approves
```

## 6. Detailed Steps

### Step 1: Capture
- **Who:** Recording tool
- **When:** Every external meeting and any internal meeting with decisions.
- **How:** Granola running, or Zoom cloud recording + transcript enabled. If neither, Vinny pastes notes or a voice-memo transcript into chat.
- **Output:** A transcript or summary accessible by connector or in chat.

### Step 2: Trigger
- **Who:** Vinny
- **When:** Same day as the meeting — target within 4 hours, hard limit 24 hours.
- **How:** In the Chief of Staff project, use the trigger prompt in Section 10. Multiple meetings can be batched ("process all my meetings from today").
- **Output:** Processing request.

### Step 3: Pull & Verify
- **Who:** Claude
- **How:** Pull from Granola first, then Zoom, then fall back to pasted content. Cross-check against the Google Calendar event for title, date, and attendee emails. If two meetings match, ask which one — never guess.
- **Output:** Confirmed source meeting with attendee list.

### Step 4: Classify
- **Who:** Claude

| Type | Signals | Default outputs |
|---|---|---|
| **Prospect** | Precinct demo, discovery, pricing talk, new org | Recap email, GHL note + stage check, follow-up meeting, ClickUp tasks |
| **Client** | Existing Precinct/agency client, onboarding, support, build requests | Recap email, ClickUp tasks in client list, GHL note |
| **Partner/Vendor** | Merchant processing, integrations, suppliers | Internal summary, ClickUp tasks, follow-up email if we owe something |
| **Internal** | vyntec team only | ClickUp tasks, internal summary; no external email |

### Step 5: Extract
- **Who:** Claude
- **How:** Pull every item into the schema below. Rules:
  - An action item needs an **owner**. If the transcript is ambiguous, mark `owner: UNCLEAR` — do not assign by guess.
  - Dates are only set if stated or clearly implied ("by Friday" → that Friday). Otherwise `due: none — suggest`.
  - Separate **what we owe them** from **what they owe us**. What they owe us becomes a follow-up/waiting task, not their task.
  - Quote nothing sensitive (pricing concessions, payment details, personal info) into email drafts without Vinny's confirmation.
  - Flag anything that sounds like a legal or contractual commitment.

**Extraction schema:**
```
MEETING: [title] | [date] | [type] | [source: Granola/Zoom/pasted]
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
- **Who:** Claude
- **How:** Search ClickUp for open tasks with the same client/topic, Calendar for already-scheduled follow-ups, and GHL for the contact/opportunity. Existing items get **updated or commented on**, not duplicated.
- **Output:** Each proposed item tagged `NEW` or `UPDATE [link]`.

### Step 7: Action Plan (Approval Gate)
- **Who:** Claude presents, Vinny approves
- **How:** One consolidated plan, grouped by system, each item numbered. Vinny replies with "approve all," "approve except 3, 7," or edits. External emails are shown in full as drafts.
- **Output:** Approved plan. **Nothing is created before this step.**

### Step 8: Execute
- **Who:** Claude
- **Order:** ClickUp → Calendar → GHL → Drive → Gmail drafts (tasks first so their links can go into the other records).

**ClickUp standards**
- Assignee: **always Vinny Mele**, plus any other named owner.
- Name: `[Verb] [object] — [Client/Org]` (e.g., "Send Precinct pricing deck — Acme County GOP").
- Description: context sentence, the evidence quote, link to the filed meeting record.
- Due date: only if approved; otherwise leave blank and tag `needs-date`.
- Priority: Urgent (≤48h or revenue at risk), High (this week), Normal, Low.
- Tags: meeting type (`prospect` / `client` / `partner` / `internal`) + `from-meeting`.
- "Waiting on" items: one task named `Waiting: [item] — [Org]`, due on the expected date, so it surfaces for follow-up.
- List: per the list map in Section 11.

**Google Calendar standards**
- Follow-up meetings: title `[Org] × vyntec — [purpose]`, agenda in description, link to prior meeting record.
- Adding external guests sends an invite — requires explicit yes for that event.
- Deadline holds and prep blocks go on Vinny's calendar only, no guests.

**GHL / LeadConnector standards**
- Add a note to the contact: date, 3-line summary, next step.
- Update opportunity stage only if the meeting clearly moved it; state the reason in the note.
- Never edit billing, payment, or subscription settings from this workflow.

**Google Drive filing**
- Path: `Meetings / [YYYY] / [Type] / [YYYY-MM-DD] [Org] — [Title]`
- Contents: extraction (Step 5) + links to everything created.

**Gmail standards**
- Created as **drafts** in Vinny's Gmail, threaded as a reply where a prior thread exists.
- Uses the templates in Section 9.

### Step 9: Confirm
- **Who:** Claude
- **How:** Short confirmation listing every item created, with links, plus any item that failed and why.
- **Output:** Confirmation message.

### Step 10: Send
- **Who:** Vinny (or Claude on an explicit "send it" for a specific draft)
- **When:** Recap emails same day as the meeting.
- **Output:** Sent email; ClickUp "send recap" task closed.

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

## 8. Quality Checklist (run before presenting the plan)

- [ ] Correct meeting pulled; date and attendees match calendar
- [ ] Every action item has an owner or is marked UNCLEAR
- [ ] Ours vs. theirs separated
- [ ] No invented due dates
- [ ] Duplicate check done; UPDATE items linked
- [ ] Vinny Mele assigned on every ClickUp task
- [ ] Email drafts contain no sensitive pricing/payment details unless confirmed
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
Links: [ClickUp] [Drive record]
```

### 9c. ClickUp task description
```
From: [Meeting title] on [date] ([type])
Context: [one sentence]
Evidence: "[short transcript line]"
Record: [Drive link]
```

## 10. Trigger Prompts

Use in the VYNTEC Chief of Staff project:

- **Single meeting:** `Process my meeting with [person/org] from [today/date] per the meeting SOP.`
- **Batch:** `Process all my meetings from today per the meeting SOP.`
- **Pasted notes:** `Process these notes per the meeting SOP: [paste]`
- **Fast mode (internal only):** `Process [meeting] — tasks only, no emails.`

## 11. Configuration To Fill In

These need real values before the SOP runs cleanly:

| Setting | Value |
|---|---|
| ClickUp list — Precinct prospects | `[list name / ID]` |
| ClickUp list — Clients | `[list name / ID]` |
| ClickUp list — Partners/Vendors | `[list name / ID]` |
| ClickUp list — Internal / vyntec ops | `[list name / ID]` |
| GHL location (sub-account) for Precinct pipeline | `[location]` |
| GHL pipeline + stage names | `[pipeline: stages]` |
| Drive root folder for meeting records | `[folder link]` |
| Primary transcript source | Granola / Zoom |
| Email signature block | `[signature]` |

## 12. Metrics

| Metric | Target | How to measure |
|---|---|---|
| Time from meeting end to processed | < 24h (goal < 4h) | Drive record timestamp vs. calendar end |
| Recap emails sent same day (external) | ≥ 90% | Gmail sent vs. external meetings |
| Action items with owner + due date | ≥ 95% | ClickUp `from-meeting` tag, `needs-date` count |
| Duplicate tasks created | 0 | Weekly audit |
| "Waiting on" items followed up by due date | 100% | ClickUp overdue `Waiting:` tasks |

## 13. Weekly Audit (Fridays, 15 min)

1. Filter ClickUp by `from-meeting` → close done items, date anything tagged `needs-date`.
2. Check overdue `Waiting:` tasks → send nudges.
3. Compare the week's calendar against Drive records → process any missed meetings.
4. Note any step in this SOP that caused friction → update the SOP.

## 14. Related

- ClickUp task assignment rule: always assign Vinny Mele
- Precinct sales process / GHL pipeline documentation
- Partner contact records (payment processing)
