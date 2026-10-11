---
name: platform-ai
description: How vyntec agents work with the platform's AI features through the leadconnector MCP — Voice AI agents and their actions, knowledge bases (FAQs, website training, files), call logs, chat widgets — and what is UI-only (AI Studio apps, Conversation AI / AI Employee bots, Agent Studio, Ask AI). Use when a task mentions an AI agent, voice agent, chatbot, knowledge base, FAQ training, AI Studio, Agent Studio or Ask AI.
---

# Platform AI (leadconnector MCP)

**Owner:** head-of-delivery · **Builders:** account-architect, workflow-engineer · **Checks:** qa-lead
Read with `sops/build-capabilities.md` (routes, Test Lab, change log) and `sops/app-backend-standard.md` (AI Studio apps).
Operation list read from the MCP catalogue on 2026-10-11 (`search_operations` / `describe_operation`). Re-check with `search_operations` before a build: the catalogue changes.

## 1. What the MCP can and can't reach

| Feature | Route | Operations | Mod class today |
|---|---|---|---|
| **Voice AI agents** (phone agents) | API | read: `get-agents`, `voice-ai.get-agent` · write: `voice-ai.create-agent`, `patch-agent`, `voice-ai.delete-agent` | reads allowed; **writes blocked** (phone system) |
| Voice AI actions (transfer, booking, SMS, workflow, data extraction, knowledge base, custom API) | API | read: `get-action` · write: `voice-ai.create-action`, `voice-ai.update-action`, `voice-ai.delete-action` | reads allowed; **writes blocked** |
| Voice AI call logs | API | `get-call-logs` (filter by agent, contact, dates), `getCallLog` | read |
| **Knowledge bases** (what AI agents answer from) | API | `listAllKnowledgeBasesPaginated`, `getKnowledgeBaseById`, `createKnowledgeBase` (max 15 per location), `updateKnowledgeBase`, `deleteKnowledgeBase` | read / write |
| KB FAQs | API | `list`, `create` (question, answer, knowledgeBaseId), `update`, `knowledge-base.delete` | read / write |
| KB website training | API | `getSitemapPreview` → `discoverWebsite` (url, option Exact/Path/Domain, knowledgeBaseId, preSelectedUrls, autoTrain) → `getCrawlingStatusForLatestOperation` → `trainDiscoveredUrls` (knowledgeBaseId, operationId, urlIds) · list `getAllWebsiteUrlsDataByKnowledgeBase` · undo `deleteTrainedUrlsForKnowledgeBase` | write (status is read) |
| KB files | API (list/delete only) | `getFilesByKnowledgeBasePublic`, `getFileById`, `deleteFile` | upload is **Browser** |
| Chat widgets | API (read) | `listChatWidget` (filter by `voiceAiAgentId`) | read |
| Brand voice (AI writing tone) | API | `get-brand-voice` · write: `create-brand-voice`, `update-brand-voice`, `set-default-brand-voice`, `delete-brand-voice` | read / write |
| **AI Studio** (apps, Cloud backend, Payments) | Browser / Human only | none in the MCP | — see `sops/app-backend-standard.md` |
| **Conversation AI / AI Employee bots, Agent Studio agents** | Browser / Human only | none found (searched "conversation ai bot", "agent studio") | — |
| **Ask AI** (the in-app assistant) | Human only | none — it is a UI assistant, not an API | — |

Unknown operation IDs are refused by the mod; describe them and add them to `GHL_OPS` first (adding needs no approval; reclassifying a blocked op does).

