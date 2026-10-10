import { test, expect } from 'claude-code/testing'
import { parseTaskRows } from './register.js'

const NOTION_QUERY = 'mcp__Notion__notion-query-data-sources'
const GHL = 'mcp__leadconnector__execute_operation'
const DRAFT = 'mcp__Gmail__create_draft'

// The test's own hooks stand for the connectors: answer every tool the mod lets through.
const connectors = (on, approvedRows: boolean) => {
  on('tool.call', { tool: NOTION_QUERY }, () => ({
    result: [{ type: 'text', text: approvedRows ? '[{"url":"https://www.notion.so/abc123def4567890abc123def4567890"}]' : '[]' }],
  }))
  on('tool.call', { tool: GHL }, () => ({ result: [{ type: 'text', text: 'created' }] }))
  on('tool.call', { tool: DRAFT }, () => ({ result: [{ type: 'text', text: 'draft saved' }] }))
}
// The kit has no disk: answer the client file read with its real opening lines.
const CS_LASER = '# Client: CS Laser Orlando (slug: cs-laser)\n\n- leadconnector location ID: `MnKKwFSetGRCrkXj7pBU` ("CS Laser Orlando"). Notion Client value: `CS Laser`.\n'
const CS_LOC = 'MnKKwFSetGRCrkXj7pBU'
const clientFile = on => on('fs.read', ($, e, next) => (/clients\/cs-laser\/CLAUDE\.md$/.test(e.path) ? { value: CS_LASER } : next(e)))
const refused = (r: { deny?: string; isError?: boolean; text?: string }) => r.deny !== undefined || r.isError === true
const reason = (r: { deny?: string; text?: string }) => String(r.deny ?? r.text ?? '')

test('a send call is refused', async ($, on) => {
  connectors(on, true)
  const r = await $.tool.call({ tool: 'mcp__Gmail__send_message', to: ['a@b.co'], subject: 'hi', body: 'x' } as never)
  expect(refused(r)).toBe(true)
  expect(reason(r)).toMatch(/vyntec guard/)
})

test('a draft naming HighLevel is refused', async ($, on) => {
  connectors(on, true)
  const r = await $.tool.call({ tool: DRAFT, to: ['a@b.co'], subject: 'Recap', body: 'Your new HighLevel workflow is live' } as never)
  expect(refused(r)).toBe(true)
  expect(reason(r)).toMatch(/white-label/)
})

test('a draft without the vendor name passes', async ($, on) => {
  connectors(on, true)
  const r = await $.tool.call({ tool: DRAFT, to: ['a@b.co'], subject: 'Recap', body: 'Your new link.vyntec.co workflow is ready for review' } as never)
  expect(refused(r)).toBe(false)
})

test('a platform write is refused without an Approved task', async ($, on) => {
  connectors(on, false)
  clientFile(on)
  const set = await $.command.run({ command: 'client', args: 'cs-laser' })
  expect(set.text).toMatch(/CS Laser/)
  const r = await $.tool.call({ tool: GHL, operationId: 'create-note', locationId: CS_LOC, params: { contactId: 'c1', body: 'Call recap' } } as never)
  expect(refused(r)).toBe(true)
  expect(reason(r)).toMatch(/Approved/)
})

