# Client: Valley of Orlando, Scottish Rite (slug: valley-of-orlando) — PROSPECT

- Status: prospect (2026-10-11). No sub-account yet. Notion Client value: none yet (use `vyntec internal` with the org name in the task name until onboarding).
- Ask: barcode/QR inventory for internal operations: wardrobe and props for degree productions.

## Facts from Vinny (2026-10-11, REAL)
- Wardrobe: at least 300 units. Props: at least 300 pieces.
- They stage all degrees. (INFERRED: the Valley's degree range, 4°–32°; confirm the list and each degree's roles.)
- Wardrobe has its own crew; props has its own crew.
- Cast members keep nothing: every piece comes back the same day.
- Special handling: 6 very expensive masks. Nothing else needs special handling.
- Nothing is recorded today (no list, no labels). The pitch uses a demo with sample data, not an import (Vinny, 2026-10-11).
- They also want a 3D view of each degree's stage layout with props, and a 3D view of each complete costume with dressing instructions.
- Demo must be as native to the platform as possible: see `demo-blueprint.md`.

## Design (proposal draft, not built)
- Custom objects (creating the object itself is Browser only: no API op for a new object schema, REAL 2026-10-11; fields, records, search and contact links are API): **Item** (wardrobe or props), **Degree / Role** with a kit list, **Production** (reunion or degree day) with **Cast assignments**.
- Two departments, two crews: Item has Department = Wardrobe | Props; each crew gets its own views, pull lists, forms and notifications.
- Flow per production: pull list → scan Pulled → scan In use → same-day return scan with condition → cleaning/repair tasks → Ready. Anything not back by end of the production day is flagged that night.
- **Masks (6):** high-value tier: own tag and photo, value recorded, check-out only by the wardrobe lead, photo + condition sign-off at return, locked storage location, immediate alert if not returned.
- After signing: record the ~600 items during a tagging pass (crew scans each new tag and fills the item form); no spreadsheet exists to import. QR labels: sewn/heat-transfer for garments, hard tags for props.

## Open questions
1. ANSWERED: nothing recorded today.
2. Degree list and roles per degree, and which items each role uses.
3. Crew leads' names and how many crew per side need access.
4. Production calendar (reunion dates).
5. Insurance values for the masks and who signs them out.

## Gates
| Gate | Status | Who decides | Blocks |
|---|---|---|---|
| Engagement | OPEN: prospect, no agreement | Vinny | any build outside the Test Lab |
| Workflow can update a custom object record from a form | UNTESTED | Test Lab pilot | the scan-to-update design |

## Generation budget
- Paid image/video generations per month: 0. Request cap: 4.
