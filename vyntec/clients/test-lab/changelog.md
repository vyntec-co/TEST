# Change log

Every leadconnector write the mod let through, newest last. Undo = how to reverse it.

| Time | Agent | Task | Operation | What changed | Undo |
|---|---|---|---|---|---|
| 2026-10-11 01:44Z | chief-of-staff | VT-867 | locations.create-custom-field | {"path":{"locationId":"orGC5WISXbnF64QlfjXV"},"body":{"name":"Pilot Field","dataType":"TEXT","model":"contact"}} | locations.delete-custom-field qEphTBghjphZVgvHl3WY |
| 2026-10-11 01:44Z | chief-of-staff | VT-867 | create-tag | {"path":{"locationId":"orGC5WISXbnF64QlfjXV"},"body":{"name":"pilot"}} | delete-tag uiJ1KtDwCEfX2PBee3Gq |
| 2026-10-11 01:44Z | chief-of-staff | VT-867 | create-contact | {"body":{"locationId":"orGC5WISXbnF64QlfjXV","firstName":"Pilot","lastName":"Test","source":"vyntec pilot VT-867"}} | delete-contact 7NIoyOR5q8P0A6WHkVRB |
| 2026-10-11 01:44Z | chief-of-staff | VT-867 | add-tags | {"path":{"contactId":"7NIoyOR5q8P0A6WHkVRB"},"body":{"tags":["pilot"]}} | remove-tags (same tags) |
| 2026-10-11 01:44Z | chief-of-staff | VT-867 | update-contact | {"path":{"contactId":"7NIoyOR5q8P0A6WHkVRB"},"body":{"customFields":[{"id":"qEphTBghjphZVgvHl3WY","key":"pilot_field","field_value":"pilot"}]}} | update-contact with the values in the backup 7NIoyOR5q8P0A6WHkVRB |
| 2026-10-11 02:44Z | chief-of-staff | VT-867 | delete-contact | {"path":{"contactId":"7NIoyOR5q8P0A6WHkVRB"}} | manual: reverse delete-contact (see params) |
| 2026-10-11 02:44Z | chief-of-staff | VT-867 | delete-tag | {"path":{"locationId":"orGC5WISXbnF64QlfjXV","tagId":"uiJ1KtDwCEfX2PBee3Gq"}} | manual: reverse delete-tag (see params) |
| 2026-10-11 02:44Z | chief-of-staff | VT-867 | locations.delete-custom-field | {"path":{"locationId":"orGC5WISXbnF64QlfjXV","id":"qEphTBghjphZVgvHl3WY"}} | manual: reverse locations.delete-custom-field (see params) |
| 2026-10-11 02:45Z | chief-of-staff | VT-872 | create-email-template | {"path":{"locationId":"orGC5WISXbnF64QlfjXV"},"body":{"name":"PILOT – SEA Engagement: Welcome","editorType":"html","subjectLine":"Welcome, {{contact.first_name}}: here's how SEA engagement works","previewText":"Your involvement counts, and we keep track.","editorContent":"<!DOCTYPE html>\n<html lang | manual: reverse create-email-template (see params) 6acaf860976a2a32d91d081b |
| 2026-10-11 02:46Z | chief-of-staff | VT-872 | delete-email-template | {"path":{"locationId":"orGC5WISXbnF64QlfjXV","templateId":"6acaf860976a2a32d91d081b"}} | manual: reverse delete-email-template (see params) |
