// vyntec-hq mod v2: approval guards, white-label guard, /client, cockpit pane, and the team (hub-and-spoke sessions).
import { atom, read, update } from 'claude-code'

// The team roster and its limits: the only place they are defined.
// One named Claude Code session per row. Specialists stay subagents inside their head's session.
// receivesFrom: the sessions whose messages this one accepts ('vinny' = typed by Vinny, never a peer message).
export const TEAM = {
  chief: 'chief-of-staff',
  sessions: {
    'chief-of-staff':     { agent: 'chief-of-staff',             model: 'opus',   department: 'Chief of Staff',      receivesFrom: ['vinny', 'delivery', 'social', 'sales', 'customer-relations'] },
    delivery:             { agent: 'head-of-delivery',           model: 'sonnet', department: 'Delivery',            receivesFrom: ['chief-of-staff'] },
    social:               { agent: 'vp-of-social',               model: 'sonnet', department: 'Social',              receivesFrom: ['chief-of-staff'] },
    sales:                { agent: 'head-of-sales-onboarding',   model: 'sonnet', department: 'Sales & Onboarding',  receivesFrom: ['chief-of-staff'] },
    'customer-relations': { agent: 'head-of-customer-relations', model: 'sonnet', department: 'Customer Relations',  receivesFrom: ['chief-of-staff'] },
  },
  maxAssignsWithoutReport: 3, // a 4th assign on a task with no report in between is refused and the task goes Blocked
  maxHandoffsPerHour: 20,     // across the team (every hand-off passes the chief); then new assigns are held
  approvalPollMinutes: 5,     // how often the chief checks vyntec Tasks for newly Approved tasks to route
}

