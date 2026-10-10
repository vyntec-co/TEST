# Claims: Engagement: New Level Reached

Spec: SEA sub-account email template 'DRAFT – Engagement: New Level Reached' (id 6ac77e3b1cdda3621d1b1eca, DRAFT, created 2026-10-08, read via list/get-email-template on 2026-10-10).

| Fact in the copy | Source | Label |
|---|---|---|
| Engagement levels exist (Member, Supporter, Contributor, Mobilizer, Advocate, Organizer, Influencer, Ambassador, Legend) | custom field 'Engagement Level' (contact.engagement) picklist | REAL |
| Seminole County | worksite picklist; wording from the existing draft | INFERRED |
| Sender name 'Seminole Education Association' | existing draft fromName | REAL |
| Footer address and unsubscribe | {{location.full_address}} and {{email.unsubscribe_link}}, as used in the account's existing templates ('Updated Template', 'Welcome to the Group test temp') | REAL |

## Merge fields used

- `{{contact.engagement_points}}`
- `{{contact.engagement}}`
- `{{contact.first_name}}`
- `{{email.unsubscribe_link}}`
- `{{location.full_address}}`

## Open placeholders

- [[RECOGNITION OR BENEFIT FOR THIS LEVEL — confirm with Thomas Bugos, or delete this line]]
- Point thresholds per level are not stated (none on file). Workflow 'Contact - Recalculate Engagement Tier' is still a draft, so this email has no live trigger yet.
