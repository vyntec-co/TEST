# Claims: Dues: Resolved / Paid

Spec: SEA sub-account email template 'DRAFT – Dues: Resolved / Paid' (id 6ac77e5f87cdcc5d6e93525b, DRAFT, created 2026-10-08, read via list/get-email-template on 2026-10-10).

| Fact in the copy | Source | Label |
|---|---|---|
| Next billing date | SEA sub-account custom field 'Dues Renewal/Next Billing Date' (contact.dues_renewalnext_billing_date), read via get-custom-fields 2026-10-10 | REAL (field exists; population not checked) |
| Sender name 'Seminole Education Association' | existing draft fromName | REAL |
| Footer address and unsubscribe | {{location.full_address}} and {{email.unsubscribe_link}}, as used in the account's existing templates ('Updated Template', 'Welcome to the Group test temp') | REAL |

## Merge fields used

- `{{contact.dues_renewalnext_billing_date}}`
- `{{contact.first_name}}`
- `{{email.unsubscribe_link}}`
- `{{location.full_address}}`

## Open placeholders

- [[CONFIRM next billing date field is filled for every member]]