// leadconnector operations by ID, from search_operations/describe_operation. Classes:
//   read    → allowed (still refused when aimed at a location other than the active client's)
//   write   → allowed only for the active client's location and only while it has an Approved task
//   blocked → always refused (sends messages; payments, invoices, subscriptions, phone system, billing)
// An ID missing from this table is refused, naming the ID.
// Built from search_operations/describe_operation on 2026-10-10, 546 operations. Classes: read | write | blocked.
export const GHL_OPS = {
  'GET-all-or-email-sms-templates': 'read',
  'active-numbers': 'read',
  'check-url-slug-exists': 'read',
  'download-message-transcription': 'read',
  'export-messages-by-location': 'read',
  'fb-get-ad-account': 'read',
  'fb-get-ad-accounts': 'read',
  'fb-get-campaign': 'read',
  'fb-get-campaign-publishing-progress': 'read',
  'fb-get-campaign-reporting': 'read',
  'fb-get-conversation-forms': 'read',
  'fb-get-current-user': 'read',
  'fb-get-custom-audience-by-id': 'read',
  'fb-get-custom-audiences': 'read',
  'fb-get-entity': 'read',
  'fb-get-instagram-accounts': 'read',
  'fb-get-integration': 'read',
  'fb-get-lead-form': 'read',
  'fb-get-page-lead-forms': 'read',
  'fb-get-pages': 'read',
  'fb-get-pixels': 'read',
  'fb-get-reporting': 'read',
  'fb-get-reporting-list': 'read',
  'fb-search-targeting': 'read',
  'fetch-calendar-resources': 'read',
  'fetch-config': 'read',
  'fetch-media-content': 'read',
  'fetch-redirects-list': 'read',
  'fetchAvailableCategories': 'read',
  'fetchQueueById': 'read',
  'find-associations': 'read',
  'find-event-notification': 'read',
  'generate-estimate-number': 'read',
  'generate-invoice-number': 'read',
  'get-account': 'read',
  'get-action': 'read',
  'get-affiliate': 'read',
  'get-agents': 'read',
  'get-all-blog-authors-by-location': 'read',
  'get-all-categories-by-location': 'read',
  'get-all-notes': 'read',
  'get-all-tasks': 'read',
  'get-appointment': 'read',
  'get-appointment-notes': 'read',
  'get-appointments-for-contact': 'read',
  'get-association-by-ID': 'read',
  'get-association-by-object-keys': 'read',
  'get-association-key-by-key-name': 'read',
  'get-blocked-slots': 'read',
  'get-blog-post': 'read',
  'get-blogs': 'read',
  'get-brand-voice': 'read',
  'get-bulk-action-campaign': 'read',
  'get-business': 'read',
  'get-businesses-by-location': 'read',
  'get-calendar': 'read',
  'get-calendar-events': 'read',
  'get-calendar-resource': 'read',
  'get-calendars': 'read',
  'get-call-logs': 'read',
  'get-campaign-stats': 'read',
  'get-campaigns': 'read',
  'get-categories-id': 'read',
  'get-categories-location-id': 'read',
  'get-contact': 'read',
  'get-contacts-by-businessId': 'read',
  'get-conversation': 'read',
  'get-conversation-channel': 'read',
  'get-coupon': 'read',
  'get-csv-post': 'read',
  'get-custom-field': 'read',
  'get-custom-field-by-id': 'read',
  'get-custom-fields': 'read',
  'get-custom-fields-by-object-key': 'read',
  'get-custom-value': 'read',
  'get-custom-values': 'read',
  'get-design-kit': 'read',
  'get-duplicate-contact': 'read',
  'get-email-by-id': 'read',
  'get-email-campaign': 'read',
  'get-email-template': 'read',
  'get-event-notification': 'read',
  'get-forms': 'read',
  'get-forms-submissions': 'read',
  'get-groups': 'read',
  'get-invoice': 'read',
  'get-invoice-schedule': 'read',
  'get-invoice-settings': 'read',
  'get-invoice-template': 'read',
  'get-link-by-id': 'read',
  'get-links': 'read',
  'get-list-inventory': 'read',
  'get-location': 'read',
  'get-location-tags': 'read',
  'get-lost-reason': 'read',
  'get-message': 'read',
  'get-message-recording': 'read',
  'get-message-transcription': 'read',
  'get-messages': 'read',
  'get-note': 'read',
  'get-oauth-accounts': 'read',
  'get-object-by-location-id': 'read',
  'get-object-schema-by-key': 'read',
  'get-opportunity': 'read',
  'get-order-by-id': 'read',
  'get-pipelines': 'read',
  'get-post': 'read',
  'get-price-by-id-for-product': 'read',
  'get-product-by-id': 'read',
  'get-product-collection': 'read',
  'get-product-collection-id': 'read',
  'get-product-reviews': 'read',
  'get-product-store-stats': 'read',
  'get-record-by-id': 'read',
  'get-recurring-task-by-id': 'read',
  'get-relations-by-record-id': 'read',
  'get-reviews-count': 'read',
  'get-service-booking-by-id': 'read',
  'get-service-bookings': 'read',
  'get-service-catalog-by-id': 'read',
  'get-service-location-by-id': 'read',
  'get-service-locations': 'read',
  'get-services-catalog': 'read',
  'get-shipping-carriers': 'read',
  'get-shipping-rates': 'read',
  'get-shipping-zones': 'read',
  'get-slots': 'read',
  'get-store-settings': 'read',
  'get-subscription-by-id': 'read',
  'get-surveys': 'read',
  'get-surveys-submissions': 'read',
  'get-tag-by-id': 'read',
  'get-tags-location-id': 'read',
  'get-task': 'read',
  'get-timezones': 'read',
  'get-transaction-by-id': 'read',
  'get-upload-status': 'read',
  'get-user': 'read',
  'get-workflow': 'read',
  'get-workflow-campaign': 'read',
  'getAllSchedules': 'read',
  'getAllWebsiteUrlsDataByKnowledgeBase': 'read',
  'getCalendarSchedule': 'read',
  'getCallLog': 'read',
  'getCharges': 'read',
  'getChatWidget': 'read',
  'getCrawlingStatusForLatestOperation': 'read',
  'getFileById': 'read',
  'getFilesByKnowledgeBasePublic': 'read',
  'getFunnels': 'read',
  'getKnowledgeBaseById': 'read',
  'getNumberPoolList': 'read',
  'getPagesByFunnelId': 'read',
  'getPagesCountByFunnelId': 'read',
  'getScheduleById': 'read',
  'getSpecificCharge': 'read',
  'google-get-ad-account-details': 'read',
  'google-get-ad-accounts': 'read',
  'google-get-assets': 'read',
  'google-get-audience-by-id': 'read',
  'google-get-audiences': 'read',
  'google-get-campaign-by-id': 'read',
  'google-get-campaign-reporting': 'read',
  'google-get-conversion-by-id': 'read',
  'google-get-conversion-goals': 'read',
  'google-get-conversions': 'read',
  'google-get-current-user': 'read',
  'google-get-entity': 'read',
  'google-get-integration': 'read',
  'google-get-reporting': 'read',
  'google-get-reporting-list': 'read',
  'google-get-segment-by-id': 'read',
  'google-get-segments': 'read',
  'google-get-target-interests': 'read',
  'google-search-targeting': 'read',
  'hasFunds': 'read',
  'invoices.list-invoices': 'read',
  'li-get-ad-account-details': 'read',
  'li-get-ad-accounts': 'read',
  'li-get-ad-analytics': 'read',
  'li-get-campaign-group': 'read',
  'li-get-campaign-group-reporting': 'read',
  'li-get-current-user': 'read',
  'li-get-integration': 'read',
  'li-get-lead-forms': 'read',
  'li-get-reporting-list': 'read',
  'li-search-targeting': 'read',
  'list': 'read',
  'list-affiliates': 'read',
  'list-brand-voices': 'read',
  'list-bulk-action-campaigns': 'read',
  'list-commissions': 'read',
  'list-coupons': 'read',
  'list-design-kits': 'read',
  'list-documents-contracts': 'read',
  'list-documents-contracts-templates': 'read',
  'list-email-campaigns': 'read',
  'list-email-templates': 'read',
  'list-estimate-templates': 'read',
  'list-estimates': 'read',
  'list-integration-providers': 'read',
  'list-invoice-schedules': 'read',
  'list-invoice-templates': 'read',
  'list-order-fulfillment': 'read',
  'list-order-notes': 'read',
  'list-orders': 'read',
  'list-payouts': 'read',
  'list-prices-for-product': 'read',
  'list-shipping-carriers': 'read',
  'list-shipping-rates': 'read',
  'list-shipping-zones': 'read',
  'list-subscriptions': 'read',
  'list-transactions': 'read',
  'list-workflow-campaigns': 'read',
  'listAllKnowledgeBasesPaginated': 'read',
  'listAvailableNumbersForACountry': 'read',
  'listChatWidget': 'read',
  'lookup-contact': 'read',
  'preview-estimate-template': 'read',
  'products.list-invoices': 'read',
  'search-contacts-advanced': 'read',
  'search-conversation': 'read',
  'search-locations': 'read',
  'search-object-records': 'read',
  'search-opportunities-advanced': 'read',
  'search-opportunity': 'read',
  'search-trigger-links': 'read',
  'search-users': 'read',
  'task-search': 'read',
  'voice-ai.get-agent': 'read',
  'Upsert-opportunity': 'write',
  'add-calendar-to-schedule': 'write',
  'add-followers-contact': 'write',
  'add-followers-opportunity': 'write',
  'add-message-attachments': 'write',
  'add-remove-contact-from-business': 'write',
  'add-tags': 'write', // tag-added triggers may start workflows
  'associations.create-association': 'write',
  'bulk-delete-media-objects': 'write',
  'bulk-delete-social-planner-posts': 'write', // CRM-side delete only
  'bulk-update-media-objects': 'write',
  'cancel-scheduled-email-message': 'write', // cancels a send, sends nothing
  'cancel-scheduled-message': 'write', // cancels a send, sends nothing
  'chat-widget.delete': 'write',
  'cloneChatWidget': 'write',
  'contacts.create-association': 'write', // bulk tag update; tag triggers may start workflows
  'create': 'write',
  'create-appointment': 'write', // calendar notifications may email/SMS the contact
  'create-appointment-note': 'write',
  'create-block-slot': 'write',
  'create-brand-voice': 'write',
  'create-business': 'write',
  'create-calendar': 'write',
  'create-calendar-group': 'write',
  'create-calendar-resource': 'write',
  'create-contact': 'write', // contact-created triggers may start workflows
  'create-conversation': 'write',
  'create-custom-field-folder': 'write',
  'create-custom-value': 'write',
  'create-design-kit': 'write',
  'create-email-campaign': 'write', // draft only; sending is schedule-campaign
  'create-email-template': 'write',
  'create-event-notification': 'write',
  'create-link': 'write', // creates trigger link, does not fire it
  'create-media-folder': 'write',
  'create-note': 'write',
  'create-object-record': 'write',
  'create-opportunity': 'write',
  'create-product': 'write', // product catalog only; prices are separate ops (blocked)
  'create-product-collection': 'write',
  'create-recurring-task': 'write',
  'create-relation': 'write',
  'create-service-booking': 'write', // booking notifications may fire
  'create-service-catalog': 'write',
  'create-service-location': 'write',
  'create-tag': 'write',
  'create-task': 'write',
  'create-template-folder': 'write',
  'createCalendarSchedule': 'write',
  'createChatWidget': 'write',
  'createKnowledgeBase': 'write',
  'createSchedule': 'write',
  'custom-fields.create-custom-field': 'write',
  'custom-fields.delete-custom-field': 'write',
  'custom-fields.update-custom-field': 'write',
  'delete-Business': 'write',
  'delete-appointment-note': 'write',
  'delete-association': 'write',
  'delete-brand-voice': 'write',
  'delete-calendar': 'write',
  'delete-calendar-resource': 'write',
  'delete-campaign': 'write',
  'delete-contact': 'write',
  'delete-contact-from-workflow': 'write', // removes from workflow, sends nothing
  'delete-conversation': 'write',
  'delete-csv': 'write',
  'delete-csv-post': 'write',
  'delete-custom-field-folder': 'write',
  'delete-custom-value': 'write',
  'delete-design-kit': 'write',
  'delete-email-template': 'write',
  'delete-event': 'write', // cancellation notifications may fire
  'delete-event-notification': 'write',
  'delete-group': 'write',
  'delete-link': 'write',
  'delete-media-content': 'write',
  'delete-note': 'write',
  'delete-object-record': 'write',
  'delete-opportunity': 'write',
  'delete-post': 'write', // deletes social post record
  'delete-product-by-id': 'write',
  'delete-product-collection': 'write',
  'delete-product-review': 'write',
  'delete-recurring-task': 'write',
  'delete-relation': 'write',
  'delete-service-booking': 'write', // cancellation notifications may fire
  'delete-service-catalog': 'write',
  'delete-service-location': 'write',
  'delete-tag': 'write',
  'delete-task': 'write',
  'deleteFile': 'write',
  'deleteKnowledgeBase': 'write',
  'deleteQueueItem': 'write',
  'deleteSchedule': 'write',
  'deleteTrainedUrlsForKnowledgeBase': 'write',
  'disable-group': 'write',
  'discardEditSession': 'write',
  'discoverWebsite': 'write', // crawls external site
  'edit-appointment': 'write', // calendar notifications may email/SMS the contact
  'edit-block-slot': 'write',
  'edit-group': 'write',
  'fetchCalendarList': 'write', // POST list; registry kind=write
  'fetchEditSessionCalendar': 'write', // POST list; registry kind=write
  'fetchQueueItems': 'write', // POST list; registry kind=write
  'fetchQueues': 'write', // POST list; registry kind=write
  'fetchSlots': 'write', // POST list; registry kind=write
  'get-comment-list': 'write', // POST list; registry kind=write
  'get-posts': 'write', // POST list, readonly scope; registry kind=write
  'get-statistics': 'write', // POST list, readonly scope; registry kind=write
  'get-tags-by-ids': 'write', // POST list; registry kind=write
  'getSitemapPreview': 'write', // POST lookup, readonly scope; registry kind=write
  'google-get-keyword-ideas': 'write', // POST lookup, readonly scope; registry kind=write
  'import-courses': 'write', // imports course content
  'import-email-template': 'write',
  'knowledge-base.delete': 'write',
  'locations.create-custom-field': 'write',
  'locations.delete-custom-field': 'write',
  'locations.update-custom-field': 'write',
  'patchChatWidget': 'write',
  'remove-calendar-from-schedule': 'write',
  'remove-contact-from-campaign': 'write', // removes from campaign, sends nothing
  'remove-contact-from-every-campaign': 'write', // removes from campaigns, sends nothing
  'remove-followers-contact': 'write',
  'remove-followers-opportunity': 'write',
  'remove-tags': 'write',
  'set-default-brand-voice': 'write',
  'set-default-design-kit': 'write',
  'startEditSession': 'write',
  'trainDiscoveredUrls': 'write', // trains AI knowledge base
  'update': 'write',
  'update-appointment-note': 'write',
  'update-association': 'write',
  'update-brand-voice': 'write',
  'update-business': 'write',
  'update-calendar': 'write',
  'update-calendar-resource': 'write',
  'update-contact': 'write',
  'update-conversation': 'write',
  'update-custom-field-folder': 'write',
  'update-custom-object': 'write',
  'update-custom-value': 'write',
  'update-design-kit': 'write',
  'update-display-priority': 'write',
  'update-email-campaign': 'write', // draft only
  'update-email-template': 'write',
  'update-event-notification': 'write',
  'update-inventory': 'write',
  'update-link': 'write',
  'update-media-object': 'write',
  'update-message-status': 'write', // provider delivery-status update
  'update-note': 'write',
  'update-object-record': 'write',
  'update-opportunity': 'write',
  'update-opportunity-status': 'write', // stage/status triggers may start workflows
  'update-product-by-id': 'write', // body can carry prices; price ops themselves are blocked
  'update-product-collection': 'write',
  'update-recurring-task': 'write',
  'update-service-booking': 'write', // booking notifications may fire
  'update-service-catalog': 'write',
  'update-service-location': 'write',
  'update-tag': 'write',
  'update-task': 'write',
  'update-task-completed': 'write',
  'updateCalendarSchedule': 'write',
  'updateChatWidget': 'write',
  'updateKnowledgeBase': 'write',
  'updateSchedule': 'write',
  'upsert-contact': 'write', // contact-created triggers may start workflows
  'validate-groups-slug': 'write',
  'add-an-inbound-message': 'blocked',
  'add-an-outbound-message': 'blocked', // logs outbound call (phone system)
  'add-contact-to-campaign': 'blocked',
  'add-contact-to-workflow': 'blocked',
  'attach-oauth-accounts': 'blocked', // OAuth account connection
  'auto-payment-invoice-schedule': 'blocked', // invoices/estimates
  'bulk-update-product-review': 'blocked', // publishes replies to customer reviews
  'bulkEdit': 'blocked', // edits prices in bulk
  'bulkUpdate': 'blocked', // bulk price/availability/delete
  'cancel-invoice-schedule': 'blocked', // invoices/estimates
  'charge': 'blocked',
  'cloneQueueItem': 'blocked', // auto-publishing queue
  'create-blog-post': 'blocked', // may publish blog post
  'create-comment': 'blocked', // posts public comment
  'create-config': 'blocked', // payments
  'create-coupon': 'blocked', // payments
  'create-estimate-template': 'blocked', // invoices/estimates
  'create-integration': 'blocked', // payments
  'create-integration provider': 'blocked', // payments
  'create-invoice': 'blocked', // invoices/estimates
  'create-invoice-from-estimate': 'blocked', // invoices/estimates
  'create-invoice-schedule': 'blocked', // invoices/estimates
  'create-invoice-template': 'blocked', // invoices/estimates
  'create-like': 'blocked', // public action on social platform
  'create-new-estimate': 'blocked', // invoices/estimates
  'create-order-fulfillment': 'blocked', // payments
  'create-post': 'blocked', // social publish
  'create-price-for-product': 'blocked',
  'create-redirect': 'blocked', // live website change, effectively publishing
  'create-shipping-carrier': 'blocked', // store/shipping rates charged at checkout
  'create-shipping-rate': 'blocked', // store/shipping rates charged at checkout
  'create-shipping-zone': 'blocked', // store/shipping rates charged at checkout
  'create-store-setting': 'blocked', // store/shipping rates charged at checkout
  'create-user': 'blocked', // user/permission settings
  'createQueue': 'blocked', // auto-publishing queue
  'createQueueItem': 'blocked', // auto-publishing queue
  'custom-provider-marketplace-app-update-capabilities': 'blocked', // payments
  'delete-account': 'blocked', // disconnects social account (integration)
  'delete-coupon': 'blocked', // payments
  'delete-estimate': 'blocked', // invoices/estimates
  'delete-estimate-template': 'blocked', // invoices/estimates
  'delete-integration': 'blocked', // payments
  'delete-invoice': 'blocked', // invoices/estimates
  'delete-invoice-schedule': 'blocked', // invoices/estimates
  'delete-invoice-template': 'blocked', // invoices/estimates
  'delete-like': 'blocked', // public action on social platform
  'delete-price-by-id-for-product': 'blocked',
  'delete-redirect-by-id': 'blocked', // live website change, effectively publishing
  'delete-shipping-carrier': 'blocked', // store/shipping rates charged at checkout
  'delete-shipping-rate': 'blocked', // store/shipping rates charged at checkout
  'delete-shipping-zone': 'blocked', // store/shipping rates charged at checkout
  'delete-user': 'blocked', // user/permission settings
  'deleteCharge': 'blocked',
  'deleteCurrentActivePostAndScheduleNext': 'blocked', // schedules next post for publishing
  'disconnect-config': 'blocked', // payments
  'edit-post': 'blocked', // edits scheduled/published social post
  'fb-add-custom-audience-member': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-batch-update-audience-members': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-create-conversation-form': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-create-integration': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-create-page-lead-form': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-delete-ad': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-delete-ad-account': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-delete-adset': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-delete-campaign': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-delete-custom-audience': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-delete-integration': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-delete-page': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-duplicate-ad': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-duplicate-adset': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-duplicate-campaign': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-pause-ad': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-pause-adset': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-pause-campaign': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-publish-campaign': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-remove-custom-audience-member': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-resume-ad': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-resume-adset': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-resume-campaign': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-set-default-page': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-update-custom-audience': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-upsert-ad': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-upsert-adset': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-upsert-campaign': 'blocked', // ads: spend/publishing/integration/contact upload
  'fb-upsert-pixel': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-create-integration': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-create-offline-user-list-job': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-delete-ad-account': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-delete-conversion': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-delete-segment': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-publish-ad': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-upsert-assets': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-upsert-audience': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-upsert-campaign': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-upsert-conversion': 'blocked', // ads: spend/publishing/integration/contact upload
  'google-upsert-segment': 'blocked', // ads: spend/publishing/integration/contact upload
  'li-create-integration': 'blocked', // ads: spend/publishing/integration/contact upload
  'li-create-lead-form': 'blocked', // ads: spend/publishing/integration/contact upload
  'li-delete-ad-account': 'blocked', // ads: spend/publishing/integration/contact upload
  'li-publish-campaign-group': 'blocked', // ads: spend/publishing/integration/contact upload
  'li-update-ad-status': 'blocked', // ads: spend/publishing/integration/contact upload
  'li-upsert-campaign-group': 'blocked', // ads: spend/publishing/integration/contact upload
  'live-chat-agent-typing': 'blocked', // pushes typing indicator to a live visitor
  'patch-agent': 'blocked', // voice AI (phone system)
  'purchase-number-for-location': 'blocked',
  'record-invoice': 'blocked', // invoices/estimates
  'record-order-payment': 'blocked', // payments
  'resetQueueItem': 'blocked', // auto-publishing queue
  'saveEditSession': 'blocked', // commits queue schedule (auto-publish)
  'schedule-campaign': 'blocked', // starts sending an email campaign
  'schedule-invoice-schedule': 'blocked', // invoices/estimates
  'send-a-new-message': 'blocked',
  'send-documents-contracts': 'blocked',
  'send-documents-contracts-template': 'blocked',
  'send-estimate': 'blocked', // invoices/estimates
  'send-invoice': 'blocked', // invoices/estimates
  'set-accounts': 'blocked', // social account/integration settings
  'start-csv-finalize': 'blocked', // schedules imported posts for publishing
  'text2pay-invoice': 'blocked', // invoices/estimates
  'update-and-schedule-invoice-schedule': 'blocked', // invoices/estimates
  'update-blog-post': 'blocked', // may publish blog post
  'update-coupon': 'blocked', // payments
  'update-estimate': 'blocked', // invoices/estimates
  'update-estimate-template': 'blocked', // invoices/estimates
  'update-invoice': 'blocked', // invoices/estimates
  'update-invoice-late-fees-configuration': 'blocked', // invoices/estimates
  'update-invoice-payment-methods-configuration': 'blocked', // invoices/estimates
  'update-invoice-schedule': 'blocked', // invoices/estimates
  'update-invoice-template': 'blocked', // invoices/estimates
  'update-invoice-template-late-fees-configuration': 'blocked', // invoices/estimates
  'update-price-by-id-for-product': 'blocked',
  'update-product-review': 'blocked', // publishes reply to a customer review
  'update-redirect-by-id': 'blocked', // live website change, effectively publishing
  'update-shipping-carrier': 'blocked', // store/shipping rates charged at checkout
  'update-shipping-rate': 'blocked', // store/shipping rates charged at checkout
  'update-shipping-zone': 'blocked', // store/shipping rates charged at checkout
  'update-store-status': 'blocked', // publishes/unpublishes products on storefront
  'update-user': 'blocked', // user/permission settings
  'updateQueue': 'blocked', // auto-publishing queue status
  'updateQueueItem': 'blocked', // auto-publishing queue
  'verify-email': 'blocked', // billed email verification (wallet)
  'voice-ai.create-action': 'blocked', // voice AI (phone system)
  'voice-ai.create-agent': 'blocked', // voice AI (phone system)
  'voice-ai.delete-action': 'blocked', // voice AI (phone system)
  'voice-ai.delete-agent': 'blocked', // voice AI (phone system)
  'voice-ai.update-action': 'blocked', // voice AI (phone system)
  'void-invoice': 'blocked', // invoices/estimates
}

