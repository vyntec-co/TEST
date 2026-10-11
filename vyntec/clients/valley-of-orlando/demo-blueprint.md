# Valley of Orlando — Production Operations demo blueprint (VT-875)

**Goal:** a pitch demo that runs inside the client's own link.vyntec.co account, using the platform's own parts wherever one exists. Built in the vyntec Test Lab ("Enterprise Demo Test") with sample data marked DEMO. Nothing is presented as the Valley's real inventory, staging or ritual; real content comes from their directors and crews after signing.
**Native rule:** every screen the Valley sees is a platform screen. The only custom code is the 3D viewer, and it is hosted inside a platform course lesson (no outside site, no outside database, no outside login).

Labels: REAL = confirmed by an API read on 2026-10-11 · INFERRED = expected from the platform UI, to confirm in the Test Lab before the pitch.

## 1. The five modules and where each lives

| # | What the Valley asked for | Native home | How it's built | Label |
|---|---|---|---|---|
| A | Inventory of ~600 wardrobe + props pieces | **Custom object "Inventory Item"** (records, record page, list views, filters) | Vinny creates the object in the UI; agents add fields and DEMO records by API | object schema = Browser (REAL: no create-object API); fields/records = API (REAL) |
| B | Scan a barcode to pull / return | **QR label → the item's record page**, crew edits Status there. Phase 2: **Form** with the item code prefilled from the link → **Workflow** updates the record | Demo uses the record page only; the form + workflow path is tested first and shown only if it works | record URL pattern INFERRED; form prefill + workflow "update object record" INFERRED |
| C | Run each degree production | **Pipeline "Degree Productions"** (one opportunity per reunion/degree day): Planning → Pull → Dressed → Returned → Reset | Agents create opportunities by API once Vinny makes the pipeline (pipeline create = UI) | opportunities = API (REAL); pipeline create INFERRED UI |
| D | Two crews, separate work | **Users + roles** (Wardrobe crew, Props crew) and saved object views per department | Demo: Vinny's login, views named per crew. Real users later (inviting users is T2) | INFERRED |
| E | Costume: how it should look + dressing instructions | **Course (Client Portal / Memberships) "Wardrobe & Props Guide"**: one category per degree, one lesson per role: front/back/side photos, a 360 phone video, numbered dressing steps, each step naming the item code + storage spot | Structure by API (`import-courses`, REAL op); media upload and lesson editing in the UI | course import REAL (shape: products → categories); lesson body/media INFERRED |
| F | 3D of the ceremony layout + 3D costume | **Custom code inside a course lesson**: a 3D stage (rotate / top-down) with prop markers per degree and scene; click a marker → item code, storage spot, link to its record. A 3D mannequin with a "dress step" slider that layers each piece in order | One HTML file (three.js from a pinned CDN) pasted into the lesson; positions and steps are data inside the file | custom code in a lesson INFERRED; Browser placement |
| G | Overview for officers | **Dashboard**: productions by stage (pipeline widgets), plus object list views for "Not ready" and "Out today" | Pipeline widgets native; custom-object widgets INFERRED (fallback: saved views) | INFERRED |
| H | 6 expensive masks | Item fields **High value** + **Insured value**, location "Locked mask cabinet"; Phase 2 workflow: internal alert to the wardrobe lead on any status change | Demo: 2 DEMO masks flagged | fields REAL (API) |

Live status inside the 3D viewer is **not** in the demo: a page can't safely read the account's records from the browser (it would need an API key in the page). The marker links straight to the record, which shows live status natively. That keeps the security line and stays native.

| I | Reunion schedule + run of show | **Calendar** (event calendar) with per-item reminders | UI | INFERRED |
| J | Check-in (volunteers, candidates) | QR badge → contact record / form; check-in tag + workflow | as module B | INFERRED |
| K | Degree sign-ups (candidates) | **Form** on the Valley's site → contact + **pipeline "Candidates"** (Registered → Confirmed → Checked in → Conferred); fees via invoices only if the Valley wants (T2) | form/pipeline UI; opportunities API | opportunities REAL |
| L | Cast sign-ups | Member-portal **form/survey** per open role → **custom object "Cast assignment"** (or opportunity) linked to contact, role, production; director confirms | object/records API | REAL (records); form INFERRED |
| M | Volunteer points | Contact fields **Volunteer points** + **Level**; workflows add points on check-in, crew shift, rehearsal, served role; leaderboard via smart list sorted by points | fields API; workflows UI | fields REAL |
| N | Communications | Email/SMS **templates** + workflows, officer approval before each batch; SMS only after A2P registration and opt-in | templates API (REAL, piloted VT-872); workflows UI | REAL / INFERRED |

