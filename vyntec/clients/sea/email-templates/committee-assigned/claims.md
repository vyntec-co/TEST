# Claims: Committee: Assigned to a Committee

Spec: SEA sub-account email template 'DRAFT – Committee: Assigned to a Committee' (id 6ac77e4775981e160fd4c427, DRAFT, created 2026-10-08, read via list/get-email-template on 2026-10-10).

| Fact in the copy | Source | Label |
|---|---|---|
| A chair contacts new committee members | existing draft; custom field contact.committee_chair_of and workflow 'Associate Chair to Committee' (published) | REAL (chairs exist) / INFERRED (they contact members) |
| Sender name 'Seminole Education Association' | existing draft fromName | REAL |
| Footer address and unsubscribe | {{location.full_address}} and {{email.unsubscribe_link}}, as used in the account's existing templates ('Updated Template', 'Welcome to the Group test temp') | REAL |

## Merge fields used

- `{{contact.first_name}}`
- `{{email.unsubscribe_link}}`
- `{{location.full_address}}`

## Open placeholders

- [[COMMITTEE NAME — confirm merge source]]: no contact field holds the assigned committee (only committees_of_interest, multi-select). Either the workflow sets it per committee, or a field is added.
- Subject made generic (the draft subject had a [COMMITTEE NAME] placeholder in it).