export const TASKS_DS = 'collection://7f6f9759-bbbf-45aa-ab9a-b2448918a625'
// Connector tools are named by their server, which differs per machine (mcp__Notion__…, mcp__claude_ai_Notion__…):
// find the connected tool by its suffix, falling back to this session's spelling.
export const NOTION_QUERY = 'mcp__Notion__notion-query-data-sources'
export const CALENDAR_LIST = 'mcp__Google_Calendar__list_events'
async function resolveTool($, fallback) {
  const suffix = fallback.slice(fallback.lastIndexOf('__'))
  const server = /^mcp__([^_]+)/.exec(fallback)?.[1] ?? ''
  try {
    const found = (await $.tool.list()).find(t => t.name.endsWith(suffix) && t.name.toLowerCase().includes(server.toLowerCase()))
    return found?.name ?? fallback
  } catch { return fallback }
}

const PANE = 'vyntec-cockpit'
const client = atom({ plugin: 'vyntec-hq', key: 'client' }, null)
const cockpit = atom({ plugin: 'vyntec-hq', key: 'cockpit' }, { review: [], blocked: [], events: [], error: null, loadedAt: null })

// --- judging tool calls (pure, so the re-entry handler can use it too) ---

export const VENDOR = /gohighlevel|go high level|highlevel|leadconnector|\bghl\b/i
// Sends, publishes, charges, spends, deletes. Gmail create_draft/update_draft carry none of these words.
const OUTWARD = /send|forward|reply|respond|publish|deploy|delete|trash|remove|purge|charge|refund|pay|purchase|checkout|spam|share_file|invite|generate|upscale|outpaint|reframe|dubbing|voice_change|create_voice|motion_control|execute_preset|influencer|shorts_studio_create|remix/i
const GHL_META = new Set(['list_locations', 'search_operations', 'describe_operation'])

