# SOP: Platform Update Review (Platform Radar)

**Owner:** head-of-delivery | **Content:** vp-of-social | **Approver:** Vinny Mele (vyntec) | **Executors:** named per step below
**Version:** 2.0 (rewritten from `_source/platform-update-review-sop.md` v1.2; review queue and task layer replace the claude.ai Radar dashboard and ClickUp) | **Last Updated:** 2026-10-10 | **Review Cadence:** Monthly for the first quarter, then quarterly

---

## 1. Purpose

The underlying platform ships a release almost every day. This SOP turns each release into two decisions: does it improve Vyntec or a client's build, and is it worth publishing as vyntec authority content. Nothing reaches a client account or the public until Vinny approves it.

## 2. Scope

**In scope:** every item in the platform changelog feed; the Vyntec agency sub-account; all client sub-accounts (vyntec direct and Union OS); vyntec-branded blog, social and website content.
**Out of scope:** ArtistHQ and Precinct until they have live sub-accounts.

**Pricing rule:** vyntec does full operating-system builds, minimum $500/month. Features are never priced, sold or upsold individually. A release that helps a client is included in their existing package at no extra charge.
**Exception:** a capability that carries a fixed monthly cost to vyntec (e.g. HIPAA) is priced to the client as cost plus margin, either as a line item or by raising that client's monthly rate. HIPAA also requires business associate agreements in place before any patient data enters the system.

**White-label rule:** vyntec is 100% white label. Nothing that reaches a client, a Union OS member or the public ever names the underlying vendor or its products (the vendor names the mod refuses are listed in `vyntec-hq/hooks/register.js`). Every capability is presented as vyntec's own. The vendor name appears only on the internal review item, as a source link.

**Byline rule:** every blog and social post is bylined and published by a vyntec department, never an individual:
- vyntec Marketing, Advertising, Branding & Development
- vyntec Sales & Onboarding
- vyntec Customer Relations

Each department keeps a consistent voice. The vyntec name appears on every piece.

## 3. Systems

| System | Role | Permission |
|---|---|---|
| Changelog RSS feed | Source of releases, ~10 latest | Read |
| Review queue (Task layer) | One review item per release: analysis, content angle, website mapping, Vinny's decision and notes | Agents write analysis (T0); Vinny writes decisions |
| Processed-items ledger (Task layer) | Every release already handled, so none is reviewed twice | Agents write (T0) |
| Vyntec sub-account | Client Account records, pipelines, tasks, blog and social drafts | Update after approval (T1); drafts only, never published by an agent |
| vyntec.co website | Features and Industries sections | Copy changes prepared by agents (T0); applied by Vinny, or by an agent in the browser with Vinny's explicit yes (T2) |
| Client sub-accounts | Records, fields, tags, custom values, deals, tasks | Update after approval (T1); workflows/funnels/snapshots are built by Vinny from the agent's steps |
| Task layer | Larger projects | Create after approval (T1), always assigned to Vinny Mele |

## 4. Process

```
Weekday 7:45am ET (intended schedule; not scheduled until the meeting SOP dry run passes)
    │
    ▼
[1] Pull the feed; keep only items not already in the ledger
    │
    ▼
[2] Rate each item: Vyntec impact, action, effort, affected accounts,
    and a content angle (audiences, blog title, social hook, website sections)
    │
    ▼
[3] Review queue: items land in "Needs your review" (no-impact items auto-skipped)
    │
    ▼
[4] Vinny reviews (≈5 min): Approve · Skip · add a note   ◄── DECISION GATE
    │
    ▼
[5] Approved items acted on when Vinny asks:
      Adopt internally    → task + note in Vyntec account
      Include for clients → Client Account updated, Account Management deal
                            (scheduled rollout, no charge), task
      Content package     → blog draft with visuals, social drafts with
                            graphic/video, website copy for each mapped section,
                            all bylined to a vyntec department
      Larger project      → project task
    │
    ▼
[6] Vinny edits and publishes content; marks Done when shipped
```