| O | Crew / member app (what each person sees) | The platform's member portal and mobile app: Today (check-in, my role or pull list, schedule), Scan, My role, Points. Each piece opens a sheet: where it is stored (3D room or stage mark) and how it is worn (3D figure, dressing steps); the 3D lives in the guide lesson, the sheet is the record page | portal/app UI | INFERRED |
| P | Intercom (channels + person to person) | **Not native.** The platform has internal team chat (INFERRED) but no push-to-talk voice. Options: text channels in the platform's app, plus a radio app for voice; or a custom add-on. Decide in discovery. The demo runs it live between open devices and reads calls aloud. | — | gap |

## 2. Inventory Item fields (DEMO)
Item code (DEMO-WR-001…) · Department (Wardrobe / Props) · Type · Degree · Role · Size · Location (rack/bin/cabinet) · Status (Ready / Pulled / In use / Cleaning / Repair / Retired) · Condition · High value (checkbox) · Insured value · Photo · Last production (text)
Seed: `clients/test-lab/backups/VT-875-valley-demo-seed.json` (22 records: 10 wardrobe, 10 props, 2 masks; also the bulk backup).

## 3. 3D viewer content (sample only)
- Generic stage: proscenium, stage left/right/centre, upstage platform, wings. No ritual layout.
- Two sample "degrees" × two scenes, ~10 prop markers using the DEMO prop codes.
- Mannequin with 4 layered pieces (robe → sash → collar → headpiece) and a step slider: "1. Robe DEMO-WR-001 (Rack A1)…".
- Style: platform-clean, readable on a phone; Vinny's demo account branding only.
- After signing: the props lead moves markers on the top-down view and copies the exported positions into the lesson (or an agent does it from their notes).

## 4. Build order (unknowns first)
| # | Step | Who | Tier |
|---|---|---|---|
| 0 | Test the 4 unknowns in the Test Lab: record URL opens from a phone QR scan; form prefills from the link; workflow can update an object record; course lesson accepts custom code | Vinny clicks (10 min), agent checks by API | — |
| 1 | Create object "Inventory Item" and pipeline "Degree Productions" | Vinny (UI, ~5 min) | — |
| 2 | Fields + 22 DEMO records + 2 DEMO productions | account-architect (API) | T1 |
| 3 | QR label sheet (printable, each QR = record URL) | website-builder | T0 |
| 4 | Course skeleton via `import-courses` (1 product, 2 degree categories) | account-architect (API) | T1 |
| 5 | 3D stage + mannequin HTML; Vinny pastes it into the lesson | website-builder | T1 (placement Browser) |
| 6 | Saved views: Wardrobe, Props, Out today, Not ready, Masks; dashboard | Vinny (UI) from the agent's click path | — |
| 7 | QA run-through on a phone; pitch script | qa-lead, head-of-sales-onboarding | T0 |
| 8 | After the pitch: keep or delete DEMO records | Vinny | T2 at delete |

## 5. Pitch script (6 minutes)
1. Phone scan of a robe tag → its record opens → Status Pulled.
2. Dashboard: "Out today" now shows it; production card moves to Dressed.
3. Open the Wardrobe & Props Guide → role lesson → dressing steps with item codes.
4. 3D: rotate the stage, switch scene, tap the lantern → "In Repair, Props Shelf 3".
5. Return a mask → condition → it lands in "Not ready" until cleaned.
6. Close: vyntec is an operational CRM. The Valley runs its productions here — inventory, crews, pull lists, dressing guides — in the same system as its members, events and dues, with one login.

## 6. Not in the demo
Real inventory, real staging, real ritual text; user invites; automatic alerts (phase 2); paid 3D generation (budget 0).
