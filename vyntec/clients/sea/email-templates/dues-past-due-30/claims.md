# Claims: Dues: Past Due (30+ Days)

Spec: SEA sub-account email template 'DRAFT – Dues: Past Due (30+ Days)' (id 6ac77e5887cdcc5d6e935195, DRAFT, created 2026-10-08, read via list/get-email-template on 2026-10-10).

| Fact in the copy | Source | Label |
|---|---|---|
| 30-day past-due threshold | existing template name 'Dues: Past Due (30+ Days)'; dues_status picklist value 'Past Due' | REAL (as built) |
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
- [[PAST-DUE POLICY WORDING]]: open per Deployment Plan Q9 and Will Dishman list #2