| # | Step | Executors | Output |
|---|---|---|---|
| 1 | Pull the feed, drop items already in the ledger | head-of-delivery | new items |
| 2 | Rate each item | head-of-delivery (impact, action, effort, accounts); platform-strategist (content angle) | ratings |
| 3 | Queue for review; log every item in the ledger (no-impact items as Skipped) | head-of-delivery | review items + ledger rows |
| 4 | Approve · Skip · note | Vinny (cockpit buttons or the review item) | decision |
| 5a | Adopt internally | head-of-delivery → account-architect / workflow-engineer | spec and task (T1) |
| 5b | Include for clients | head-of-delivery → head-of-customer-relations (Client Account note, Account Management deal) | T1 |
| 5c | Content package | vp-of-social → platform-strategist, social-copywriter, art-director, video-producer | drafts (T0); publishing T2 |
| 5d | Larger project | head-of-delivery | project task (T1) |
| 6 | Edit, publish, mark Done | Vinny | shipped |

### Action plan format (fixed)
Step 5 work is shown to Vinny as a plan before anything is executed:

| # | Action | System | Details | Executing agent | Approval tier |
|---|---|---|---|---|---|
| 1 | Add custom field | Vyntec sub-account | field name, type, folder | account-architect | T1 |
| 2 | Blog draft | Vyntec sub-account (draft) | title, byline: vyntec Marketing, Advertising, Branding & Development | social-copywriter | draft T0 · publish T2 |

## 5. Rating rules

- **Vyntec impact** (High / Medium / Low / None): value to how vyntec runs, builds for clients, and earns attention. Updates that support the account restructure (Client Account object, lifecycle pipelines, tag system) rate higher.
- **Action:** Adopt internally · Include for clients · Test first (any Labs/beta feature) · Watch. There is no paid-upgrade action.
- **Effort:** S (under an hour) · M (a few hours) · L (a project).
- **Accounts:** only accounts that specifically benefit, judged by their industry, rated High or Medium with one line why. If benefit depends on an unknown, the line says "Confirm … first".
- **Content angle:** the industries or departments it serves, one blog title, one social hook, and the vyntec.co Features/Industries sections it belongs on. Written as vyntec's capability; never names the vendor.
- Skipped items never return. Notes left by Vinny inform later runs.

## 6. Exceptions

| Scenario | What to do |
|---|---|
| Feed or review queue unreachable | Run stops with no partial writes; summary names what failed |
| Labs or beta feature | Action = Test first; test in the Vyntec account before any client; no public content until it is out of beta |
| Release carries a fixed vendor cost (e.g. HIPAA) | Flag it; price as cost plus margin per the pricing exception |
| Change needs a workflow, funnel or snapshot edit | The agent writes the build steps. If `sops/build-capabilities.md` marks every step API, an agent builds it in the vyntec Test Lab first after Vinny approves the task; Browser or Human-only steps stay a click path for Vinny |
| Release affects billing, payments or phone compliance | Flag in the note; never changed automatically |
| Content draft mentions the vendor or a vendor-only term | Rewrite before it reaches Vinny; never publish |
| Public claim about certifications, uptime or results | Only claims vyntec can substantiate; certifications described as the infrastructure's, never as vyntec's own unless vyntec holds them |
| New client sub-account added | Add a `clients/<slug>/CLAUDE.md` and a Client value for it (Task layer) |

### Failure rules
- A failed tool call is retried at most 2 times. Then the item is marked **NEEDS HUMAN** (task Blocked, with the error) and the run moves on. No loops.
- Feed or review queue unreachable: the run stops with no partial writes (above).

## 7. Weekly check (Fridays, 5 min)

1. Clear anything still in Needs your review.
2. Look at Approved: ship it, ask an agent to act on it or build its content package, or skip it.
3. Mark shipped items Done.

## 8. Related

- Vyntec Account Blueprint (Client Account object, pipelines, tags)
- Meeting Transcript → Systems Implementation SOP (`sops/meeting-to-action.md`)
- Task rule: always assign Vinny Mele

## Task layer

The review queue is the Notion database **vyntec Tasks**: one task per release (Source = Platform radar, Department = Delivery, Executing agent = head-of-delivery, Status = Needs your review, Approval tier = T1 Plan approval, Assignee = Vinny Mele; body = rating, content angle, website mapping, source link). Content packages are tasks with Department = Social, Executing agent = vp-of-social. Approve = Status Approved; Skip = Status Done with "Skipped" in the body. Vinny's notes go in the task body. The ledger is the Notion database **Processed Items** (Source = Changelog, Item ID = the feed item's guid or link, Result = Review task created or Skipped). Larger projects are tasks with Approval tier T1. IDs: `sops/work-tracking.md`.
