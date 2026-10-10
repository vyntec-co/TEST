---
description: Daily brief from the chief-of-staff: decisions needed, today's calendar, review queue, NEEDS HUMAN items, waiting items.
---

Use the `chief-of-staff` agent to write today's daily brief, following its Output format.

Pull, read-only:
1. vyntec Tasks (data source in `sops/work-tracking.md`): Status = Needs your review (oldest first), Status = Blocked (these are the NEEDS HUMAN items), and anything with Due before today that isn't Done.
2. Today's Google Calendar events on the primary calendar.
3. `Waiting:` tasks that are past their Due date.

Lead with the decisions Vinny must make, each with the task link and a recommended default. Change nothing: no task updates, no drafts, no sends. $ARGUMENTS
