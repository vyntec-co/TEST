# Client: Top Trucks of Central FL (slug: top-truck)

- Client contact: Joe.
- leadconnector location ID: `N3zKau5efQgmMBf9XUGj` ("Top Truck Of Central FL", REAL: list_locations 2026-10-10). Notion Client value: `Top Truck`.
- Access (phase 4 check, 2026-10-10): REACHABLE. list_locations lists it and a read (get-custom-fields) returned 200. Client sub-accounts are READ ONLY this phase: no writes.

## Website (website-builder; was role 20 Top Truck Page Publisher)
13 pages (REAL: Top Trucks Build Tracker artifact H3V8vTCjLUgjQDQTSciQup, read 2026-10-10). Brand pages: /chevy, /dodge, /ford, /gmc, /jeep, /nissan, /toyota (files brand-<name>.html). Service pages: /bed-covers-hitches, /exhaust-intakes, /jeep-off-road, /lift-kits-suspension, /lighting-step-bars, /wheels-tires (files service-<path>.html). Homepage sections: core-services-section.html and brands-marquee-section.html (pasted and published), gallery-section.html. Fox Racing is an open decision (Top Trucks isn't listed on Fox Racing's site as a retailer), not a page. The site H2vptUcNW3Jr2RWNiZq9 already has pages at all 13 paths plus /spray-in-bedliners and /classic-truck-ac (REAL: sub-account read, all updated Oct 9). The HTML files themselves are not in the repo, Drive, ClickUp, Lovable or any artifact (searched 2026-10-10); they are most likely in a claude.ai Project (claude/page-build-sheet-2026-09-30.md, claude/joe-content-…md), which agents can't open. NEEDS HUMAN: Vinny downloads them into clients/top-truck/_source/. Per page: create it at the exact path (for example /chevy), paste the file into ONE Custom Code element, set title and description from the note at the top of the file, publish, then test the link from the brand strip (brand pages) or the Core Services card (service pages). Known blockers: the Dodge vs RAM decision; real shop photos come from Top Truck; the Gallery page needs the duplicate "Gallery" entries fixed in the site builder first; final step is testing all 13 homepage links.
For several pages give ONE table. After a page is said to be published, fetch the live URL and report what loaded, the title, and any broken link.

## Gates
Work that depends on an OPEN gate goes to Blocked with `NEEDS HUMAN: <gate> — <who decides>`.
| Gate | Status | Who decides | Blocks |
|---|---|---|---|
| Dodge vs RAM | OPEN | Joe via Vinny | the Dodge brand page and its brand-strip link |
| Shop photos | OPEN: real photos come from Top Truck | Joe | any page using shop photos; Gallery |
| Gallery duplicates | OPEN: duplicate "Gallery" entries in the site builder | Vinny (Browser/Human) | the Gallery page |
| A2P 10DLC | OPEN: status not checked | Vinny | any SMS workflow going live |

## Generation budget
- Paid image/video generations per month: 0 (Vinny sets this). Request cap: 4.
