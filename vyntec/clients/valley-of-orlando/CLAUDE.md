# Client: Valley of Orlando, Scottish Rite (slug: valley-of-orlando) — PROSPECT

- Status: prospect (2026-10-11). No sub-account yet. Notion Client value: none yet (use `vyntec internal` with the org name in the task name until onboarding).
- Ask: barcode/QR inventory for internal operations: wardrobe and props for degree productions.

## Facts from Vinny (2026-10-11, REAL)
- Wardrobe: at least 300 units. Props: at least 300 pieces.
- They stage all degrees. (INFERRED: the Valley's degree range, 4°–32°; confirm the list and each degree's roles.)
- Wardrobe has its own crew; props has its own crew.
- Cast members keep nothing: every piece comes back the same day.
- Special handling: 6 very expensive masks. Nothing else needs special handling.

## Design (proposal draft, not built)
- Custom objects: **Item** (wardrobe or props), **Degree / Role** with a kit list, **Production** (reunion or degree day) with **Cast assignments**.
- Two departments, two crews: Item has Department = Wardrobe | Props; each crew gets its own views, pull lists, forms and notifications.
- Flow per production: pull list → scan Pulled → scan In use → same-day return scan with condition → cleaning/repair tasks → Ready. Anything not back by end of the production day is flagged that night.
- **Masks (6):** high-value tier: own tag and photo, value recorded, check-out only by the wardrobe lead, photo + condition sign-off at return, locked storage location, immediate alert if not returned.
- Import ~600 items from their current list (backup first; bulk rule). QR labels: sewn/heat-transfer for garments, hard tags for props.

## Open questions
1. Current records for the ~600 items (spreadsheet? photos? labels?).
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
