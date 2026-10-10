# Claims: Engagement: Points Earned

Spec: SEA sub-account email template 'DRAFT – Engagement: Points Earned' (id 6ac77e359ed784b5df1e8659, DRAFT, created 2026-10-08, read via list/get-email-template on 2026-10-10).

| Fact in the copy | Source | Label |
|---|---|---|
| Points come from meetings attended, colleagues recruited, committees joined | workflows 'Engagement - Award Points: Member Recruited' / 'Committee Joined' (published) and Deployment Plan Q11 (meeting attendance points) | REAL |
| Seminole County | worksite picklist (contact.worksite_name) lists Seminole County schools; wording from the existing draft | INFERRED |
| Members have a worksite rep | custom field contact.is_worksite_rep; workflow 'Member Joins Worksite - Link to Reps' | REAL |
| Sender name 'Seminole Education Association' | existing draft fromName | REAL |
| Footer address and unsubscribe | {{location.full_address}} and {{email.unsubscribe_link}}, as used in the account's existing templates ('Updated Template', 'Welcome to the Group test temp') | REAL |

## Merge fields used

- `{{contact.engagement_points}}`
- `{{contact.engagement}}`
- `{{contact.first_name}}`
- `{{contact.worksite_name}}`
- `{{email.unsubscribe_link}}`
- `{{location.full_address}}`

## Open placeholders

- None.
