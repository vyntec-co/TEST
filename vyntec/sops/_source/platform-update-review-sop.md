# SOP: Platform Update Review (Platform Radar)

**Owner:** Vinny Mele (vyntec) | **Executor:** Claude (VYNTEC Chief of Staff project) + Vinny for decisions
**Version:** 1.2 | **Last Updated:** 2026-10-01 | **Review Cadence:** Monthly for the first quarter, then quarterly

---

## 1. Purpose

The underlying platform ships a release almost every day. This SOP turns each release into two decisions: does it improve Vyntec or a client's build, and is it worth publishing as vyntec authority content. Nothing reaches a client account or the public until Vinny approves it.

## 2. Scope

**In scope:** every item in the platform changelog feed; the Vyntec agency sub-account; all client sub-accounts (vyntec direct and Union OS); vyntec-branded blog, social and website content.
**Out of scope:** ArtistHQ and Precinct until they have live sub-accounts.

**Pricing rule:** vyntec does full operating-system builds, minimum $500/month. Features are never priced, sold or upsold individually. A release that helps a client is included in their existing package at no extra charge.
**Exception:** a capability that carries a fixed monthly cost to vyntec (e.g. HIPAA) is priced to the client as cost plus margin, either as a line item or by raising that client's monthly rate. HIPAA also requires business associate agreements in place before any patient data enters the system.

**White-label rule:** vyntec is 100% white label. Nothing that reaches a client, a Union OS member or the public ever names HighLevel, GoHighLevel, LeadConnector or any underlying vendor. Every capability is presented as vyntec's own. The vendor name appears only on the internal dashboard, as a source link.

**Byline rule:** every blog and social post is bylined and published by a vyntec department, never an individual:
- vyntec Marketing, Advertising, Branding & Development
- vyntec Sales & Onboarding
- vyntec Customer Relations

Each department keeps a consistent voice. The vyntec name appears on every piece.

## 3. Systems

| System | Role | Claude's permission |
|---|---|---|
| Changelog RSS feed | Source of releases, ~10 latest | Read |
| Platform Radar dashboard (claude.ai artifact) | Analysis, content angles, website mapping, decisions, notes | Write analysis; Vinny writes decisions |
| Vyntec sub-account | Client Account records, pipelines, tasks, blog and social drafts | Update after approval; drafts only, never published by Claude |
| vyntec.co website | Features and Industries sections | Copy changes prepared by Claude; applied by Vinny or by Claude in the browser with Vinny's approval |
| Client sub-accounts | Records, fields, tags, custom values, deals, tasks | Update after approval; workflows/funnels/snapshots are built by Vinny from Claude's steps |
| ClickUp | Larger projects only | Create after approval, always assigned to Vinny Mele |

## 4. Process

```
Weekday 7:45am ET
    │
    ▼
[1] Claude pulls the feed; keeps only items not already on the dashboard
    │
    ▼
[2] Claude rates each item: Vyntec impact, action, effort, affected accounts,
    and a content angle (audiences, blog title, social hook, website sections)
    │
    ▼
[3] Dashboard: items land in "Needs review" (no-impact items auto-skipped)
    │
    ▼
[4] Vinny reviews (≈5 min): Approve · Skip · add a note   ◄── DECISION GATE
    │
    ▼
[5] Approved items acted on when Vinny asks Claude:
      Adopt internally    → task + note in Vyntec account
      Include for clients → Client Account updated, Account Management deal
                            (scheduled rollout, no charge), task
      Content package     → blog draft with visuals, social drafts with
                            graphic/video, website copy for each mapped section,
                            all bylined to a vyntec department
      Larger project      → ClickUp task
    │
    ▼
[6] Vinny edits and publishes content; marks Done when shipped
```

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
| Feed or dashboard unreachable | Run stops with no partial writes; summary names what failed |
| Labs or beta feature | Action = Test first; test in the Vyntec account before any client; no public content until it is out of beta |
| Release carries a fixed vendor cost (e.g. HIPAA) | Flag it; price as cost plus margin per the pricing exception |
| Change needs a workflow, funnel or snapshot edit | Claude writes the build steps; Vinny builds |
| Release affects billing, payments or phone compliance | Flag in the note; never changed automatically |
| Content draft mentions the vendor or a vendor-only term | Rewrite before it reaches Vinny; never publish |
| Public claim about certifications, uptime or results | Only claims vyntec can substantiate; certifications described as the infrastructure's, never as vyntec's own unless vyntec holds them |
| New client sub-account added | Add it to the dashboard's account roster (ask Claude) |

## 7. Weekly check (Fridays, 5 min)

1. Clear anything still in Needs review.
2. Look at Approved: ship it, ask Claude to act on it or build its content package, or skip it.
3. Mark shipped items Done.

## 8. Related

- Vyntec Account Blueprint (Client Account object, pipelines, tags)
- Meeting Transcript → Systems Implementation SOP
- ClickUp rule: always assign Vinny Mele
