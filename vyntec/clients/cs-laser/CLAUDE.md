# Client: CS Laser Orlando (slug: cs-laser)

- Legal name: CS Laser LLC. Client contact: Courtney.
- leadconnector location ID: `MnKKwFSetGRCrkXj7pBU` ("CS Laser Orlando", REAL: list_locations 2026-10-10). Notion Client value: `CS Laser`.
- Courtney's Oct 6 answers (legal name, policies, hours, session lengths, packages and prices, package rules) are in the Vyntec sub-account conversation. Read them before treating package, price, deposit, expiry, refund, no-show, transfer or missed-installment questions as open.

## Consent, intake and health forms (forms-consent-engineer)
Signature forms and workflows include the Electrolysis Consent Packet (W3a), Tattoo Consent Packet (W3b), Form 5 Health History Addendum and Form 6 Patch Test Waiver; 24 health screening fields; some forms are sent by a workflow before the first visit, or only when "Takes Pain Medication = Yes", and must not be attached to a service; photo consent; an Accutane window decision (6 or 2 months); Sticky Contacts must be off on a shared tablet. Courtney first asked for HIPAA compliance (Oct 6); on Oct 7 Vinny decided to hold off on HIPAA and move forward without it. Don't block forms on HIPAA pricing or BAAs; still keep health data to what the forms need, flag the open choice of online vs paper health history as NEEDS HUMAN, and keep waiver and release wording and the "non-invasive" claim marked NEEDS ATTORNEY APPROVAL.

## Packages and payments (payments-engineer)
Electrolysis packages (15/30/45/60-minute sessions) and Tattoo Removal packages (XS/S/M/L), each with a pay-in-full price and a payment-plan price (deposit then installments). The card is saved at first payment. Custom fields: Sessions Remaining, On Payment Plan, Package Details. Workflows add sessions on purchase, subtract one when a Package Session is booked, and add one back on a timely cancellation; the credit workflow must never add sessions twice for one purchase. Tests use a $1 plan and a refund. Payment processing is moving from Stripe to Noomerik: confirm which processor the account uses before specifying products.

## Dashboard and pipelines (dashboard-pipeline-builder)
Dashboard "CS Laser Overview" (default range This month), ten widgets in four rows: Consults Booked; Consult to Client Conversion; Revenue (payments, sum of succeeded); Clients Due or Overdue; Consult Funnel; Lost Reasons; Active Clients by Stage; Appointments by Status; Consults by Source; Revenue by Month. Pipelines "Consult -> Client" and "Active Clients", moved by workflows W6 to W9a. Smart lists wanted: Due for Rebook, Overdue, Forms missing, Photo consent refused.
