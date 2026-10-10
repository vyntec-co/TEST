# Claims: Dues: Delinquent (45+ Days)

Spec: SEA sub-account email template 'DRAFT – Dues: Delinquent (45+ Days)' (id 6ac77e5cf94e3d0736d586c1, DRAFT, created 2026-10-08, read via list/get-email-template on 2026-10-10).

| Fact in the copy | Source | Label |
|---|---|---|
| 45-day delinquent threshold | existing template name 'Dues: Delinquent (45+ Days)'; dues_status picklist value 'Delinquent' | REAL (as built) |
| Exempt members are not sent the delinquency sequence | workflow '"Dues – Exempt Status Suppresses Delinquency Sequence' (published); not stated in copy | REAL |
| SEA main line | SEA sub-account custom value 'sea_main_line', read via get-custom-values 2026-10-10 | REAL |
| Sender name 'Seminole Education Association' | existing draft fromName | REAL |
| Footer address and unsubscribe | {{location.full_address}} and {{email.unsubscribe_link}}, as used in the account's existing templates ('Updated Template', 'Welcome to the Group test temp') | REAL |

## Merge fields used

- `{{ custom_values.sea_main_line }}`
- `{{contact.first_name}}`
- `{{email.unsubscribe_link}}`
- `{{location.full_address}}`

## Open placeholders

- [[PAYMENT LINK — confirm with Thomas Bugos]]
- [[DELINQUENCY POLICY]]: NEEDS HUMAN, Thomas Bugos; legal wording, do not send without it. Subject says 'membership is at risk': confirm that matches policy.
