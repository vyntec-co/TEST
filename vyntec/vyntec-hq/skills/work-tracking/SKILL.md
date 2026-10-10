---
name: work-tracking
description: How vyntec agents log work in Notion (vyntec Tasks statuses, properties, dedupe, the Processed Items ledger and its IDs). Use whenever working on a vyntec client or internal task. Replaces the old ClickUp-based vyntec-work-tracking skill.
---

<!-- Same text as ~/vyntec/sops/work-tracking.md. Edit both together. -->

# Work tracking (Notion)

**Owner:** chief-of-staff · **Applies to:** every agent, every session. Replaces ClickUp, which is dropped (free tier: 100 API calls).
Notion holds **tasks and projects only**. Client facts stay in the platform sub-accounts and `clients/<slug>/CLAUDE.md`. Scheduling stays in Google Calendar.

## Databases
| Database | Notion URL | Data source (for queries) |
|---|---|---|
| vyntec Tasks | https://app.notion.com/p/131b4b688c344a0fa69cfc7c09f7fd7a | `collection://7f6f9759-bbbf-45aa-ab9a-b2448918a625` |
| Processed Items | https://app.notion.com/p/421970baa0fb406eb387a818219abe5e | `collection://a2b7a1b6-92a0-4a9c-bf0f-46d79dca4435` |

Assignee for Vinny Mele: Notion user `user://265d872b-594c-8127-b2e6-0002989f09a5` (shown as "Info Team", info@vyntec.co; the only workspace member found. Change it if Vinny has a separate Notion user).

