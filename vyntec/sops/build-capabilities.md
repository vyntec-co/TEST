# Build capabilities: what agents can do, and how

**Owner:** head-of-delivery | **Approver:** Vinny Mele | **Version:** 1.0 | **Last Updated:** 2026-10-10

Every Delivery and Social agent reads this before planning build or placement work.
- **API:** the agent does it through leadconnector (`execute_operation`), in the Test Lab first.
- **Browser:** the agent does it in a browser with Vinny's signed-in session. Only when a browser tool with that session is available; otherwise it is a Human-only request.
- **Human only:** Vinny does it. Send it as one clear request (what, where, the exact click path, why it can't be automated).

**Truth labels.** REAL = seen working in a pilot. INFERRED = seen in `search_operations`/`describe_operation` (or reasoned) but not yet run. **Nothing counts as API until a pilot proves it**; until then an API row means "try in the Test Lab first".

## Access (checked 2026-10-10, read only)

| Client | Slug | Location ID | Reachable | Evidence | Access step for Vinny |
|---|---|---|---|---|---|
| CS Laser Orlando | cs-laser | `MnKKwFSetGRCrkXj7pBU` | Yes | list_locations + get-custom-fields 200 | none |
| Top Truck Of Central FL | top-truck | `N3zKau5efQgmMBf9XUGj` | Yes | list_locations + get-custom-fields 200 | none |
| Seminole Education Association (Union OS) | sea | `uRaVZsAUjEiZ8MyuCIb3` | Yes | list_locations + get-custom-fields 200 (returned SEA's 40 opportunity fields) | none for SEA itself. The two "Union OS" locations (`HkCVE6Gce3fNyDC3Aa1Q`, `j98RPbeenvRPdvYsqpdp`) are also reachable; which is canonical is still NEEDS HUMAN (see clients/sea) |
| vyntec Test Lab ("Enterprise Demo Test") | test-lab | `orGC5WISXbnF64QlfjXV` | Yes | list_locations | none; chosen by Vinny as the Test Lab |
| Vyntec (agency sub-account) | (vyntec) | `VC4vU19aLPfOwqREsc8x` | Yes | list_locations | none |

In phase 4 the mod lets agents write **only** to the Test Lab. Client sub-accounts are read only.

## Browser

- Present in this install: the browser-use tool (`mcp__plugin_browser-use_browser-use__*`) and a headless Chromium (Playwright). Claude in Chrome is not connected here.
- Not present: Vinny's signed-in platform session. This install runs in a cloud container; it never signs in, and never stores passwords or 2FA codes.
- **So today every Browser row is a Human-only request from this install.** On Vinny's own PC with Claude in Chrome (his signed-in session), Browser rows can be run by the agent after Vinny says yes to the browser action.

## Summary (38 rows)

| Group | Rows |
|---|---|
| API (INFERRED until piloted) | 22 |
| Browser | 12 |
| Human only | 4 |

Pilots move rows to REAL; see "Pilot results" below.

## Capability table

Source: LeadConnector (GHL) public API catalogue, read via `search_operations` and `describe_operation` only. Nothing was run (no `execute_operation`). Researched 2026-10-10.

Every classification is **INFERRED**. Nothing is REAL until a pilot runs it. "described:" means the operation was opened with `describe_operation`. "listed:" means it came back from `search_operations` with that method and path, but was not opened.

All write and delete operations below report `requiresApproval: true` and `idempotencyRequired: true`. Delete operations report `destructiveHint: true`. Write operations report `destructiveHint: false`.

| # | Work | Group | Operation IDs (create / update / delete-undo) | Go-live op? | Evidence | Notes |
|---|------|-------|-----------------------------------------------|-------------|----------|-------|
| 1 | Contacts | API (INFERRED) | create-contact, upsert-contact / update-contact / delete-contact | No (but create can fire workflow triggers) | listed: POST /contacts/ ; PUT /contacts/{contactId} ; DELETE /contacts/{contactId} | Upsert follows the location's duplicate-contact setting. |
| 2 | Tags | API (INFERRED) | create-tag / update-tag / delete-tag ; on a contact: add-tags / remove-tags ; bulk: contacts.create-association | No (adding a tag can trigger workflows) | described: POST /locations/{locationId}/tags (body: name) | Bulk add or remove uses POST /contacts/bulk/tags/update/{type}. |
| 3 | Custom fields | API (INFERRED) | locations.create-custom-field / locations.update-custom-field / locations.delete-custom-field | No | described: POST /locations/{locationId}/customFields (model: contact or opportunity) | The /custom-fields/ v2 family (custom-fields.create-custom-field etc.) only covers custom objects and companies. |
| 4 | Custom values | API (INFERRED) | create-custom-value / update-custom-value / delete-custom-value | No | described: POST /locations/{locationId}/customValues (body: name, value) | |
| 5 | Notes | API (INFERRED) | create-note / update-note / delete-note | No | described: POST /contacts/{contactId}/notes | Appointment notes have their own ops: create-appointment-note, update-appointment-note, delete-appointment-note. |
| 6 | Opportunities | API (INFERRED) | create-opportunity, Upsert-opportunity / update-opportunity, update-opportunity-status / delete-opportunity | No | described: POST /opportunities/ (status enum: open, won, lost, abandoned) | Needs an existing pipelineId and stage ID. |
| 7 | Pipelines (create / edit stages) | Browser (INFERRED) | read only: get-pipelines | No | no operation found (searched: "pipeline create update stages", "create pipeline" in opportunities/write) | Only GET /opportunities/pipelines exists. |
| 8 | Products and prices | API (INFERRED) | create-product, create-price-for-product / update-product-by-id, update-price-by-id-for-product / delete-price-by-id-for-product (product delete not surfaced) | No | listed: POST /products/ ; POST /products/{productId}/price | Product delete was not in the results. Check before the pilot. |
| 9a | Invoices: create draft | API (INFERRED) | create-invoice, create-invoice-schedule, create-invoice-template / update-invoice / delete-invoice, void-invoice | No | listed: POST /invoices/ ; DELETE /invoices/{invoiceId} ; POST /invoices/{invoiceId}/void | Treat void-invoice as the undo once an invoice has been sent. |
| 9b | Invoices: send / collect | API (INFERRED), go-live | send-invoice, text2pay-invoice, record-invoice, auto-payment-invoice-schedule | **Yes**: sends SMS/email and can auto-charge | described: POST /invoices/{invoiceId}/send (action: sms_and_email/email/sms/send_manually; liveMode bool; autoPayment) | text2pay-invoice creates and sends in one call. |
| 10 | Calendars and services | API (INFERRED) | create-calendar, create-calendar-group, create-service-catalog, create-calendar-resource / update-service-catalog, update-calendar-resource / delete-calendar, delete-service-catalog, delete-calendar-resource | No | listed: POST /calendars/ ; DELETE /calendars/{calendarId} ; POST /calendars/services/catalog | Calendar notifications have create-event-notification and delete-event-notification. |
| 11 | Appointments | API (INFERRED) | create-appointment / edit-appointment / delete-event | **Yes** if toNotify=true (default): runs automations and notifications | described: POST /calendars/events/appointments (toNotify default true; appointmentStatus enum) | Set toNotify=false for build and test bookings. |
| 12a | Forms and surveys: create / edit | Browser (INFERRED) | none | No | no operation found (searched: "forms surveys submissions", "create form update form" write) | The form-create hits were Facebook and LinkedIn ad lead forms, not GHL forms. |
| 12b | Forms and surveys: read submissions | API (INFERRED) | get-forms, get-forms-submissions, get-surveys, get-surveys-submissions (read only) | No | described: GET /forms/submissions | Read only. Needs no approval. |
| 13 | Workflows: create | Browser (INFERRED) | none | No | no operation found (searched: "workflow create publish update", "get workflows list" in workflows domain) | The workflows domain has only get-workflow (GET /workflows/). |
| 14 | Workflows: edit steps | Browser (INFERRED) | none | No | no operation found (same searches as #13) | |
| 15 | Workflows: publish | Browser (INFERRED), go-live | none | **Yes** (done in the UI) | no operation found (same searches as #13) | |
| 16 | Workflows: add a contact | API (INFERRED), go-live | add-contact-to-workflow / delete-contact-from-workflow | **Yes**: starts a published workflow, which may send messages | described: POST /contacts/{contactId}/workflow/{workflowId} (body: eventStartTime optional) | Only works on a published workflow. |
| 17 | Funnels/websites: create a page | Browser (INFERRED) | read only: getFunnels, getPagesByFunnelId, getPagesCountByFunnelId | No | no operation found (searched: "funnel page create publish website", "funnel page" in funnels/write) | The funnels domain has only redirects as write ops. |
| 18 | Set page path | Browser (INFERRED) | none for page slug ; related: create-redirect / update-redirect-by-id / delete-redirect-by-id | No (a redirect is live as soon as it is created) | described: POST /funnels/lookup/redirect (domain, path, target, action) | A redirect maps a path to a target. It does not set the page's own slug. |
| 19 | Custom code on a page | Browser (INFERRED) | none | No | no operation found (searched with #17) | Custom code element in the page builder. |
| 20 | Publish a page | Browser (INFERRED), go-live | none | **Yes** (done in the UI) | no operation found (searched with #17) | |
| 21 | Blogs: create draft | API (INFERRED) | create-blog-post (status=DRAFT) / update-blog-post / no delete found; undo = update-blog-post status ARCHIVED | No if status=DRAFT | described: POST /blogs/posts (status required, enum DRAFT/PUBLISHED/SCHEDULED/ARCHIVED; publishedAt required) | status is a **required** field. The payload example defaults to PUBLISHED, so always set DRAFT. |
| 22 | Blog category and author | Browser (INFERRED) for create ; API read only | get-all-categories-by-location, get-all-blog-authors-by-location (read only) | No | no operation found for create (searched: "blog categories authors", "blog post create update publish") | Posts take existing category and author IDs. |
| 23 | Blog publish | API (INFERRED), go-live | create-blog-post / update-blog-post with status=PUBLISHED | **Yes** | described: PUT /blogs/posts/{postId} (status enum, wordCount required) | Same op as #21. Only the status value differs. |
| 24 | Blog schedule | API (INFERRED), go-live | create-blog-post / update-blog-post with status=SCHEDULED + publishedAt | **Yes** (publishes when the time comes) | described: PUT /blogs/posts/{postId} | |
| 25 | Media library upload | Browser (INFERRED) | none for upload ; update-media-object only renames | No | no operation found (searched: "media library upload file folder", "upload file into media library" in medias, "upload media content" write) | update-media-object (described: POST /medias/{id}) only renames. |
| 26 | Media folders | API (INFERRED) | create-media-folder / update-media-object, bulk-update-media-objects / delete-media-content, bulk-delete-media-objects | No | described: POST /medias/folder (altId, altType=location, name, parentId) | bulk-delete-media-objects soft-deletes (trash). |
| 27 | Social planner: create draft | API (INFERRED) | create-post (status=draft) / edit-post / delete-post | No if status=draft | described: POST /social-media-posting/{locationId}/posts (status enum includes draft, scheduled, published; type and userId required) | Drafts skip the account and media checks. |
| 28 | Social schedule | API (INFERRED), go-live | create-post / edit-post with status=scheduled + scheduleDate | **Yes** (posts when the time comes) | described: PUT /social-media-posting/{locationId}/posts/{id} | Undo with delete-post before the time comes. |
| 29 | Social publish | API (INFERRED), go-live | create-post / edit-post with status=published (or a schedule in the near future) | **Yes** | described: POST /social-media-posting/{locationId}/posts | Whether status=published posts right away is not confirmed. A pilot must check. |
| 30 | Brand boards | API (INFERRED) | create-design-kit, create-brand-voice / update-design-kit, set-default-design-kit, update-brand-voice / delete-design-kit, delete-brand-voice | No | listed: POST /brand-boards/locations/{locationId}/design-kits | |
| 31 | Snapshots | Browser (INFERRED) | none | No (pushing a snapshot changes a live sub-account) | no operation found (searched: "snapshot share link push", "snapshot"; domain 'snapshots' unknown) | Agency-level. Scopes like snapshots/api.push exist only as user-permission scopes. |
| 32 | Email templates | API (INFERRED) | create-email-template, import-email-template, create-template-folder / update-email-template / delete-email-template | No (a template is not a send) | described: POST /emails/locations/{locationId}/templates (name, editorType html/text) | create-email-campaign also exists. It is a sending tool, so leave it out of the build. |
| 33 | Users | Human only (policy line; API exists) | create-user / update-user / delete-user | No | described: POST /users/ (email, password, role, locationIds, permissions, scopes) | The API exists, but user invites and permissions are Vinny's call by policy. |
| 34 | SMS and A2P settings | Human only (INFERRED: no A2P operation; number purchase is a policy line) | A2P/10DLC: none ; related: purchase-number-for-location (charges Stripe) | **Yes** (purchase charges a card) | no A2P op found (searched: "A2P 10DLC brand registration sms phone number", "messaging compliance campaign registration number" in phone-system) ; described: POST /phone-system/numbers/location/{locationId}/purchase (paymentIntentId, paymentMethodId) | Registration is a legal and identity step. |
| 35 | Domains | Human only (INFERRED: no API, DNS by nature) | none | No | no operation found (searched: "domain connect dns custom domain", "website domain settings" write) | DNS records live at the registrar. |
| 36 | Payment settings | Human only (policy line; API exists) | create-config, create-integration, create-integration provider / custom-provider-marketplace-app-update-capabilities / disconnect-config, delete-integration | No (but it changes the payment processor) | described: POST /payments/custom-provider/connect (live + test apiKey/publishableKey) | The API exists, but changing payment processors is Vinny's call by policy. |

## Go-live operation IDs

- **Publishes content:** create-blog-post and update-blog-post (status PUBLISHED or SCHEDULED); create-post and edit-post (status published or scheduled); create-redirect (live once created).
- **Activates automation:** add-contact-to-workflow. Contact and tag writes can also fire existing workflow triggers (create-contact, upsert-contact, add-tags, contacts.create-association). create-appointment and edit-appointment run automations when toNotify=true.
- **Sends messages:** send-invoice, text2pay-invoice, send-a-new-message (conversations), create-email-campaign.
- **Charges or moves money:** send-invoice (autoPayment), auto-payment-invoice-schedule, record-invoice, purchase-number-for-location.
- **Done in the UI only (no op):** workflow publish, page publish, snapshot push.

## Delete/undo operation IDs per area

- Contacts: delete-contact
- Tags: delete-tag ; remove-tags (contact) ; contacts.create-association (bulk remove)
- Custom fields: locations.delete-custom-field (custom-fields.delete-custom-field for objects; delete-custom-field-folder)
- Custom values: delete-custom-value
- Notes: delete-note ; delete-appointment-note
- Opportunities: delete-opportunity ; remove-followers-opportunity
- Products and prices: delete-price-by-id-for-product (product delete not found)
- Invoices: delete-invoice, void-invoice, delete-invoice-schedule, delete-invoice-template
- Calendars and services: delete-calendar, delete-service-catalog, delete-calendar-resource, delete-event-notification, delete-service-booking
- Appointments: delete-event
- Workflows: delete-contact-from-workflow
- Redirects: delete-redirect-by-id
- Blogs: none found. Undo = update-blog-post status ARCHIVED or DRAFT.
- Media: delete-media-content, bulk-delete-media-objects
- Social: delete-post, deleteCurrentActivePostAndScheduleNext
- Brand boards: delete-design-kit, delete-brand-voice
- Email templates: delete-email-template ; cancel-scheduled-email-message for scheduled sends
- Users: delete-user
- Payments: disconnect-config, delete-integration

## Pilot results

| Pilot | Task | Route | Status (2026-10-10) |
|---|---|---|---|
| API: Pilot Field + tag "pilot" on contact "Pilot Test", read back, undo | VT-867 | API | **PASS for create/tag/field/read (REAL, 2026-10-11 01:44Z)**: locations.create-custom-field (201), create-tag (201), create-contact (201), add-tags (201), update-contact customFields (200), get-contact read back matches. Change log written by the mod for all 5. Undo PASS after the view fallback (option A): delete-contact, delete-tag, locations.delete-custom-field 200; verified gone. Rows 1–3 move to REAL. |
| Blog draft "New custom field types": place as DRAFT, read back, archive | VT-868 | API | NOT RUN. DRAFT-only exception added to the mod (Vinny's yes, 2026-10-10). REAL (read 2026-10-10): the Test Lab has no blog site, no category and no author (get-blogs, get-all-categories-by-location, get-all-blog-authors-by-location all empty), and create-blog-post requires blogId, categories, author and imageUrl. Creating a blog site, category or author is Browser only, so Vinny makes them once in the Test Lab (Sites → Blogs). imageUrl needs an image with a row in clients/test-lab/assets.md. |
| Page /pilot: place unpublished, check, delete | VT-869 | Browser → Human only | NOT RUN. Tried 2026-10-10: the browser tool reports "chrome-not-running". This cloud container has no Chrome, and a new one here would not be signed in (signing in needs a password and 2FA, which agents never handle). Runs only from a session on Vinny's own computer with his signed-in Chrome, or by Vinny from the click path in the task. |
| Domain connection | — | Human only | Step list below |
| SEA email template (custom HTML) in the Test Lab | VT-872 | API | **PASS (REAL, 2026-10-11)**: create-email-template (editorType html, subjectLine, previewText) 201; stored HTML matches the file except the platform's automatic Outlook fixes; delete-email-template 200, then 404. Row 32 moves to REAL. |
| Waiting loop | VT-3 (dry run), Waiting: Pilot reply | Notion | PASS (see below) |
All capability rows stay INFERRED until a pilot moves them to REAL.

## Domain connection (Human only): step list
Click path INFERRED (not run from this install; confirm on first use). No API op covers domain connection, and it touches DNS at the client's registrar (credentials Vinny or the client holds). Steps for Vinny:
1. Ask the client who controls DNS for the domain (registrar login stays with them; never store it).
2. In the sub-account: Settings → Domains → Add domain → enter the domain or subdomain (e.g. `www.client.com` or `go.client.com`).
3. Copy the DNS records the platform shows (usually an A record for the root and/or a CNAME for the subdomain).
4. The client (or Vinny on a screen share) adds them at the registrar. Remove conflicting old A/CNAME records only with the client's yes.
5. Back in Domains → Verify. DNS can take up to 48 hours; SSL is issued after verification.
6. Link the domain to the website or funnel; set the default page.
7. Test: open http:// and https:// on the domain and `www.`; each loads the right page with a valid certificate. Record the result as Evidence.
Go-live: pointing a live domain is T2: needs `Go live: domain <domain> — <client>` Approved.

## Waiting-loop dry run (2026-10-10)
- Real item VT-3 "Waiting: pricing proposal from NMI Finance — NMI", Follow up 2026-10-17. On that date the morning brief would draft a nudge to Michael Connelly in the existing thread. **Finding:** VT-3 is blocked on our own Partner Assessment Form ("Complete & return Partner Assessment Form — NMI", not yet sent). A nudge before we return the form would ask NMI for something they can't start. Rule added: a Waiting item whose body says it starts after one of OUR open tasks gets no nudge; the brief lists our open task instead.
- Draft the brief would have written (not created): "Hi Michael, following up on the pricing proposal with Finance. We're finishing the Partner Assessment Form on our side and will send it over shortly so your team can get started. Talk soon, Vinny Mele · vyntec".
- The routine trig_01MYScY32jTUQnZVYdTwd6DA still has the old FOLLOW-UPS line: sops/scheduled/morning-brief.md has the new one; saving it to the routine waits for Vinny's yes.
- Fake reply test on "Waiting: Pilot reply — vyntec Test Lab": the reply note was added and the task moved Waiting on someone → Queued, Follow up cleared. PASS.
