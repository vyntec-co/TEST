# Claims: Engagement: Welcome to the Engagement Program

Spec: SEA sub-account email template 'DRAFT – Engagement: Welcome to the Engagement Program' (id 6ac77e3f9ed784b5df1e876a, DRAFT, created 2026-10-08, read via list/get-email-template on 2026-10-10).

| Fact in the copy | Source | Label |
|---|---|---|
| 10-minute meeting 3 pts; RA, SEA Board, School Board, public bargaining 5 pts each; committee meetings 10 pts; speaking at School Board 20 pts | SEA Deployment Plan (Google Doc 1BwGI1yl1PT1a083XHVgJ_tYJ7HNNDvxtgPrI_Ir8rlU, Oct 8 2026), Q11, citing 'Member Engagement 6.10.26' | REAL |
| Points for joining a committee, recruiting, serving as rep/board member/event ambassador | workflows 'Engagement - Award Points: Committee Joined / Member Recruited / Worksite Rep / Board Member / Event Ambassador' exist; values not read | REAL (activities) / values open |
| July 1 reset | clients/sea/CLAUDE.md says the annual July 1 reset is deferred; custom value engagement_reset_date is empty | open |
| Sender name 'Seminole Education Association' | existing draft fromName | REAL |
| Footer address and unsubscribe | {{location.full_address}} and {{email.unsubscribe_link}}, as used in the account's existing templates ('Updated Template', 'Welcome to the Group test temp') | REAL |

## Merge fields used

- `{{contact.engagement_points}}`
- `{{contact.first_name}}`
- `{{contact.worksite_name}}`
- `{{email.unsubscribe_link}}`
- `{{location.full_address}}`

## Open placeholders

- [[POINTS — confirm with Thomas Bugos]] x3 (committee joined, recruiting, rep/board/ambassador)
- [[DO POINTS RESET EACH JULY 1? — confirm with Thomas Bugos, or delete this line]]
