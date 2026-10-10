// vyntec-hq mod v1: approval guards, white-label guard, /client, cockpit pane, cheap-model routing.
import { atom, read, update } from 'claude-code'

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
export const NOTION_UPDATE = 'mcp__Notion__notion-update-page'
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
  return { needsApproved: true }
}

// Returns { deny } | { needsApproved: true } | null (allowed). `active` is the /client selection, or null.
export function judge(e, active = null) {
  const tool = String(e.tool)
  if (isGhl(tool)) return judgeGhl(e, active)
  if (/^mcp__/.test(tool) && !/^mcp__claude-code-remote__/.test(tool)) {
    const verb = tool.split('__').pop() ?? ''
    if (/gmail/i.test(tool) && /^(create|update)_draft$/.test(verb)) {
      return VENDOR.test(JSON.stringify(e)) ? { deny: 'vyntec white-label guard: this Gmail draft names the underlying vendor. Rewrite it before saving.' } : null
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

async function setStatus($, url, status) {
  const page_id = /([0-9a-f]{32}|[0-9a-f-]{36})(?:[?#].*)?$/i.exec(url)?.[1] ?? url
  const ran = await $.tool.call({ tool: await resolveTool($, NOTION_UPDATE), page_id, command: 'update_properties', properties: { Status: status }, allow_async: false })
  if (ran.deny !== undefined || ran.isError) $.ui.toast(`Could not set ${status}: ${String(ran.deny ?? ran.text).slice(0, 120)}`)
  else $.ui.toast(`Task set to ${status}.`)
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

export const register = on => {
  on('tool.call', async ($, e, next) => {
    const active = isGhl(String(e.tool)) ? await read($, client) : null
    const verdict = judge(e, active)
    if (verdict === null) return next(e)
    if (verdict.deny) return { deny: verdict.deny }
    let ok = false
    try { ok = await hasApprovedTask($, active.notionClient) } catch (err) {
      return { deny: `vyntec platform guard: could not check Notion for an Approved task (${String(err?.message ?? err).slice(0, 120)}). Not writing.` }
    }
    return ok ? next(e) : { deny: `vyntec platform guard: no vyntec Tasks entry for ${active.name} has status Approved. Put the plan in Needs your review and wait for Vinny's approval.` }
  }).catch(($, e, next) => {
    // Re-entry (a call made beneath this hook's own $ call): judge without awaiting anything.
    if (next.error?.kind === 're-entry') { const v = judge(e); return v === null ? next(e) : { deny: v.deny ?? 'vyntec guard: platform write refused during a nested call.' } }
    return next.called ? next(e) : { deny: 'vyntec guard failed, so the call is refused.' }
  })

  // f. Triage and logging go to a cheaper model; everything else keeps the default.
  on('agent.spawn', ($, e, next) =>
    e.model === undefined && /\b(triage|triaging|log|logging)\b/i.test(`${e.description} ${e.subagentType}`)
      ? next({ ...e, model: 'haiku' })
      : next(e))

  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'client', description: 'Set the active vyntec client and load its CLAUDE.md', argumentHint: '<slug>' })
    await $.command.register({ name: 'cockpit', description: 'Open the vyntec cockpit: review queue, today, NEEDS HUMAN' })
    const active = await read($, client)
    if (active) $.ui.status(`vyntec · ${active.name}`)
    return next(e)
  })

  // d. /client <slug>
  on('command.run', { command: 'client' }, async ($, e) => {
    const slug = e.args.trim()
    if (!/^[a-z0-9-]+$/.test(slug)) return { text: 'Usage: /client <slug>, e.g. /client cs-laser (folders under ~/vyntec/clients).' }
    let text
    try { text = await $.fs.read(`${$.plugin.root}/../clients/${slug}/CLAUDE.md`) } catch {
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
      h(Button, { key: 'refresh', label: 'Refresh', onPress: () => refresh($) }),
      c.loadedAt ? h(Text, { dimColor: true }, `loaded ${c.loadedAt}`) : null)
  })
}