## vyntec Tasks: statuses
| Status | Meaning | Who sets it |
|---|---|---|
| Queued | Logged, not started | any agent |
| In progress | An agent is working on it | executing agent |
| Needs your review | A plan, draft or spec is ready for Vinny | executing agent |
| Approved | Vinny approved; the plan may be executed (T1) | Vinny only (cockpit Approve button or Notion) |
| Done | Shipped and verified (client builds need a qa-lead PASS or Vinny's say-so) | executing agent |
| Blocked | Stuck on a decision; NEEDS HUMAN items live here | any agent |
| Waiting on someone | Waiting on another person's reply or work; Follow up holds the nudge date | any agent |

Cockpit Reject sets the task back to **In progress** so the agent revises it.

## Properties
Name (`[Verb] [object] — [Client/Org]`; waiting items `Waiting: [item] — [Org]`; review items `Review: [what] — [Org] — [YYYY-MM-DD]`) · Status · Department (Chief of Staff, Delivery, Social, Sales & Onboarding, Customer Relations, Ops) · Executing agent (agent name) · Client (`vyntec internal`, or the "Notion Client value" in `clients/<slug>/CLAUDE.md`; add an option when a client file is added) · Source (Meeting, Platform radar, Request, Agent) · Due (only if stated or approved; otherwise blank and say `needs-date` in the body) · Approval tier (T0 Autonomous, T1 Plan approval, T2 Explicit yes) · Assignee (always Vinny Mele, plus any named owner) · Task ID (auto, VT-n).

Page body: context sentence, evidence quote (≤1 line), links, and a log of comments: `Decision: <what> — <who>, <date>`, `Draft ready for approval: <where>`, `Blocked: <what> — waiting on <whom> since <date>`.

## How agents log work
1. **Start:** query open tasks for the client (`Status != Done`) and give a 3–5 line status: in progress, blocked/waiting, awaiting review, overdue.
2. **Dedupe before create:** search vyntec Tasks for 2–3 key words (org + object). If a task covers it, update it; otherwise create one. Report each as created or updated.
3. **Anchor:** set the task In progress and work under it.
4. **During work:** scope creep → new task linked in the body, `scope-creep` noted; cost or legal impact (HIPAA, new paid tools, contract terms) → Blocked with NEEDS HUMAN and who decides; feature ideas → task with `feature-enhancement` in the body; waiting on a client → `Waiting:` task with the expected date and a Gmail draft (never sent); decisions → `Decision:` line.
5. **End:** done → Done with a one-line summary; needs Vinny's eyes → Needs your review; partly done → stays In progress with what's left; end the reply with a **Tracking** line naming tasks created, updated, done, blocked.
6. **Platform work needs Approved:** the mod refuses platform writes unless an Approved task exists for the active client.

## Processed Items (ledger)
Every SOP run writes one row per source item it handled: Name (title), Source (Granola, Zoom, Pasted, Changelog), Item ID (the source's ID), Date, Result (Review task created, Skipped, Done, NEEDS HUMAN), Task (URL of the task it created). Before processing, query by Item ID: an item already in the ledger is never processed again. The ledger is in Notion, not on disk, so cloud scheduled runs can read it.

## Fixed platform values (internal)
- Vyntec agency sub-account locationId: VC4vU19aLPfOwqREsc8x. Support Ticket pipeline: O0jVXJBBYlj41yxerbGF (Support Ticket Submitted → Support In Progress → Complete).
- Client sub-account IDs are in each `clients/<slug>/CLAUDE.md`.

## Rules
- **Tiers decide what runs on its own.**
  - **T0 Autonomous:** internal notes (including an internal note on a client's platform record), research, filing, and Notion updates. These run and are logged on the task, with no review.
  - **T1 Plan approval:** client-account builds (fields, tags, stages, forms, calendars, pipelines) and Gmail drafts. A build runs only after Vinny sets the task Approved. A draft is created, never sent, and the task goes to Needs your review.
  - **T2 Explicit yes:** anything sent, published, or touching money, billing or payments (also deletes, invites to external guests, credentials, a client's live build). Never automatic: Vinny says yes to the specific item.
  - Pick the lowest tier that covers every step of the task. Unsure → the higher tier.
- **Every task needs a date:** set Due (only from a stated or approved date), or tick No date. The mod refuses a new task with neither. The morning brief proposes dates for undated tasks and marks each one "suggested"; it never invents a deadline.
- **Waiting on someone:** for anything blocked on another person. Set Follow up (the date they promised, or 7 days out). On that day the morning brief drafts a nudge.
- **Rollovers** counts how many times a calendar block for the task was missed. **Outcome** records Vinny's verdict on a review item: Approved as-is, Edited, Rejected.
- Creating and updating Notion tasks and ledger rows is T0 (reversible). Never send, publish, invite, or change billing, payments or credentials as part of tracking.
- Never write secrets into a task. If one was shared, create a task "Rotate exposed <credential> — <Client>" without the value.
- If Notion is unreachable: finish the work, retry at most 2 times, then list in the Tracking line what still needs logging.

## Definition of done (client work)
A client task (Client is not `vyntec internal`) is Done only when all of these hold. The mod refuses Status Done otherwise.
- **QA = PASS**, set after the qa-lead agent checked the work.
- **Evidence** says what proved it: test-contact results, a live URL check, or numbers that match the source.
- **Client approval**, when **Needs client approval** is ticked: the client's words with the date, or a link to their message.

## Account builds (phase 4)
- **Read only outside the Test Lab.** Client sub-accounts take list/get/search calls only this phase. Writes run in the vyntec Test Lab (`clients/test-lab/CLAUDE.md`) first; see `sops/build-capabilities.md` for what is API, Browser or Human only.
- **Name the task.** Every platform write puts its `VT-n` in `reason`. The mod appends a row to `clients/<slug>/changelog.md`: time, agent, task, operation, what changed, how to undo it.
- **Bulk writes** (10 or more records) need a backup first: `clients/<slug>/backups/<VT-n>-<what>.json`, the records as they were.
- **Assets:** a file is placed only if it has a row in `clients/<slug>/assets.md` with usage rights filled in.
- **Go-live gate (T2):** switching something on for real people (a workflow enrollment, a redirect, a published blog or social post, anything set to published, scheduled or active) needs its own review item `Go live: <what> — <client>`, Approved by Vinny. Approval of the build task does not cover it.
- **Gates:** a client file's Gates section lists open blockers (A2P, HIPAA, legal sign-off). Work that depends on an open gate goes to Blocked with `NEEDS HUMAN: <gate> — <who decides>`.
- **One session per account:** the first write takes a lock on the account; another session waits until the lock is released (session end or 30 minutes with no write). The Team tab shows held locks.