test('a platform write is allowed with an Approved task', async ($, on) => {
  connectors(on, true)
  clientFile(on)
  await $.command.run({ command: 'client', args: 'cs-laser' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-note', locationId: CS_LOC, params: { contactId: 'c1', body: 'Call recap' } } as never)
  expect(refused(r)).toBe(false)
})

test('a platform send is refused even with an Approved task', async ($, on) => {
  connectors(on, true)
  clientFile(on)
  await $.command.run({ command: 'client', args: 'cs-laser' })
  const r = await $.tool.call({ tool: GHL, operationId: 'send-a-new-message', locationId: CS_LOC, params: { type: 'SMS', message: 'hi' } } as never)
  expect(refused(r)).toBe(true)
})

test('/client cs-laser loads the file and names the client', async ($, on) => {
  clientFile(on)
  const r = await $.command.run({ command: 'client', args: 'cs-laser' })
  expect(r.text).toBe('Active client: CS Laser Orlando (clients/cs-laser/CLAUDE.md loaded).')
  expect(String(r.context?.[0])).toMatch(/MnKKwFSetGRCrkXj7pBU/)
})

test('triage subagents go to haiku, others keep the default', async ($, on) => {
  const seen: (string | undefined)[] = []
  on('agent.spawn', ($, e) => { seen.push(e.model); return { model: e.model ?? 'inherit' } })
  await $.agent.spawn({ subagentType: 'general-purpose', description: 'Triage inbox', prompt: 'x' } as never).catch(() => {})
  await $.agent.spawn({ subagentType: 'general-purpose', description: 'Write proposal', prompt: 'x' } as never).catch(() => {})
  expect(seen).toEqual(['haiku', undefined])
})

test('cockpit lists the review queue and Approve sets the Notion status', async ($, on) => {
  const URL = 'https://www.notion.so/abc123def4567890abc123def4567890'
  const updates: unknown[] = []
  on('tool.call', { tool: NOTION_QUERY }, ($, e) => ({
    result: [{ type: 'text', text: JSON.stringify((e as never as { data: { params: string[] } }).data.params[0] === 'Needs your review'
      ? [{ url: URL, Name: 'Review: Action plan — Acme — 2026-10-09', Client: 'vyntec internal', 'Executing agent': 'chief-of-staff' }]
      : []) }],
  }))
  on('tool.call', { tool: 'mcp__Google_Calendar__list_events' }, () => ({ result: [{ type: 'text', text: '{"events":[]}' }] }))
  on('tool.call', { tool: 'mcp__Notion__notion-update-page' }, ($, e) => { updates.push(e); return { result: [{ type: 'text', text: 'updated' }] } })
  on('ui.open', () => ({ value: { isPlaced: true } }))
  await $.command.run({ command: 'cockpit', args: '' })
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'vyntec-hq', surface, component: 'Pane', requestId: 'vyntec-cockpit',
      props: { title: 'vyntec cockpit', isFocused: true, bodyColumns: 80, placement: 'dock', scroll: undefined as never } })
    expect(await ui.find({ type: 'Text', text: /Needs your review \(1\)/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /Review: Action plan — Acme/ })).toBeDefined()
    await ui.press({ key: `ok:${URL}` })
    await ui.unmount()
  }
  expect(updates.length).toBe(2)
  expect(updates[0]).toMatchObject({ page_id: 'abc123def4567890abc123def4567890', command: 'update_properties', properties: { Status: 'Approved' } })
})

test('parses the Notion connector answer format', async () => {
  const rows = parseTaskRows('{"results":[{"url":"https://app.notion.com/p/abc","Name":"Review: x","Client":"SEA","Executing agent":"chief-of-staff"}],"has_more":false,"data_source_ids":["7f"]}')
  expect(rows).toEqual([{ url: 'https://app.notion.com/p/abc', name: 'Review: x', client: 'SEA', agent: 'chief-of-staff' }])
  expect(parseTaskRows('{"results":[],"has_more":false}')).toEqual([])
})

test('the claude.ai connector spelling of the platform tool is guarded too', async ($, on) => {
  on('tool.call', { tool: 'mcp__claude_ai_leadconnector__execute_operation' }, () => ({ result: [{ type: 'text', text: 'sent' }] }))
  const r = await $.tool.call({ tool: 'mcp__claude_ai_leadconnector__execute_operation', operationId: 'send-a-new-message', params: {} } as never)
  expect(refused(r)).toBe(true)
})

test('a platform read operation is allowed', async ($, on) => {
  connectors(on, false)
  const r = await $.tool.call({ tool: GHL, operationId: 'get-contact', locationId: CS_LOC, params: { contactId: 'c1' } } as never)
  expect(refused(r)).toBe(false)
})

test('list_locations, search_operations and describe_operation are allowed', async ($, on) => {
  const verbs = ['list_locations', 'search_operations', 'describe_operation']
  for (const verb of verbs) on('tool.call', { tool: `mcp__leadconnector__${verb}` }, () => ({ result: [{ type: 'text', text: '{}' }] }))
  for (const verb of verbs) {
    const r = await $.tool.call({ tool: `mcp__leadconnector__${verb}`, query: 'x', operationId: 'get-contact' } as never)
    expect(refused(r)).toBe(false)
  }
})

test('an unknown operation ID is refused and named', async ($, on) => {
  connectors(on, true)
  clientFile(on)
  await $.command.run({ command: 'client', args: 'cs-laser' })
  const r = await $.tool.call({ tool: GHL, operationId: 'frobnicate-everything', locationId: CS_LOC, params: {} } as never)
  expect(refused(r)).toBe(true)
  expect(reason(r)).toMatch(/frobnicate-everything/)
})

test('a write to another location than the active client is refused', async ($, on) => {
  connectors(on, true)
  clientFile(on)
  await $.command.run({ command: 'client', args: 'cs-laser' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-note', locationId: 'N3zKau5efQgmMBf9XUGj', params: { contactId: 'c1', body: 'x' } } as never)
  expect(refused(r)).toBe(true)
  expect(reason(r)).toMatch(/N3zKau5efQgmMBf9XUGj/)
})
