# SOP: Rollover rescue

**Owner:** chief-of-staff | **Approver:** Vinny Mele | **Runs:** in the morning brief (weekdays 7:30 AM ET) and on demand with `/rescue` (dry run) or `/rescue run` (for real)
**Version:** 1.0 | **Last Updated:** 2026-10-10

## Purpose
Calendar blocks that keep getting missed are mostly messages: email Joe, text Will, invoice follow-ups, check-ins. Instead of rolling them forward again, an agent writes the message and the task becomes a review item. Anything else becomes one decision for Vinny.

## Process
1. **Find.** Read the next 14 days of vinny@vyntec.co. Keep events whose description contains `[vyntec-block]` and says "missed 2×" (or a higher count) or "One more miss". A "▸ Comms batch" block lists several tasks; judge each listed task on its own line.
2. **Link.** Each block line names its task:
   - `notion:<Task ID> <url>`; or
   - a legacy `task:<ClickUp id>`. Find that one in `sops/clickup-map.md`, or with notion-search on the ClickUp id (the task page body links it). Never call ClickUp.
3. **Plan** one action per task. A dry run stops here and shows the table: block, time, task, kind, planned action, agent.
   - **Message task** (email, text, follow up, check-in, nudge, reply, forward):
     - the right agent writes the draft: client-liaison or head-of-customer-relations for clients; head-of-sales-onboarding for prospects and partners;
     - email → a Gmail draft in the existing thread (search Gmail first); text → written into the task page under "Draft text (PENDING APPROVAL)";
     - the task goes to Needs your review;
     - then the calendar time for it is removed: the whole block if every task in it was rescued, otherwise only that task's lines, with the block shortened by that task's minutes.
   - **Anything else:** create one review task, "Decide: delegate / reschedule / drop — <task name>" (Status Needs your review, same Client and Department, Approval tier T1, Due today, body linking the original task and the block). The block stays until Vinny decides.
4. **Run** (only with Vinny's yes for the run; `/rescue run`):
   - add 1 to Rollovers on each linked task;
   - write the drafts and set Needs your review;
   - only after the draft exists, delete or trim the calendar block. Deleting a block is T1.
   - comment on the task: "Rescue <date>: draft <link>; calendar block <title, time> removed".
5. **Report:**
   - blocks found;
   - drafts written (with links);
   - decide-items created;
   - blocks removed or trimmed;
   - minutes of calendar time freed.

## Rules
- Never send anything. Drafts only, marked PENDING APPROVAL.
- Never touch a calendar event without `[vyntec-block]`.
- White label: no draft names the underlying vendor.
- A tool call that fails twice: stop that item, create a NEEDS HUMAN task (Status Blocked) with the error, and go on.
