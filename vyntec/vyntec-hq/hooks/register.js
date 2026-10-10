// vyntec-hq mod v1: approval guards, white-label guard, /client, cockpit pane, cheap-model routing.
import { atom, read, update } from 'claude-code'

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
const GHL_OUTWARD = /send|delete|remove|refund|charge|payment|invoice|order|subscription|transaction|coupon|campaign|publish|bulk/i
const GHL_READ = /^(get|list|search|lookup|count|check|find)-/i

// What a tool call answered, as text: core sets `text`; a hook's own answer may carry only content blocks.
const toText = ran => ran.text ?? (Array.isArray(ran.result) ? ran.result.map(b => b?.text ?? '').join('\n') : JSON.stringify(ran.result ?? ''))

const isGhl = tool => /^mcp__(claude_ai_)?leadconnector__/i.test(tool)
const clientFacingPath = p => typeof p === 'string' && (/\/deliverables\//.test(p) || /\.html?$/i.test(p))

// Returns { deny } | { needsApproved: true } | null (allowed).
export function judge(e) {
  const tool = String(e.tool)
  if (isGhl(tool)) {
    if (!/execute_operation$/.test(tool)) return null // search/describe/list_locations are reads
    if (e.dryRun === true) return null
    const op = String(e.operationId ?? '')
    if (GHL_OUTWARD.test(op)) return { deny: `vyntec guard: platform operation "${op}" sends, charges or deletes. That needs Vinny's explicit yes and a human runs it.` }
    if (GHL_READ.test(op)) return null
    if (VENDOR.test(JSON.stringify(e.params ?? {}))) return { deny: 'vyntec white-label guard: this platform write names the underlying vendor. Rewrite it as "the platform" / link.vyntec.co / Union OS.' }
    return { needsApproved: true }
  }
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
  return { slug, name, notionClient }
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
    const verdict = judge(e)
    if (verdict === null) return next(e)
    if (verdict.deny) return { deny: verdict.deny }
    const active = await read($, client)
    if (!active) return { deny: 'vyntec GHL write guard: no active client. Run /client <slug>, and have Vinny approve the task in Notion first.' }
    let ok = false
    try { ok = await hasApprovedTask($, active.notionClient) } catch (err) {
      return { deny: `vyntec GHL write guard: could not check Notion for an Approved task (${String(err?.message ?? err).slice(0, 120)}). Not writing.` }
    }
    return ok ? next(e) : { deny: `vyntec GHL write guard: no vyntec Tasks entry for ${active.name} has status Approved. Put the plan in Needs your review and wait for Vinny's approval.` }
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
