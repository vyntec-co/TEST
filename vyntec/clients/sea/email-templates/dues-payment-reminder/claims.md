# Claims: Dues: Payment Reminder

Spec: SEA sub-account email template 'DRAFT – Dues: Payment Reminder' (id 6ac77e54e6a28b9ad5cc187c, DRAFT, created 2026-10-08, read via list/get-email-template on 2026-10-10).

| Fact in the copy | Source | Label |
|---|---|---|
| Dues fund representation and bargaining | existing draft copy; SEA has a Bargaining committee (contact.committees_of_interest) and a case intake for member representation (Cases workflows) | INFERRED |
| SEA main line | SEA sub-account custom value 'sea_main_line', read via get-custom-values 2026-10-10 | REAL |
| Dues amounts NOT stated | SEA Deployment Plan (Google Doc 1BwGI1yl1PT1a083XHVgJ_tYJ7HNNDvxtgPrI_Ir8rlU, Oct 8 2026) Q9 gives FT $733.00/yr and PT $325.20/yr, but no contact field says which a member pays, so amounts are left out | n/a |
| Sender name 'Seminole Education Association' | existing draft fromName | REAL |
| Footer address and unsubscribe | {{location.full_address}} and {{email.unsubscribe_link}}, as used in the account's existing templates ('Updated Template', 'Welcome to the Group test temp') | REAL |

## Merge fields used

- `{{ custom_values.sea_main_line }}`
- `{{contact.first_name}}`
- `{{email.unsubscribe_link}}`
- `{{location.full_address}}`

## Open placeholders

- [[PAYMENT LINK — confirm with Thomas Bugos]]
