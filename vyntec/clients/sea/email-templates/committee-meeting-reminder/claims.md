# Claims: Committee: Meeting Reminder

Spec: SEA sub-account email template 'DRAFT – Committee: Meeting Reminder' (id 6ac77e4a1cdda3621d1b204b, DRAFT, created 2026-10-08, read via list/get-email-template on 2026-10-10).

| Fact in the copy | Source | Label |
|---|---|---|
| Committee meetings earn 10 points | SEA Deployment Plan (Google Doc 1BwGI1yl1PT1a083XHVgJ_tYJ7HNNDvxtgPrI_Ir8rlU, Oct 8 2026), Q11 | REAL |
| Meeting dates per committee | SEA Deployment Plan (Google Doc 1BwGI1yl1PT1a083XHVgJ_tYJ7HNNDvxtgPrI_Ir8rlU, Oct 8 2026), Q4: TBD, set after launch | open |
| Sender name 'Seminole Education Association' | existing draft fromName | REAL |
| Footer address and unsubscribe | {{location.full_address}} and {{email.unsubscribe_link}}, as used in the account's existing templates ('Updated Template', 'Welcome to the Group test temp') | REAL |

## Merge fields used

- `{{contact.first_name}}`
- `{{email.unsubscribe_link}}`
- `{{location.full_address}}`

## Open placeholders

- [[MEETING DATE]] in subject and [[MEETING DATE/TIME]] in body: if sent from a committee calendar, swap for the appointment date merge field
- [[COMMITTEE NAME]]
- [[MEETING LOCATION OR VIDEO LINK]]
- [[ANYTHING TO BRING OR REVIEW]]
