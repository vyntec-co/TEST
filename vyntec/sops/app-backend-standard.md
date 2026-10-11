# Build standard: client apps with a built-in backend (DRAFT — Watch)

**Owner:** head-of-delivery | **Approver:** Vinny Mele | **Status:** draft, not yet used for any client
**Source:** platform changelog "Cloud: A Built-In Backend for Your Apps", 2026-10-09 (internal source link in the Platform Radar entry). Every fact below is REAL from that release note unless marked otherwise. Client-facing text never names the vendor or its app builder; it is "your custom app" on link.vyntec.co / Union OS.

## When to use it
Only when a client needs real logins and stored data that the platform's built-in membership area, communities and forms can't cover (e.g. members uploading and viewing their own documents in a custom app). Check those first and write down why they fall short.

## What it gives
A private backend per app project: a database, user accounts (email + password only in v1), and file storage (public or private buckets). Daily backups cover the schema and rows, not storage files or app code.

## Rules before any client build
1. **Test Lab first.** Build and test in the vyntec Test Lab before any client app; log it in `clients/test-lab/changelog.md`.
2. **Costs (T2, money).** Database size starts at a free tier and moves to paid sizes priced hourly; database storage can grow but never shrink and is paid hourly even when paused; file storage is paid for what's stored. If the wallet can't cover it, the backend pauses itself. Any size or storage change needs Vinny's explicit yes and a cost line in the client's package (cost plus margin, per the HIPAA-style exception only if it's a fixed monthly cost to vyntec; otherwise fold into the package — NEEDS HUMAN: Vinny decides which).
3. **Never destroy data without a T2 yes.** "Remove Cloud" permanently deletes the project's database, users and files. "Restore" replaces the live database with a backup. Deleting a user can't be undone. Before any of these: export tables as CSV, download files, record it in the change log, and get Vinny's explicit yes.
4. **Security advisor.** Fix every critical issue before publishing; record warnings on the task.
5. **Auth settings.** Email confirmation stays on (auto-confirm is for testing only). Set the site and redirect URLs exactly; a mismatch is the usual login failure. Use private buckets for member documents.
6. **Copies.** Sharing or remixing a project doesn't copy its data, but a copy can still call the original project's backend. Never share or remix a client app project.
7. **Health, legal or financial records** (e.g. CS Laser health forms) never go into an app backend: NEEDS HUMAN, HIPAA rules apply.
8. **Project type.** Only works with the newer app framework; older projects must be migrated to a copy first (the original stays live). INFERRED: plan migration time into estimates.

## Open before this leaves Watch
- A Test Lab pilot: one app with login, one private bucket, one upload, read back, then export and remove.
- Vinny's call on how usage costs are billed to clients.
- A client that actually needs it (SEA or Union OS), confirmed by the client.
