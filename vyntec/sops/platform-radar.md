# SOP: Platform Radar (platform update review)

**Owner:** head-of-delivery · **Content owner:** vp-of-social · **Approver:** Vinny Mele · **Version:** 2.0 (from 1.2, 2026-10-01; task layer moved off ClickUp) · **Review:** monthly for the first quarter, then quarterly

## 1. Purpose
The underlying platform ships a release almost every day. Each release becomes two decisions: does it improve vyntec or a client's build, and is it worth publishing as vyntec authority content. Nothing reaches a client account or the public until Vinny approves it.

## 2. Scope
In: every item in the platform changelog feed; the Vyntec agency sub-account; all client sub-accounts (vyntec direct and Union OS); vyntec-branded blog, social and website content.
Out: ArtistHQ and Precinct until they have live sub-accounts.
Rules that apply here (from `CLAUDE.md`): pricing floor and no feature upselling (a release that helps a client is included in their package at no extra charge); HIPAA-type fixed-cost exception (cost plus margin, BAAs first); white label (nothing reaching a client, a Union OS member or the public names the vendor; the vendor name appears only on the internal dashboard as a source link); department bylines.

## 3. Systems
| System | Role | Tier |
|---|---|---|
| Changelog RSS feed | source of releases, ~10 latest | read (T0) |
| Platform Radar dashboard (claude.ai artifact) | analysis, content angles, website mapping; Vinny writes decisions | analysis T0 |
| Task layer | review items, ledger, larger projects | T0 |
| Vyntec sub-account | Client Account records, pipelines, tasks, blog and social drafts | T1; drafts only, never published by an agent |
| vyntec.co website | Features and Industries sections | copy prepared T0; applied by Vinny, or by an agent in the browser on T2 |
| Client sub-accounts | records, fields, tags, custom values, deals, tasks | T1; workflows, funnels and snapshots are built by Vinny from the agent's steps |

## 4. Steps
| # | Step | Executor | Output |
|---|---|---|---|
| 1 | Pull the feed (intended schedule: weekdays 7:45am ET; not scheduled yet) | head-of-delivery | items not already in the ledger |
| 2 | Rate each item (rules below) | head-of-delivery; content angle by platform-strategist | rating + content angle per item |
| 3 | Queue for review; no-impact items are logged Skipped, never queued | head-of-delivery | review items + ledger rows |
| 4 | Decide: Approve · Skip · add a note (≈5 min) | Vinny | decision |
| 5a | Adopt internally → task + note in the Vyntec account | head-of-delivery → account-architect or workflow-engineer | spec, T1 |
| 5b | Include for clients → Client Account updated, Account Management deal (scheduled rollout, no charge), task | head-of-delivery → head-of-customer-relations for the client note | T1 |
| 5c | Content package → blog draft with visuals, social drafts with graphic or video, website copy per mapped section, bylined to a vyntec department | vp-of-social → platform-strategist, social-copywriter, art-director, video-producer | drafts, T0; publishing T2 |
| 5d | Larger project → project task | head-of-delivery | task |
| 6 | Edit, publish, mark Done when shipped | Vinny | shipped |

### Rating rules
- **Vyntec impact** (High / Medium / Low / None): value to how vyntec runs, builds for clients, and earns attention. Updates that support the account restructure (Client Account object, lifecycle pipelines, tag system) rate higher.
- **Action:** Adopt internally · Include for clients · Test first (any Labs/beta feature) · Watch. There is no paid-upgrade action.
- **Effort:** S (under an hour) · M (a few hours) · L (a project).
- **Accounts:** only accounts that specifically benefit, judged by their industry, rated High or Medium with one line why. If benefit depends on an unknown, the line says "Confirm … first".
- **Content angle:** the industries or departments it serves, one blog title, one social hook, and the vyntec.co Features/Industries sections it belongs on. Written as vyntec's capability; never names the vendor.
- Skipped items never return. Notes left by Vinny inform later runs.

## 5. Action plan format (fixed)
Each approved item is acted on through a plan in this format, shown to Vinny before execution:

| # | Action | System | Details | Executing agent | Approval tier |
|---|---|---|---|---|---|
| 1 | Add custom field | Vyntec sub-account | field name, type, folder | account-architect | T1 |
| 2 | Blog draft | Vyntec sub-account (draft) | title, byline: vyntec Marketing, Advertising, Branding & Development | social-copywriter | draft T0 · publish T2 |

## 6. Failure rules
- Feed or dashboard unreachable: the run stops with no partial writes; the summary names what failed.
- Any other failed tool call: retried at most 2 times, then the item is marked **NEEDS HUMAN** (task Blocked, with the error) and the run continues. No loops.

## 7. Exceptions
| Scenario | What to do |
|---|---|
| Labs or beta feature | Action = Test first; test in the Vyntec account before any client; no public content until it is out of beta |
| Release carries a fixed vendor cost (e.g. HIPAA) | flag it; price as cost plus margin per the pricing exception (NEEDS HUMAN) |
| Change needs a workflow, funnel or snapshot edit | the agent writes the build steps; Vinny builds |
| Release affects billing, payments or phone compliance | flag in the note; never changed automatically |
| Content draft mentions the vendor or a vendor-only term | rewrite before it reaches Vinny; never publish (the mod also refuses it) |
| Public claim about certifications, uptime or results | only claims vyntec can substantiate; certifications described as the infrastructure's, never as vyntec's own unless vyntec holds them |
| New client sub-account added | add it to the dashboard's account roster and add a `clients/<slug>/CLAUDE.md` |

## 8. Weekly check (Fridays, 5 min)
1. Clear anything still waiting for review.
2. Look at Approved: ship it, ask an agent to act on it or build its content package, or skip it.
3. Mark shipped items Done.

## Task layer
Review items are tasks in the Notion database **vyntec Tasks** (Source = Platform radar, Department = Delivery, or Social for content packages, Executing agent = head-of-delivery or vp-of-social, Status = Needs your review, Assignee = Vinny). Step 1 checks the ledger **Processed Items** by the release's feed item ID (Source = Changelog); step 3 writes one ledger row per item (Result = Review task created or Skipped). Step 4's Approve sets the task to Approved (cockpit button). Larger projects (5d) are tasks with Approval tier T1. IDs: `sops/work-tracking.md`.
