# Change log

Every leadconnector write the mod let through, newest last. Undo = how to reverse it.

| Time | Agent | Task | Operation | What changed | Undo |
|---|---|---|---|---|---|
| 2026-10-11 01:44Z | chief-of-staff | VT-867 | locations.create-custom-field | {"path":{"locationId":"orGC5WISXbnF64QlfjXV"},"body":{"name":"Pilot Field","dataType":"TEXT","model":"contact"}} | locations.delete-custom-field qEphTBghjphZVgvHl3WY |
| 2026-10-11 01:44Z | chief-of-staff | VT-867 | create-tag | {"path":{"locationId":"orGC5WISXbnF64QlfjXV"},"body":{"name":"pilot"}} | delete-tag uiJ1KtDwCEfX2PBee3Gq |
| 2026-10-11 01:44Z | chief-of-staff | VT-867 | create-contact | {"body":{"locationId":"orGC5WISXbnF64QlfjXV","firstName":"Pilot","lastName":"Test","source":"vyntec pilot VT-867"}} | delete-contact 7NIoyOR5q8P0A6WHkVRB |
| 2026-10-11 01:44Z | chief-of-staff | VT-867 | add-tags | {"path":{"contactId":"7NIoyOR5q8P0A6WHkVRB"},"body":{"tags":["pilot"]}} | remove-tags (same tags) |
| 2026-10-11 01:44Z | chief-of-staff | VT-867 | update-contact | {"path":{"contactId":"7NIoyOR5q8P0A6WHkVRB"},"body":{"customFields":[{"id":"qEphTBghjphZVgvHl3WY","key":"pilot_field","field_value":"pilot"}]}} | update-contact with the values in the backup 7NIoyOR5q8P0A6WHkVRB |