// What a tool call answered, as text: core sets `text`; a hook's own answer may carry only content blocks.
const toText = ran => ran.text ?? (Array.isArray(ran.result) ? ran.result.map(b => b?.text ?? '').join('\n') : JSON.stringify(ran.result ?? ''))

const isGhl = tool => /^mcp__(claude_ai_)?leadconnector__/i.test(tool)
const clientFacingPath = p => typeof p === 'string' && (/\/deliverables\//.test(p) || /\.html?$/i.test(p))

// Where a platform call is aimed: top-level locationId, or one inside params (flat or grouped).
export const targetLocation = e => {
  const p = e.params ?? {}
  return e.locationId ?? p.locationId ?? p.path?.locationId ?? p.query?.locationId ?? p.body?.locationId
}

function judgeGhl(e, active) {
  const tool = String(e.tool)
  const verb = tool.split('__').pop() ?? ''
  if (GHL_META.has(verb)) return null
  if (verb !== 'execute_operation') return { deny: `vyntec platform guard: unknown platform tool "${verb}".` }
  const op = String(e.operationId ?? '')
  const cls = Object.hasOwn(GHL_OPS, op) ? GHL_OPS[op] : undefined
  if (cls === undefined) return { deny: `vyntec platform guard: unknown operation ID "${op}". It is not in GHL_OPS (register.js); check it with describe_operation and add it there first.` }
  if (cls === 'blocked') return { deny: `vyntec platform guard: "${op}" sends messages or touches payments, invoices, subscriptions, the phone system or billing. Always refused; a human does it.` }
  const loc = targetLocation(e)
  if (active?.locationId && loc && loc !== active.locationId) return { deny: `vyntec platform guard: "${op}" is aimed at location ${loc}, but the active client is ${active.name} (${active.locationId}). Run /client for that client first.` }
  if (cls === 'read' || e.dryRun === true) return null
  if (!active) return { deny: `vyntec platform guard: "${op}" is a write and no client is active. Run /client <slug>, and have Vinny approve the task first.` }
  if (loc !== active.locationId) return { deny: `vyntec platform guard: "${op}" is a write; pass locationId ${active.locationId} (${active.name}) explicitly.` }
  if (VENDOR.test(JSON.stringify(e.params ?? {}))) return { deny: 'vyntec white-label guard: this platform write names the underlying vendor. Rewrite it as "the platform" / link.vyntec.co / Union OS.' }
  return { needsApproved: true, isT0: T0_OPS.has(op) }
}

// T0 platform writes: internal notes on a record. They run under an open T0 task, no Approved status needed.
// shortcut: an open T0 task for the active client unlocks these ops for that client, upgrade when tasks carry the exact operation they cover
const T0_OPS = new Set(['create-note', 'update-note', 'create-appointment-note', 'update-appointment-note'])
const TASKS_DS_ID = '7f6f9759-bbbf-45aa-ab9a-b2448918a625'

// Returns { deny } | { needsApproved: true } | null (allowed). `active` is the /client selection, or null.
export function judge(e, active = null) {
  const tool = String(e.tool)
  if (isGhl(tool)) return judgeGhl(e, active)
  if (/^mcp__/.test(tool) && !/^mcp__claude-code-remote__/.test(tool)) {
    const verb = tool.split('__').pop() ?? ''
    if (/gmail/i.test(tool) && /^(create|update)_draft$/.test(verb)) {
      return VENDOR.test(JSON.stringify(e)) ? { deny: 'vyntec white-label guard: this Gmail draft names the underlying vendor. Rewrite it before saving.' } : null
    }
    if (/notion/i.test(tool) && /^notion-(update-page|create-pages)$/.test(verb) && /"Status"\s*:\s*"Approved"/.test(JSON.stringify(e))) {
      return { deny: 'vyntec approval guard: only Vinny sets a task to Approved (cockpit Approve button or Notion). Put it in Needs your review.' }
    }
    if (/notion/i.test(tool) && verb === 'notion-create-pages' && JSON.stringify(e.parent ?? '').includes(TASKS_DS_ID)) {
      const undated = (e.pages ?? []).filter(pg => !pg?.properties?.['date:Due:start'] && pg?.properties?.['No date'] !== '__YES__')
      if (undated.length) return { deny: `vyntec due-date rule: every new task needs Due (from a stated or approved date) or No date ticked. Missing on: ${undated.map(pg => pg?.properties?.Name ?? '(no name)').slice(0, 5).join('; ')}.` }
    }
    if (/calendar/i.test(tool) && /^(create|update)_event$/.test(verb) && Array.isArray(e.attendees) && e.attendees.length > 0) {
      return { deny: 'vyntec guard: an event with guests sends invites. Create it without attendees, or get Vinny\'s explicit yes.' }
    }
    if (OUTWARD.test(verb)) return { deny: `vyntec guard: ${tool} sends, publishes, charges, spends or deletes. Draft it and mark it PENDING APPROVAL for Vinny.` }
    return null
  }
  if ((tool === 'Write' || tool === 'Edit') && clientFacingPath(e.file_path)) {
    const text = tool === 'Write' ? e.content : e.new_string
    if (VENDOR.test(String(text ?? ''))) return { deny: `vyntec white-label guard: ${e.file_path} is client-facing and names the underlying vendor. Say "the platform", link.vyntec.co or Union OS.` }
  }
  return null
}

// shortcut: any Approved task for the active client unlocks platform writes, upgrade when tasks carry the exact operation they approve
export async function hasApprovedTask($, notionClient) {
  const ran = await $.tool.call({
    tool: await resolveTool($, NOTION_QUERY),
    data: {
      mode: 'sql',
      data_source_urls: [TASKS_DS],
      query: `SELECT url FROM "${TASKS_DS}" WHERE "Status" = ? AND "Client" = ? LIMIT 1`,
      params: ['Approved', notionClient],
    },
  })
  if (ran.deny !== undefined || ran.isError) throw new Error(ran.deny ?? ran.text ?? 'Notion query failed')
  return /notion\.(so|com)\//.test(toText(ran))
}

export async function hasOpenT0Task($, notionClient) {
  const ran = await $.tool.call({
    tool: await resolveTool($, NOTION_QUERY),
    data: {
      mode: 'sql',
      data_source_urls: [TASKS_DS],
      query: `SELECT url FROM "${TASKS_DS}" WHERE "Approval tier" = ? AND "Client" = ? AND "Status" IN ('Queued', 'In progress') LIMIT 1`,
      params: ['T0 Autonomous', notionClient],
    },
  })
  if (ran.deny !== undefined || ran.isError) throw new Error(ran.deny ?? ran.text ?? 'Notion query failed')
  return /notion\.(so|com)\//.test(toText(ran))
}

export function parseClient(slug, text) {
  const name = /^#\s*Client:\s*(.+?)\s*\(slug/m.exec(text)?.[1] ?? slug
  const notionClient = /Notion Client value:\s*`([^`]+)`/.exec(text)?.[1] ?? name
  const locationId = /leadconnector location ID:\s*`([^`]+)`/.exec(text)?.[1] ?? null
  return { slug, name, notionClient, locationId }
}

// e. Cockpit data: review queue, NEEDS HUMAN (Blocked) and today's events.
const sqlRows = text => [...String(text).matchAll(/https:\/\/[^\s"'|)]*notion\.(?:so|com)\/[^\s"'|)]+/g)].map(m => m[0])

async function queryTasks($, status) {
  const ran = await $.tool.call({
    tool: await resolveTool($, NOTION_QUERY),
    data: { mode: 'sql', data_source_urls: [TASKS_DS], query: `SELECT url, "Name", "Client", "Executing agent" FROM "${TASKS_DS}" WHERE "Status" = ? ORDER BY createdTime LIMIT 20`, params: [status] },
  })
  if (ran.deny !== undefined || ran.isError) throw new Error(ran.deny ?? ran.text ?? 'Notion query failed')
  return parseTaskRows(toText(ran))
}

// shortcut: parses the Notion SQL answer as JSON rows or falls back to bare URLs, upgrade if the connector's answer format changes
export function parseTaskRows(text) {
  try {
    const rows = JSON.parse(text).results // the connector answers {"results":[...rows],"has_more":...}
    if (Array.isArray(rows)) return rows.map(r => ({ url: r.url, name: r.Name ?? r.url, client: r.Client ?? '', agent: r['Executing agent'] ?? '' }))
  } catch {}
  const json = /\[\s*\{[\s\S]*\}\s*\]/.exec(text)?.[0]
  if (json) {
    try {
      return JSON.parse(json).map(r => ({ url: r.url, name: r.Name ?? r.url, client: r.Client ?? '', agent: r['Executing agent'] ?? '' }))
    } catch {}
  }
  return sqlRows(text).map(url => ({ url, name: url, client: '', agent: '' }))
}

async function refresh($) {
  const today = new Date().toISOString().slice(0, 10)
  try {
    const [review, blocked, cal] = await Promise.all([
      queryTasks($, 'Needs your review'),
      queryTasks($, 'Blocked'),
      $.tool.call({ tool: await resolveTool($, CALENDAR_LIST), startTime: `${today}T00:00:00`, endTime: `${today}T23:59:59`, orderBy: 'startTime', pageSize: 25 }),
    ])
    const events = cal.deny !== undefined || cal.isError ? [] : parseEvents(toText(cal))
    await update($, cockpit, () => ({ review, blocked, events, error: null, loadedAt: new Date().toISOString().slice(11, 16) + 'Z' }))
  } catch (err) {
    await update($, cockpit, c => ({ ...c, error: `Could not load: ${String(err?.message ?? err).slice(0, 160)}` }))
  }
}

export function parseEvents(text) {
  try {
    const items = JSON.parse(text).events ?? JSON.parse(text).items ?? []
    return items.map(ev => ({ time: String(ev.start?.dateTime ?? ev.start?.date ?? '').slice(11, 16) || 'all day', title: ev.summary ?? '(no title)' }))
  } catch { return [] }
}

// Vinny's cockpit press. It goes through $.mcp.call, so the approval guard (which judges agents' tool calls) never sees it.
async function setStatus($, url, status) {
  try {
    await notion($, 'notion-update-page', { page_id: pageId(url), command: 'update_properties', properties: { Status: status }, allow_async: false })
    $.ui.toast(`Task set to ${status}.`)
  } catch (err) { $.ui.toast(`Could not set ${status}: ${String(err?.message ?? err).slice(0, 120)}`) }
  await refresh($)
}

export function summary(c) {
  const list = ts => ts.map(t => `  - ${t.name}${t.client ? ` · ${t.client}` : ''}`).join('\n') || '  (none)'
  return [
    c.error ? `vyntec cockpit: ${c.error}` : 'vyntec cockpit:',
    `Needs your review (${c.review.length}):\n${list(c.review)}`,
    `Today (${c.events.length}):\n${c.events.map(ev => `  - ${ev.time} ${ev.title}`).join('\n') || '  (none)'}`,
    `NEEDS HUMAN (${c.blocked.length}):\n${list(c.blocked)}`,
    'Approve or reject in Notion (vyntec Tasks → Status).',
  ].join('\n')
}

// --- g. The team: roster, hub-and-spoke guard, hand-off logging, limits, /team, Team tab ---

const TEAM_PANE = 'vyntec-team'
// The vyntec folder: the plugin's parent when run from source, else the session's project root (an installed
// plugin runs from the plugin cache, whose parent holds no clients/).
async function vyntecRoot($) {
  try { if (await $.fs.exists(`${$.plugin.root}/../clients`)) return `${$.plugin.root}/..` } catch {}
  return await $.session.root()
}
const teamDir = async $ => `${await vyntecRoot($)}/vyntec-hq/.team` // runtime files, gitignored
const NOTION_COMMENT = 'mcp__Notion__notion-create-comment'

// shortcut: header parsing is plain text, upgrade to structured messages if the team grows past 5 sessions.
const HEADER = /^TASK (VT-\d+) \| FROM (\S+) \| TO (\S+) \| TYPE (assign|report|blocked|question)\s*$/
export function parseHeader(text) {
  const m = HEADER.exec(String(text ?? '').split('\n')[0].trim())
  return m && TEAM.sessions[m[2]] && TEAM.sessions[m[3]] ? { task: m[1], from: m[2], to: m[3], type: m[4] } : null
}
const headerLine = h => `TASK ${h.task} | FROM ${h.from} | TO ${h.to} | TYPE ${h.type}`

// The engine wraps a peer message as <cross-session-message from="uds:/tmp/cc-socks/<pid>.sock" from-name="…">.
// from-name is whatever the sender called itself, so it is ignored; the socket's pid is matched to a session ID.
// shortcut: reads the sender pid from a Unix socket path, upgrade when sessions run on Windows (named pipes) or another machine
export function parseEnvelope(text) {
  const m = /<cross-session-message\b[^>]*\bfrom="uds:[^"]*?\/(\d+)\.sock"[^>]*>\n?([\s\S]*?)\n?<\/cross-session-message>/.exec(String(text ?? ''))
  return m ? { pid: m[1], body: m[2] } : null
}

export async function readRoster($) {
  try { return JSON.parse(await $.fs.read(`${await teamDir($)}/roster.json`)) } catch { return null }
}

async function listSessions($) {
  try {
    const { exitCode, stdout } = await $.process.run(['claude', 'agents', '--json'], { timeoutMs: 20000 })
    return exitCode === 0 ? JSON.parse(stdout) : []
  } catch { return [] }
}

// This session's team role: set at launch for a department, recorded by /team up for the chief. null outside the team.
async function teamRole($) {
  let role
  try { role = await $.env.get('VYNTEC_TEAM_ROLE') } catch {}
  if (role && TEAM.sessions[role]) return role
  const roster = await readRoster($)
  return roster?.chief?.sessionId && roster.chief.sessionId === (await $.session.id()) ? TEAM.chief : null
}

// The roster role of the session behind a socket pid, by the session ID recorded at launch; null if none matches.
async function roleOfPid($, pid, roster) {
  const sid = (await listSessions($)).find(a => String(a.pid) === String(pid))?.sessionId
  if (!sid || !roster) return null
  if (roster.chief?.sessionId === sid) return TEAM.chief
  return Object.entries(roster.sessions ?? {}).find(([, s]) => s.sessionId === sid)?.[0] ?? null
}

// Notion through $.mcp.call, retried once. Throws the last error.
async function notion($, verb, args) {
  const tool = await resolveTool($, `mcp__Notion__${verb}`)
  const server = tool.slice('mcp__'.length, tool.lastIndexOf('__'))
  let last = 'no answer'
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await $.mcp.call(server, verb, args)
      if (!r.isError) return r
      last = r.content?.map(b => b.text ?? '').join(' ') || 'error'
    } catch (err) { last = String(err?.message ?? err) }
  }
  throw new Error(last.slice(0, 160))
}

async function taskPage($, task) {
  const r = await notion($, 'notion-query-data-sources', {
    data: { mode: 'sql', data_source_urls: [TASKS_DS], query: `SELECT url FROM "${TASKS_DS}" WHERE "Task ID" = ? LIMIT 1`, params: [Number(task.slice(3))] },
  })
  const url = parseTaskRows(r.content.map(b => b.text ?? '').join('\n'))[0]?.url
  if (!url) throw new Error(`no vyntec Tasks entry ${task}`)
  return url
}
const pageId = url => /([0-9a-f]{32}|[0-9a-f-]{36})(?:[?#].*)?$/i.exec(url)?.[1] ?? url

async function summarize($, body) {
  try {
    const r = await $.model.complete({ model: 'haiku', maxTokens: 200, system: 'Summarize this hand-off message between agents in at most 3 short plain-text lines. No preamble.', prompt: body.slice(0, 8000) })
    if (r.isAnswered && r.text.trim()) return r.text.trim().split('\n').filter(Boolean).slice(0, 3).join('\n')
  } catch {}
  return body.split('\n').slice(1).filter(Boolean).slice(0, 3).join('\n').slice(0, 300)
}

// One Notion comment per message (header, summary, time) plus the status change its type calls for.
// Never throws: a failed write shows a status line and the message stays delivered.
export async function logHandoff($, h, body, note = '') {
  const time = new Date(await $.clock.now()).toISOString().slice(0, 16).replace('T', ' ') + 'Z'
  let url = null
  try {
    url = await taskPage($, h.task)
    const summary = await summarize($, body)
    await notion($, 'notion-create-comment', { page_id: pageId(url), markdown: [headerLine(h), summary, note, time].filter(Boolean).join('\n') })
    const props = h.type === 'assign' ? { 'Executing agent': TEAM.sessions[h.to].agent, Department: TEAM.sessions[h.to].department }
      : h.type === 'report' ? { Status: 'Needs your review' }
      : h.type === 'blocked' ? { Status: 'Blocked' } : null
    if (props) await notion($, 'notion-update-page', { page_id: pageId(url), command: 'update_properties', properties: props, allow_async: false })
  } catch (err) {
    $.ui.status(`vyntec team: Notion log failed for ${h.task} ${h.type} (${String(err?.message ?? err).slice(0, 100)}). The message was delivered.`)
  }
  const recent = (await $.store.get('team.recent')) ?? []
  await $.store.set('team.recent', [{ time, line: headerLine(h), note, url }, ...recent].slice(0, 10))
}

async function writeStatus($, role, patch) {
  try {
    const path = `${await teamDir($)}/status/${role}.json`
    let prev = {}
    try { prev = JSON.parse(await $.fs.read(path)) } catch {}
    await $.fs.write(path, JSON.stringify({ ...prev, ...patch, role }))
  } catch {}
}

// A delivered hand-off: counters at the chief, the session's status file, and the Notion log (the chief logs every
// hand-off once, since all of them pass through it).
async function noteHandoff($, me, h, body, note = '') {
  const now = await $.clock.now()
  await writeStatus($, me, { task: h.task, lastMessageAt: now })
  if (me !== TEAM.chief) return
  const hour = ((await $.store.get('team.handoffs')) ?? []).filter(t => now - t < 3600e3)
  await $.store.set('team.handoffs', [...hour, now])
  const assigns = (await $.store.get('team.assigns')) ?? {}
  const pending = (await $.store.get('team.pending')) ?? {}
  if (h.type === 'assign') { assigns[h.task] = (assigns[h.task] ?? 0) + 1; pending[h.task] = h.to }
  if (h.type === 'report' || h.type === 'blocked') { delete assigns[h.task]; delete pending[h.task] }
  await $.store.set('team.assigns', assigns)
  await $.store.set('team.pending', pending)
  await logHandoff($, h, body, h.type === 'blocked' ? `NEEDS HUMAN: ${h.from} is blocked; Vinny decides.${note ? ` ${note}` : ''}` : note)
}

// The chief asked for one idle notice with each assign; a department that goes idle with an assign still unreported
// leaves the task Blocked and a NEEDS HUMAN line in the cockpit.
async function onIdleNotice($, text) {
  const pending = (await $.store.get('team.pending')) ?? {}
  const roster = await readRoster($)
  const idle = Object.keys(TEAM.sessions).filter(s => s !== TEAM.chief &&
    (new RegExp(`\\b${s}\\b`).test(text) || (roster?.sessions?.[s]?.id && text.includes(roster.sessions[s].id))))
  for (const [task, to] of Object.entries(pending)) {
    if (!idle.includes(to)) continue
    delete pending[task]
    const h = { task, from: to, to: TEAM.chief, type: 'blocked' }
    await logHandoff($, h, `${headerLine(h)}\n${to} went idle without a report.`, `NEEDS HUMAN: ${to} went idle without reporting on ${task}. Vinny decides whether to reassign.`)
    await update($, cockpit, c => ({ ...c, blocked: [...c.blocked, { url: '', name: `${task}: ${to} went idle without a report`, client: '', agent: TEAM.sessions[to].agent }] }))
    $.ui.status(`vyntec team: ${task} Blocked, ${to} went idle without a report.`)
  }
  await $.store.set('team.pending', pending)
}

// Every send from a team session: header, sender, recipient and limits checked before anything leaves.
export async function guardSend($, e, next) {
  const me = await teamRole($)
  if (!me || e.to === 'main') return next(e)
  // A head talking to its own specialist subagents stays inside its session; only cross-session messages are guarded.
  try { if ((await $.agent.list()).some(a => a.id === e.to || a.teammateId === e.to)) return next(e) } catch {}
  const refuse = why => { $.ui.status(`vyntec team: ${why}`); return { isDelivered: false, reason: `vyntec team guard: ${why}` } }
  const h = parseHeader(e.text)
  if (!h) return refuse('message refused: its first line must be "TASK VT-<n> | FROM <session> | TO <session> | TYPE assign|report|blocked|question" with the vyntec Tasks ID it belongs to.')
  if (h.from !== me) return refuse(`message refused: FROM must be this session (${me}), not ${h.from}.`)
  if (!TEAM.sessions[h.to].receivesFrom.includes(me)) return refuse(`message refused: ${me} may not message ${h.to}; departments talk only to ${TEAM.chief}.`)
  const roster = await readRoster($)
  const target = String(e.to).split(' [')[0]
  const pid = /\/(\d+)\.sock$/.exec(target)?.[1]
  const ok = target === h.to || [roster?.sessions?.[h.to]?.id, roster?.sessions?.[h.to]?.sessionId, h.to === TEAM.chief ? roster?.chief?.sessionId : undefined].includes(target) ||
    (pid !== undefined && (await roleOfPid($, pid, roster)) === h.to)
  if (!ok) return refuse(`message refused: the header says TO ${h.to} but it is addressed to ${e.to}.`)
  if (me === TEAM.chief && h.type === 'assign') {
    const now = await $.clock.now()
    const hour = ((await $.store.get('team.handoffs')) ?? []).filter(t => now - t < 3600e3)
    if (hour.length >= TEAM.maxHandoffsPerHour) {
      const at = new Date(Math.min(...hour) + 3600e3).toISOString().slice(11, 16)
      return refuse(`assign held: ${hour.length} hand-offs in the last hour (limit ${TEAM.maxHandoffsPerHour}). New assigns resume at ${at}Z.`)
    }
    const assigns = ((await $.store.get('team.assigns')) ?? {})[h.task] ?? 0
    if (assigns >= TEAM.maxAssignsWithoutReport) {
      await logHandoff($, { ...h, type: 'blocked' }, e.text, `NEEDS HUMAN: ${assigns} assigns to ${h.task} without a report; a further assign was refused.`)
      return refuse(`assign refused: ${h.task} already had ${assigns} assigns without a report. The task is now Blocked for Vinny.`)
    }
  }
  const r = await next(e)
  if (r.isDelivered) await noteHandoff($, me, h, e.text)
  return r
}

// Every peer message into a team session: the sender is identified by the session ID recorded at launch.
export async function guardReceive($, e, next) {
  const me = await teamRole($)
  if (!me) return next(e)
  if (/\[Cross-session idle notice\]/.test(e.text) && !parseEnvelope(e.text)) {
    if (me === TEAM.chief) await onIdleNotice($, e.text)
    return next(e)
  }
  const env = parseEnvelope(e.text)
  if (!env) return next(e)
  const h = parseHeader(env.body)
  const roster = await readRoster($)
  const sender = await roleOfPid($, env.pid, roster)
  const allowed = TEAM.sessions[me].receivesFrom
  const why = !sender ? `the sender (pid ${env.pid}) is not a team session recorded at launch`
    : !allowed.includes(sender) ? `${me} takes messages only from ${allowed.filter(s => s !== 'vinny').join(', ')}; this came from ${sender}`
    : !h ? 'it has no valid "TASK VT-<n> | FROM | TO | TYPE" header'
    : h.from !== sender ? `the header says FROM ${h.from} but it came from the ${sender} session`
    : h.to !== me ? `the header says TO ${h.to} but this is ${me}`
    : null
  if (why) {
    $.ui.status(`vyntec team: consumed a message: ${why}.`)
    if (h) await logHandoff($, h, env.body, `CONSUMED at ${me}: ${why}.`)
    else {
      const recent = (await $.store.get('team.recent')) ?? []
      await $.store.set('team.recent', [{ time: new Date(await $.clock.now()).toISOString().slice(11, 16) + 'Z', line: `(no header) to ${me}`, note: `CONSUMED: ${why}.`, url: null }, ...recent].slice(0, 10))
    }
    return { consumed: `vyntec team guard: ${why}.` }
  }
  const r = await next(e)
  await noteHandoff($, me, h, env.body)
  return r
}

// After each assign the chief asks for one idle notice from that department.
async function withIdleNotice($, e) {
  if (e.notify_when_idle || !/^TASK VT-\d+ \| FROM \S+ \| TO \S+ \| TYPE assign/.test(String(e.message ?? ''))) return e
  return (await teamRole($)) === TEAM.chief ? { ...e, notify_when_idle: true } : e
}

// An Approved task wakes the chief, which assigns it to the department named on the task (its own ones it does itself).
// The first check only records what is already Approved, so old approvals are not re-run.
// shortcut: polls vyntec Tasks every approvalPollMinutes while the chief session is open, upgrade to a Notion webhook if approvals must start within seconds or with the chief closed
export async function pollApproved($) {
  if ((await teamRole($)) !== TEAM.chief) return
  let rows
  try {
    const r = await notion($, 'notion-query-data-sources', { data: { mode: 'sql', data_source_urls: [TASKS_DS], query: `SELECT url, "Name", "Task ID", "Department", "Client" FROM "${TASKS_DS}" WHERE "Status" = ? ORDER BY createdTime LIMIT 50`, params: ['Approved'] } })
    rows = JSON.parse(r.content.map(b => b.text ?? '').join('')).results ?? []
  } catch (err) {
    $.ui.status(`vyntec team: could not check vyntec Tasks for approvals (${String(err?.message ?? err).slice(0, 100)}).`)
    return
  }
  const seen = await $.store.get('team.dispatched')
  const ids = rows.map(r => `VT-${r['Task ID']}`)
  await $.store.set('team.dispatched', [...new Set([...(seen ?? []), ...ids])].slice(-500))
  if (seen === undefined) return // first check: only record
  const fresh = rows.filter(r => !seen.includes(`VT-${r['Task ID']}`))
  if (!fresh.length) return
  const sessionFor = dep => Object.entries(TEAM.sessions).find(([, s]) => s.department === dep)?.[0] ?? TEAM.chief
  const lines = fresh.map(r => `- VT-${r['Task ID']} · ${r.Name} · ${r.Client || 'no client'} → ${sessionFor(r.Department)} · ${r.url}`)
  $.ui.status(`vyntec team: ${fresh.length} newly Approved task(s); routing.`)
  void $.prompt.submit({ text: [
    'Vinny approved these vyntec Tasks in Notion:', ...lines, '',
    `For each one routed to a department, send that session a team message (TYPE assign) telling it to execute the approved action plan in the task. Do the ${TEAM.chief} ones yourself.`,
    'Approval covers the T1 plan in the task only. T2 items (sending, publishing, spending, charging, deleting, live-build changes) still need Vinny\'s explicit yes.',
  ].join('\n') }).catch(err => $.ui.status(`vyntec team: could not start the chief on new approvals (${String(err?.message ?? err).slice(0, 100)}).`))
}

function launchArgs(name, root) {
  const s = TEAM.sessions[name]
  const settings = {
    crossSessionInbound: 'accept',
    env: { VYNTEC_TEAM_ROLE: name },
    worktree: { bgIsolation: 'none' },
    permissions: { defaultMode: 'acceptEdits', allow: ['SendMessage', 'ListAgents', 'Skill', 'Agent', 'Read', 'Glob', 'Grep', 'mcp__Notion', 'mcp__claude_ai_Notion', 'mcp__leadconnector', 'mcp__claude_ai_leadconnector'] },
  }
  const prompt = `You are the ${name} session of the vyntec team (agent ${s.agent}). Work arrives only from ${TEAM.chief} by message. Reply with one word, ready, then wait.`
  return ['claude', '--bg', '--name', name, '--agent', `vyntec-hq:${s.agent}`, '--model', s.model, '--settings', JSON.stringify(settings), prompt]
}

// A stopped background session keeps its row (state done) but loses its pid; a finished turn is also state done.
const isLive = a => Boolean(a && a.kind === 'background' && a.pid)

async function teamUp($) {
  const root = await vyntecRoot($)
  const roster = (await readRoster($)) ?? { sessions: {} }
  roster.chief = { sessionId: await $.session.id() }
  const running = await listSessions($)
  const lines = []
  for (const name of Object.keys(TEAM.sessions)) {
    if (name === TEAM.chief) continue
    const live = running.find(a => a.name === name && isLive(a))
    if (live) { roster.sessions[name] = { id: live.id, sessionId: live.sessionId }; lines.push(`${name}: already running (${live.id})`); continue }
    const r = await $.process.run(launchArgs(name, root), { cwd: root, timeoutMs: 120000 })
    const id = /backgrounded\s*·\s*([0-9a-f]+)/.exec(r.stdout + r.stderr)?.[1]
    if (r.exitCode !== 0 || !id) { lines.push(`${name}: launch failed (${(r.stderr || r.stdout).trim().slice(0, 160)})`); continue }
    roster.sessions[name] = { id }
    lines.push(`${name}: started (${id}, ${TEAM.sessions[name].model})`)
  }
  for (const a of await listSessions($)) {
    const entry = Object.values(roster.sessions).find(s => s.id && s.id === a.id)
    if (entry) entry.sessionId = a.sessionId
  }
  await $.fs.write(`${await teamDir($)}/roster.json`, JSON.stringify(roster, null, 2))
  return `vyntec team up (claude --bg, cwd ${root}):\n${lines.join('\n')}\nchief-of-staff: this session (${roster.chief.sessionId.slice(0, 8)})`
}

async function teamDown($) {
  const roster = await readRoster($)
  const lines = []
  for (const [name, s] of Object.entries(roster?.sessions ?? {})) {
    if (!s.id) continue
    const r = await $.process.run(['claude', 'stop', s.id], { timeoutMs: 60000 })
    lines.push(`${name}: ${r.exitCode === 0 ? 'stopped' : `stop failed (${(r.stderr || r.stdout).trim().slice(0, 120)})`} (${s.id})`)
  }
  return `vyntec team down:\n${lines.join('\n') || '(no team sessions recorded)'}`
}

export async function teamRows($) {
  const roster = await readRoster($)
  const running = await listSessions($)
  const rows = []
  for (const [name, s] of Object.entries(TEAM.sessions)) {
    const sid = name === TEAM.chief ? roster?.chief?.sessionId : roster?.sessions?.[name]?.sessionId
    const live = running.find(a => sid && a.sessionId === sid)
    let st = {}
    try { st = JSON.parse(await $.fs.read(`${await teamDir($)}/status/${name}.json`)) } catch {}
    const status = !live || (name !== TEAM.chief && !isLive(live)) ? 'offline' : live.status === 'busy' ? 'working' : 'idle'
    const last = st.lastMessageAt ? new Date(st.lastMessageAt).toISOString().slice(11, 16) + 'Z' : '-'
    const usage = st.usd !== undefined ? `$${Number(st.usd).toFixed(2)}${st.contextPercent !== undefined ? ` · ${st.contextPercent}% ctx` : ''}` : '-'
    rows.push({ name, model: s.model, status, task: st.task ?? '-', last, usage })
  }
  return rows
}

export function teamText(rows, recent) {
  const pad = (v, n) => String(v).padEnd(n)
  return [
    'vyntec team:',
    `  ${pad('session', 19)}${pad('model', 7)}${pad('status', 8)}${pad('task', 7)}${pad('last msg', 9)}usage since start`,
    ...rows.map(r => `  ${pad(r.name, 19)}${pad(r.model, 7)}${pad(r.status, 8)}${pad(r.task, 7)}${pad(r.last, 9)}${r.usage}`),
    `Recent hand-offs (${recent.length}):`,
    ...recent.map(x => `  ${x.time} ${x.line}${x.note ? ` · ${x.note}` : ''}${x.url ? ` · ${x.url}` : ''}`),
  ].join('\n')
}

let approvalTimer = null

export const register = on => {
  on('tool.call', async ($, e, next) => {
    if (e.tool === 'SendMessage') return next(await withIdleNotice($, e))
    const active = isGhl(String(e.tool)) ? await read($, client) : null
    const verdict = judge(e, active)
    if (verdict === null) return next(e)
    if (verdict.deny) return { deny: verdict.deny }
    let ok = false
    try { ok = await hasApprovedTask($, active.notionClient) || (verdict.isT0 && await hasOpenT0Task($, active.notionClient)) } catch (err) {
      return { deny: `vyntec platform guard: could not check Notion for an Approved task (${String(err?.message ?? err).slice(0, 120)}). Not writing.` }
    }
    return ok ? next(e) : { deny: `vyntec platform guard: no vyntec Tasks entry for ${active.name} has status Approved${verdict.isT0 ? ' and none is an open T0 task' : ''}. Put the plan in Needs your review and wait for Vinny's approval.` }
  }).catch(($, e, next) => {
    // Re-entry (a call made beneath this hook's own $ call): judge without awaiting anything.
    if (next.error?.kind === 're-entry') { const v = judge(e); return v === null ? next(e) : { deny: v.deny ?? 'vyntec guard: platform write refused during a nested call.' } }
    return next.called ? next(e) : { deny: 'vyntec guard failed, so the call is refused.' }
  })

  // g. The team. Haiku is used only through $.model.complete, for the hand-off summaries.
  on('session.send', guardSend).catch(($, e, next) =>
    next.called ? next(e) : { isDelivered: false, reason: `vyntec team guard failed (${String(next.error?.message ?? next.error).slice(0, 120)}), so the message was not sent.` })
  on('session.receive', guardReceive).catch(($, e, next) =>
    next.called ? next(e) : { consumed: `vyntec team guard failed (${String(next.error?.message ?? next.error).slice(0, 120)}), so the message was held back.` })
  on('turn.start', async ($, e, next) => {
    const role = await teamRole($)
    if (role) await writeStatus($, role, { state: 'working', at: await $.clock.now() })
    return next(e)
  })
  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    const role = await teamRole($)
    if (role) {
      let usage = {}
      try { const u = await $.session.usage(); usage = { usd: u.cost?.usd, contextPercent: u.context?.percent, startedAt: u.startedAt } } catch {}
      await writeStatus($, role, { state: 'idle', at: await $.clock.now(), ...usage })
    }
    return r
  })

  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'client', description: 'Set the active vyntec client and load its CLAUDE.md', argumentHint: '<slug>' })
    await $.command.register({ name: 'cockpit', description: 'Open the vyntec cockpit: review queue, today, NEEDS HUMAN' })
    await $.command.register({ name: 'team', description: 'vyntec team: status, or up (start missing sessions) / down (stop them)', argumentHint: '[up|down]' })
    const role = await teamRole($)
    if (role && role !== TEAM.chief) $.ui.status(`vyntec team · ${role}`)
    try { if (!approvalTimer) approvalTimer = $.clock.every(TEAM.approvalPollMinutes * 60e3, () => { void pollApproved($) }) } catch {}
    await pollApproved($)
    const active = await read($, client)
    if (active) $.ui.status(`vyntec · ${active.name}`)
    return next(e)
  })

  // d. /client <slug>
  on('command.run', { command: 'client' }, async ($, e) => {
    const slug = e.args.trim()
    if (!/^[a-z0-9-]+$/.test(slug)) return { text: 'Usage: /client <slug>, e.g. /client cs-laser (folders under ~/vyntec/clients).' }
    let text
    try { text = await $.fs.read(`${await vyntecRoot($)}/clients/${slug}/CLAUDE.md`) } catch {
      return { text: `No client file at clients/${slug}/CLAUDE.md. Active client unchanged.` }
    }
    const active = parseClient(slug, text)
    await update($, client, () => active)
    $.ui.status(`vyntec · ${active.name}`)
    return { text: `Active client: ${active.name} (clients/${slug}/CLAUDE.md loaded).`, context: [text] }
  })

  on('command.run', { command: 'cockpit' }, async $ => {
    await refresh($)
    // Some hosts report the pane placed without drawing it (headless runs), so the transcript always gets the summary too.
    await $.ui.open({ id: PANE, title: 'vyntec cockpit' })
    return { text: summary(await read($, cockpit)) }
  })

  on('command.run', { command: 'team' }, async ($, e) => {
    const arg = e.args.trim()
    if (arg === 'up' || arg === 'down') {
      const role = await teamRole($)
      if (role && role !== TEAM.chief) return { text: `/team ${arg} runs only in the ${TEAM.chief} session; this is ${role}.` }
      if (arg === 'down') return { text: await teamDown($) }
      const text = await teamUp($)
      await pollApproved($)
      return { text }
    }
    if (arg) return { text: 'Usage: /team, /team up, /team down' }
    // Panes may not draw (headless runs), so the transcript always gets the text table too.
    await $.ui.open({ id: TEAM_PANE, title: 'vyntec cockpit · Team' })
    return { text: teamText(await teamRows($), (await $.store.get('team.recent')) ?? []) }
  })

  on('ui.render', { component: 'Pane', requestId: TEAM_PANE }, async ($, e) => {
    const { Box, Text, Button, Link } = $.ui.resolve(e)
    const rows = await teamRows($)
    const recent = (await $.store.get('team.recent')) ?? []
    const color = { working: 'yellow', idle: 'green', offline: 'gray' }
    return h(Box, { flexDirection: 'column' },
      h(Text, { bold: true }, 'Team'),
      ...rows.map(r => h(Box, { key: r.name, flexDirection: 'row', gap: 1 },
        h(Text, null, r.name.padEnd(19)), h(Text, { dimColor: true }, r.model.padEnd(7)),
        h(Text, { color: color[r.status] }, r.status.padEnd(8)), h(Text, null, r.task.padEnd(7)),
        h(Text, { dimColor: true }, r.last.padEnd(7)), h(Text, null, r.usage))),
      h(Text, { bold: true }, `Recent hand-offs (${recent.length})`),
      ...recent.map((x, i) => x.url
        ? h(Link, { key: `r${i}`, href: x.url, label: `${x.time} ${x.line}${x.note ? ` · ${x.note}` : ''}` })
        : h(Text, { key: `r${i}` }, `${x.time} ${x.line}${x.note ? ` · ${x.note}` : ''}`)),
      h(Button, { key: 'refresh', label: 'Refresh', onPress: () => $.ui.invalidate('ui.render') }))
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const c = await read($, cockpit)
    const row = (t, withButtons) => h(Box, { key: t.url, flexDirection: 'row', gap: 1 },
      h(Text, null, `${t.name}${t.client ? ` · ${t.client}` : ''}`),
      withButtons ? h(Button, { key: `ok:${t.url}`, label: 'Approve', variant: 'primary', onPress: () => setStatus($, t.url, 'Approved') }) : null,
      withButtons ? h(Button, { key: `no:${t.url}`, label: 'Reject', onPress: () => setStatus($, t.url, 'In progress') }) : null)
    return h(Box, { flexDirection: 'column' },
      c.error ? h(Text, { color: 'red' }, c.error) : null,
      h(Text, { bold: true }, `Needs your review (${c.review.length})`),
      ...c.review.map(t => row(t, true)),
      h(Text, { bold: true }, `Today (${c.events.length})`),
      ...c.events.map(ev => h(Text, { key: `ev:${ev.time}${ev.title}` }, `${ev.time}  ${ev.title}`)),
      h(Text, { bold: true }, `NEEDS HUMAN (${c.blocked.length})`),
      ...c.blocked.map(t => row(t, false)),
      h(Box, { flexDirection: 'row', gap: 1 },
        h(Button, { key: 'refresh', label: 'Refresh', onPress: () => refresh($) }),
        h(Button, { key: 'team', label: 'Team', onPress: () => $.ui.open({ id: TEAM_PANE, title: 'vyntec cockpit · Team' }) })),
      c.loadedAt ? h(Text, { dimColor: true }, `loaded ${c.loadedAt}`) : null)
  })
}