## 2. Rules (on top of vyntec-rules)
- **Test Lab first.** Writes run only in the vyntec Test Lab this phase (`/client test-lab`, reason starts with the `VT-n`). The mod logs each write to `clients/test-lab/changelog.md`.
- **A knowledge base feeds a live AI.** In a client account, any KB change used by a live bot or voice agent changes what real customers hear: treat it as go-live (T2, its own `Go live:` item). New KBs not yet attached to an agent are T1.
- **Voice AI writes stay blocked** until Vinny says otherwise: an agent can answer and place real calls, send SMS (A2P gate) and book appointments. Build voice agents as a **spec** (below) for Vinny to apply, or ask him to lift the block for the Test Lab only.
- **Truth in prompts and FAQs.** Only facts from the client file, brand kit proof points, or the client's own words. No prices unless the client published them; no medical, legal or results claims (CS Laser: HIPAA hold — no health data in a KB or agent prompt).
- **White label.** Client-facing names: "your AI assistant", "your voice agent", "your knowledge base" on link.vyntec.co / Union OS. Never the vendor's feature names (AI Employee, Agent Studio, Ask AI, AI Studio) in anything a client sees.
- **Deletes are T2** except undoing your own pilot record in the Test Lab under an approved plan.

## 3. Recipes

**Build a knowledge base from FAQs (API, T1)**
1. `listAllKnowledgeBasesPaginated` — reuse one if it fits (limit 15).
2. `createKnowledgeBase` {name, description}. Undo: `deleteKnowledgeBase`.
3. For each Q&A from the approved source: `create` {question, answer, knowledgeBaseId}. Keep answers short and sourced; put the source in the task, not the answer.
4. Read back with `list` {knowledgeBaseId}; count matches the source.

**Train a KB on website pages (API, T1)**
1. `getSitemapPreview` to see URLs (no crawl).
2. `discoverWebsite` {url, option: "Exact" for one page / "Path" / "Domain", knowledgeBaseId, preSelectedUrls, autoTrain: false}.
3. Poll `getCrawlingStatusForLatestOperation` {knowledgeBaseId, operationId} until done.
4. `getAllWebsiteUrlsDataByKnowledgeBase` → pick the url ids → `trainDiscoveredUrls` {knowledgeBaseId, operationId, urlIds}. Only pages the client owns and approved.
5. Undo: `deleteTrainedUrlsForKnowledgeBase`.

**Voice AI agent spec (Human applies while writes are blocked)**
Write in the task, using the API's own fields so it can be applied later as-is:
`agentName` (≤40) · `businessName` · `welcomeMessage` (≤190) · `agentPrompt` · `language` (en-US…) · `patienceLevel` · `maxCallDuration` (180–900 s) · `agentWorkingHours` + `timezone` · `inboundNumber` (none until A2P/phone decisions) · `callEndWorkflowIds` · `sendPostCallNotificationTo`.
Actions, each with `triggerPrompt`: CALL_TRANSFER (number), APPOINTMENT_BOOKING (calendarId, daysOfOfferingDates, slotsPerDay, hoursBetweenSlots), KNOWLEDGE_BASE (knowledgeBaseId), DATA_EXTRACTION (contactFieldId, description, examples), WORKFLOW_TRIGGER (workflowId), SMS (messageBody — A2P gate), CUSTOM_ACTION (apiDetails — needs Vinny).
Test plan: a test call from Vinny's phone; then `get-call-logs` {agentId} and `getCallLog` for the transcript as Evidence.

**Review how an agent is doing (read, T0)**
`get-agents` → `voice-ai.get-agent` → `get-call-logs` {agentId, startDate, endDate} → summarise calls, transfers, bookings, failures. Never copy caller personal data into Notion; link the call log instead.

**AI Studio, Conversation AI bots, Agent Studio, Ask AI**
No MCP route. Write the click path in the task (Browser / Human only), using the platform's UI as Vinny sees it, and mark it INFERRED until he confirms. For AI Studio apps follow `sops/app-backend-standard.md`. Ask AI is something Vinny can use inside the app; agents don't drive it — they use the MCP reads above instead.

## 4. Done
QA PASS from qa-lead with Evidence (read-back counts, a call log, or the trained URL list), the change log row, and the client's approval if the task needs it (`sops/work-tracking.md`).
