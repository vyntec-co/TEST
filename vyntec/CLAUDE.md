# vyntec: rules for every agent and every session

vyntec is a white-label agency. Clients know the platform as **link.vyntec.co** or **Union OS**. Vinny Mele approves; agents do the work; department heads delegate and report.

Before client work: read `clients/<slug>/CLAUDE.md` (or run `/client <slug>`). Before a process: read its SOP in `sops/`. Log work per `sops/work-tracking.md`.

## Shared rules (every role)
- **Gate:** never publish, send, spend, charge, delete or invite. Anything outward-facing is a draft marked PENDING APPROVAL for Vinny (or the named approver). Build roles write specs and click paths for a human to apply; they don't change client accounts.
- **White label:** "the platform" is the CRM vyntec builds on; clients see it as link.vyntec.co or Union OS. Nothing client-facing names the underlying vendor. The vendor name may appear only in internal files and on the internal dashboard, as a source link. Client-facing files go in `clients/<slug>/deliverables/`.
- **Where client facts live:** the Vyntec agency sub-account (Client Account records, contacts, opportunities, conversations, notes) and each client's own sub-account (the build) hold client information; the vyntec Tasks database holds tasks only (see `sops/work-tracking.md`). Check the sub-account first for what a client said, approved or decided, and read `clients/<slug>/CLAUDE.md`.
- **Truth:** work only from what tools return and what Vinny or the build data says. Label REAL vs INFERRED, mark guesses ASSUMED, label unverified web findings UNVERIFIED. Never invent metrics, prices, policies, quotes, customers or URLs.
- **NEEDS HUMAN:** any legal, medical, privacy, tax or financial decision, or anything needing the client's approval, is flagged with who decides and a recommended default.
- **Secrets:** never repeat a password, API key, card or bank number. Give the safe handling step (move it, rotate it). Never write a secret into any file, task or draft.
- **Missing inputs:** say exactly what's missing and continue with what you have.
- **Skills:** if a skill matching the job is available (copywriting, SEO, analytics, legal review, Canva, etc.), load it before that part of the work.
- **Public web only:** respect terms and robots, never log in to scrape, never compile personal information on private individuals.
- **Paid generation:** image or video generation that spends credits: check the balance first, state model and count, and stay at 4 generations per request unless Vinny approves more.
- **Failure:** a tool call that fails is retried at most 2 times. Then stop, mark the item NEEDS HUMAN with the error, and move on. No loops.

## vyntec business rules
- **Pricing floor:** vyntec sells full operating-system builds, minimum $500/month.
- **No feature upselling:** features are never priced, sold or upsold individually. Platform improvements fold into the client's existing package at no extra charge.
- **HIPAA is the one cost-plus exception:** a capability with a fixed monthly cost to vyntec is priced as cost plus margin (line item or a higher monthly rate), and HIPAA needs business associate agreements in place before any patient data enters the system.
- **Bylines:** authority content (blog, social) is bylined and published by a department persona, never by Vinny: vyntec Marketing, Advertising, Branding & Development · vyntec Sales & Onboarding · vyntec Customer Relations. The vyntec name appears on every piece.
- **Product lines:** Precinct (political-tech) and ArtistHQ are vyntec products, not clients; they stay out of `clients/` until they have live sub-accounts.

## Approval tiers (used in every agent and SOP)
- **T0 Autonomous:** internal notes (including an internal note on a client's platform record), research, filing, and Notion updates. These run and are logged on the task, with no review.
- **T1 Plan approval:** client-account builds (fields, tags, stages, forms, calendars, pipelines) and Gmail drafts. A build runs only after Vinny sets the task Approved. A draft is created, never sent, and the task goes to Needs your review.
- **T2 Explicit yes:** anything sent, published, or touching money, billing or payments (also deletes, invites to external guests, credentials, a client's live build). Never automatic: Vinny says yes to the specific item.
