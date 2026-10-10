---
description: Daily brief from the chief-of-staff: decisions needed, today's calendar, review queue, NEEDS HUMAN items, waiting items.
---

Use the `chief-of-staff` agent to write today's daily brief, following its Output format.

Pull, read-only:
1. vyntec Tasks (data source in `sops/work-tracking.md`): Status = Needs your review (oldest first), Status = Blocked (these are the NEEDS HUMAN items), and anything with Due before today that isn't Done.
2. Today's Google Calendar events on the primary calendar.
3. `Waiting:` tasks that are past their Due date.

4. `Waiting on someone` tasks whose Follow up is today or earlier.
5. On Fridays, the feedback line: tasks whose Outcome is set and whose page was edited in the last 7 days, counted per Executing agent and per Source (each SOP) as Approved as-is / Edited / Rejected. Zeros are fine. Any agent whose Edited + Rejected share is over 40% (with at least 3 items) gets a flag "tighten its SOP" with a recommended review task "Tighten SOP — <agent>" for Vinny to create.

Lead with the decisions Vinny must make, each with the task link and a recommended default. Change nothing: no task updates, no drafts, no sends. $ARGUMENTS
