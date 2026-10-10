# SOP: Content production (pages, blog posts, assets, brand kit)

**Owner:** head-of-delivery (pages), vp-of-social (blog and social) | **Approver:** Vinny Mele
**Version:** 1.0 | **Last Updated:** 2026-10-10

Every page or post is built as a package of files in the client's folder, previewed privately, approved, then placed by the route `sops/build-capabilities.md` gives it (API, Browser or Human only).

## 1. Page package
Folder: `clients/<slug>/site/<path>/` (path without the slash; the homepage is `home`).

| File | Holds |
|---|---|
| `page.html` | The HTML that goes into ONE Custom Code element. No title or description note inside it. |
| `meta.json` | `{"path":"/chevy","title":"…","description":"…","source":"…","status":"draft / ready / placed unpublished / live"}` |
| `links.md` | Every link: link text, target, internal/external, checked (date + result). |
| `assets.md` | Every image or file the page uses, by its ID in the client's asset register. |
| `tests.md` | The publish test: path loads, title and description match meta.json, every link works, the page is linked from where it should be (nav, brand strip, service card). |

## 2. Blog package
Folder: `clients/<slug>/content/<post-slug>/`.

| File | Holds |
|---|---|
| `article.md` | The post. Byline is a department persona (root `CLAUDE.md` → Bylines), never Vinny. |
| `meta.json` | `{"slug":"…","title":"…","description":"…","category":"…","author":"…","status":"draft"}`. Category and author must already exist on the platform (create is Browser only). |
| `claims.md` | Every factual claim in the post, its source (link, file, or the brand.md proof point), and REAL / INFERRED. A claim with no source is cut. |
| `assets.md` | Images used, by asset-register ID. |

## 3. Asset register: `clients/<slug>/assets.md`
`| ID | Type | File | Source | Owner | Usage rights | Approved by | Used on |`
- Every file a page or post uses has a row before it is placed. **Usage rights** is filled in (owned, client-supplied, licensed + licence, generated + model). The mod refuses placing a file with no row or blank rights.
- Client photos come from the client. Never use a stock or generated image in place of a real shop, staff or customer photo.

## 4. Brand kit: `clients/<slug>/brand.md`
Logo files (asset IDs), colours (hex), fonts, voice (3 lines), words to use and avoid, **approved proof points** (each with its source and date), offers and prices as published by the client, and a **Gaps** list. Content uses only the approved proof points: never invent metrics, testimonials, prices or customer results. A gap stays a gap until the client fills it.

## 5. Preview and approval
- Build the package, then publish a **private** preview with the Artifact tool (it starts private; nothing is shared). Fallback: upload the HTML to Drive under the client's folder, not shared.
- Create or update the review task: `Review: <page or post> — <client> — <date>`, Status Needs your review, with the preview link and the package path. Placement starts only after Vinny sets it Approved.
- If the client must approve, tick **Needs client approval**. The task can't be Done until **Client approval** holds their words and date.

## 6. Placement by route
| What | Route | Steps |
|---|---|---|
| Blog post draft | API | `create-blog-post` with `status: DRAFT` (status is required and the example defaults to PUBLISHED, so always set it), read back with `get-blog-post`, check title/slug/body. Undo: `update-blog-post` status ARCHIVED (no delete op). |
| Blog publish or schedule | API, go-live (T2) | Only with an Approved `Go live: <post> — <client>` item. |
| Social post draft | API | `create-post` with `status: draft`; undo `delete-post`. Publish/schedule is go-live. |
| Funnel or website page, path, custom code | Browser (Human only from this install: no signed-in session) | Write the click path in the task: open the site → add page at `<path>` → add one Custom Code element → paste page.html → page settings: title and description from meta.json → save **without publishing** → preview → run tests.md. Publish is go-live. |
| Media library upload | Browser (Human only from this install) | Upload the files named in assets.md into folder `<client>/<page>`; an API `create-media-folder` can make the folder first. |
| Brand kit on the platform | API | `create-design-kit` from brand.md colours and fonts. |

After placement: run tests.md, set QA (qa-lead), write Evidence (what was read back or checked), and log in the task.

## 7. Generation budget
Each client file has a **Generation budget** line (default 0 per month) and vyntec's own is in the root `CLAUDE.md`. While a budget is 0 the mod refuses all paid image/video generation. Above 0: check the balance, name the model and count, at most 4 per request.

## Rules
- White label: no file in a package names the underlying vendor.
- Nothing is published, scheduled or sent by this SOP without the go-live item.
- A tool call that fails twice: stop, NEEDS HUMAN with the error.
