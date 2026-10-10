# Claims: Dues: Payment Failed

Spec: SEA sub-account email template 'DRAFT – Dues: Payment Failed' (id 6ac77e5087cdcc5d6e93511f, DRAFT, created 2026-10-08, read via list/get-email-template on 2026-10-10).

| Fact in the copy | Source | Label |
|---|---|---|
| SEA main line | SEA sub-account custom value 'sea_main_line', read via get-custom-values 2026-10-10 (value 407-388-1131) | REAL |
| 'Payment Failed' is a dues state | custom field contact.dues_status picklist; workflow 'Dues – Create Collections Case on Payment Failure' | REAL |
| Sender name 'Seminole Education Association' | existing draft fromName | REAL |
| Footer address and unsubscribe | {{location.full_address}} and {{email.unsubscribe_link}}, as used in the account's existing templates ('Updated Template', 'Welcome to the Group test temp') | REAL |

## Merge fields used

- `{{ custom_values.sea_main_line }}`
- `{{contact.first_name}}`
- `{{email.unsubscribe_link}}`
- `{{location.full_address}}`

## Open placeholders

- [[PAYMENT LINK — confirm with Thomas Bugos]]
- [[IS THE PAYMENT RETRIED AUTOMATICALLY, AND WHEN?]]
