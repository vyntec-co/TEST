import { test, expect } from 'claude-code/testing'
import { parseTaskRows } from './register.js'

const NOTION_QUERY = 'mcp__Notion__notion-query-data-sources'
const GHL = 'mcp__leadconnector__execute_operation'
const DRAFT = 'mcp__Gmail__create_draft'

// The test's own hooks stand for the connectors: answer every tool the mod lets through.
// approvedRows: an Approved task exists. t0Rows: an open T0 task exists (answers the tier query only).
// opts.goLive: an Approved "Go live:" item exists. opts.ghl: the platform's answer text.
// opts.sqlLimit: SQL reads fail with Notion's usage limit. opts.viewRows: rows the saved Approved view returns.
const connectors = (on, approvedRows: boolean, t0Rows = false, opts: { goLive?: boolean; ghl?: string; sqlLimit?: boolean; viewRows?: object[] } = {}) => {
  const row = '[{"url":"https://www.notion.so/abc123def4567890abc123def4567890"}]'
  on('tool.call', { tool: NOTION_QUERY }, ($, e) => {
    const d = (e as never as { data: { params: string[]; query: string; mode?: string } }).data
    if (d.mode === 'view') return { result: [{ type: 'text', text: JSON.stringify({ results: opts.viewRows ?? [], has_more: false }) }] }
    if (opts.sqlLimit) return { result: [{ type: 'text', text: 'Your workspace has reached the usage limit for Query Data Source.' }], isError: true }
    const hit = /Go live/.test(d.query) ? opts.goLive : d.params[0] === 'T0 Autonomous' ? t0Rows : approvedRows
    return { result: [{ type: 'text', text: hit ? row : '[]' }] }
  })
  on('tool.call', { tool: 'mcp__Notion__notion-update-page' }, () => ({ result: [{ type: 'text', text: 'updated' }] }))
  on('tool.call', { tool: 'mcp__Notion__notion-create-pages' }, () => ({ result: [{ type: 'text', text: 'created' }] }))
  on('tool.call', { tool: GHL }, () => ({ result: [{ type: 'text', text: opts.ghl ?? 'created' }] }))
  on('tool.call', { tool: DRAFT }, () => ({ result: [{ type: 'text', text: 'draft saved' }] }))
}
// The kit has no disk: answer the client file read with its real opening lines.
const CS_LASER = '# Client: CS Laser Orlando (slug: cs-laser)\n\n- leadconnector location ID: `MnKKwFSetGRCrkXj7pBU` ("CS Laser Orlando"). Notion Client value: `CS Laser`.\n'
const CS_LOC = 'MnKKwFSetGRCrkXj7pBU'
const TEST_LAB = '# Client: vyntec Test Lab (slug: test-lab)\n\n- leadconnector location ID: `orGC5WISXbnF64QlfjXV` ("Enterprise Demo Test"). Notion Client value: `vyntec Test Lab`.\n'
const LAB_LOC = 'orGC5WISXbnF64QlfjXV'
const labFile = (on, files: Record<string, string> = {}) => {
  on('fs.exists', () => ({ value: true }))
  on('fs.read', ($, e, next) => {
    if (/clients\/test-lab\/CLAUDE\.md$/.test(e.path)) return { value: TEST_LAB }
    if (/clients\/cs-laser\/CLAUDE\.md$/.test(e.path)) return { value: CS_LASER }
    for (const [k, v] of Object.entries(files)) if (e.path.endsWith(k)) return { value: v }
    return next(e)
  })
}
const clientFile = on => {
  on('fs.exists', () => ({ value: true }))
  on('fs.read', ($, e, next) => (/clients\/cs-laser\/CLAUDE\.md$/.test(e.path) ? { value: CS_LASER } : next(e)))
}
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
  labFile(on)
  const set = await $.command.run({ command: 'client', args: 'test-lab' })
  expect(set.text).toMatch(/Test Lab/)
  const r = await $.tool.call({ tool: GHL, operationId: 'create-note', locationId: LAB_LOC, reason: 'VT-900 pilot note', params: { contactId: 'c1', body: 'Call recap' } } as never)
  expect(refused(r)).toBe(true)
  expect(reason(r)).toMatch(/Approved/)
})

test('a platform write is allowed with an Approved task', async ($, on) => {
  connectors(on, true)
  labFile(on)
  await $.command.run({ command: 'client', args: 'test-lab' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-note', locationId: LAB_LOC, reason: 'VT-900 pilot note', params: { contactId: 'c1', body: 'Call recap' } } as never)
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

test('cockpit lists the review queue and Approve sets the Notion status', async ($, on) => {
  const URL = 'https://www.notion.so/abc123def4567890abc123def4567890'
  const updates: unknown[] = []
  on('tool.call', { tool: NOTION_QUERY }, ($, e) => ({
    result: [{ type: 'text', text: JSON.stringify((e as never as { data: { params: string[] } }).data.params[0] === 'Needs your review'
      ? [{ url: URL, Name: 'Review: Action plan — Acme — 2026-10-09', Client: 'vyntec internal', 'Executing agent': 'chief-of-staff' }]
      : []) }],
  }))
  on('tool.call', { tool: 'mcp__Google_Calendar__list_events' }, () => ({ result: [{ type: 'text', text: '{"events":[]}' }] }))
  on('tool.list', () => ({ value: [] }))
  on('mcp.call', ($, e) => { if (e.tool === 'notion-update-page') updates.push(e.args); return { value: { content: [{ type: 'text', text: 'updated' }], isError: false } } })
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
  expect(updates[0]).toMatchObject({ page_id: 'abc123def4567890abc123def4567890', command: 'update_properties', properties: { Status: 'Approved', Outcome: 'Approved as-is' } })
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

// --- the team ---
// Sessions as `claude agents --json` lists them: the roster records session IDs at launch; pids map sockets to them.
const ROSTER = { chief: { sessionId: 'sid-chief' }, sessions: { delivery: { id: 'd1', sessionId: 'sid-del' }, social: { id: 's1', sessionId: 'sid-soc' } } }
const AGENTS = [
  { pid: 100, sessionId: 'sid-chief', name: 'chief', kind: 'interactive', status: 'busy' },
  { pid: 200, id: 'd1', sessionId: 'sid-del', name: 'delivery', kind: 'background', status: 'idle', state: 'idle' },
  { pid: 300, id: 's1', sessionId: 'sid-soc', name: 'social', kind: 'background', status: 'idle', state: 'idle' },
  { pid: 666, id: 'x9', sessionId: 'sid-other', name: 'chief-of-staff', kind: 'background', status: 'idle', state: 'idle' },
]
const TASK_URL = 'https://app.notion.com/3f5369a7789a8115bcd5d58a2bc6a5be'
const envelope = (pid: number, name: string, body: string) =>
  `<cross-session-message from="uds:/tmp/cc-socks/${pid}.sock" from-name="${name}" from-mode="prompting">\n${body}\n</cross-session-message>`

function team(on, role: string | null, opts: { notionFails?: boolean; approved?: () => unknown[] } = {}) {
  const rec = { comments: [] as string[], updates: [] as unknown[], status: [] as string[], delivered: [] as string[] }
  const mem: Record<string, unknown> = {}
  on('env.get', ($, e, next) => (e.name === 'VYNTEC_TEAM_ROLE' ? { value: role ?? undefined } : next(e)))
  on('session.id', () => ({ value: role === null ? 'sid-chief' : `sid-${role}` }))
  on('fs.read', ($, e, next) => (/\.team\/roster\.json$/.test(e.path) ? { value: JSON.stringify(ROSTER) } : next(e)))
  on('fs.write', () => ({ value: undefined }))
  on('fs.exists', () => ({ value: false }))
  on('session.root', () => ({ value: '/home/v/vyntec' }))
  on('store.get', ($, e) => ({ value: mem[e.key] }))
  on('store.set', ($, e) => { mem[e.key] = e.value; return { value: undefined } })
  on('clock.now', () => ({ value: Date.parse('2026-10-10T18:00:00Z') }))
  on('ui.status', ($, e) => { rec.status.push(String(e.text)); return { value: undefined } })
  on('process.run', () => ({ value: { exitCode: 0, stdout: JSON.stringify(AGENTS), stderr: '' } }))
  on('model.complete', () => ({ value: { isAnswered: true, text: 'Revise B3 session credits.\nRun qa-lead.', usage: { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } } }))
  on('mcp.call', ($, e) => {
    if (opts.notionFails) return { value: { content: [{ type: 'text', text: 'Notion is down' }], isError: true } }
    if (e.tool === 'notion-query-data-sources' && opts.approved && JSON.stringify(e.args).includes('"Approved"')) return { value: { content: [{ type: 'text', text: JSON.stringify({ results: opts.approved() }) }], isError: false } }
    if (e.tool === 'notion-query-data-sources') return { value: { content: [{ type: 'text', text: JSON.stringify({ results: [{ url: TASK_URL }] }) }], isError: false } }
    if (e.tool === 'notion-create-comment') rec.comments.push(String(e.args.markdown))
    if (e.tool === 'notion-update-page') rec.updates.push(e.args.properties)
    return { value: { content: [{ type: 'text', text: 'ok' }], isError: false } }
  })
  on('tool.list', () => ({ value: [] }))
  on('agent.list', () => ({ value: [{ id: 'a46965924fd941b47', description: 'qa-lead recheck', type: 'vyntec-hq:qa-lead', status: 'running' }] }))
  on('session.send', ($, e) => { rec.delivered.push(e.text); return { isDelivered: true } })
  on('session.receive', ($, e) => ({ text: e.text }))
  return rec
}
const ASSIGN = 'TASK VT-10 | FROM chief-of-staff | TO delivery | TYPE assign\nRevise B3 session credits per the D1 QA fixes; have qa-lead re-review.'

test('a message with no valid task ID is refused by the sender', async ($, on) => {
  const rec = team(on, 'delivery')
  const r = await $.session.send({ to: 'chief-of-staff', text: 'TASK none | FROM delivery | TO chief-of-staff | TYPE report\ndone' })
  expect(r.isDelivered).toBe(false)
  expect(String(r.reason)).toMatch(/TASK VT-<n>/)
  expect(rec.delivered).toEqual([])
  expect(rec.status.join(' ')).toMatch(/message refused/)
})

test('a delivery to social message is consumed at social and logged', async ($, on) => {
  const rec = team(on, 'social')
  const r = await $.session.receive({ origin: { kind: 'peer' }, text: envelope(200, 'delivery', 'TASK VT-10 | FROM delivery | TO social | TYPE question\nCan you write the post?') } as never)
  expect(String(r.consumed)).toMatch(/social takes messages only from chief-of-staff; this came from delivery/)
  expect(rec.comments[0]).toMatch(/TASK VT-10 \| FROM delivery \| TO social \| TYPE question/)
  expect(rec.comments[0]).toMatch(/CONSUMED at social/)
})

test('a message claiming to be chief-of-staff from another session is consumed', async ($, on) => {
  const rec = team(on, 'delivery')
  const r = await $.session.receive({ origin: { kind: 'peer' }, text: envelope(666, 'chief-of-staff', ASSIGN) } as never)
  expect(String(r.consumed)).toMatch(/not a team session recorded at launch/)
  // and the real chief's message passes
  const ok = await $.session.receive({ origin: { kind: 'peer' }, text: envelope(100, 'whatever', ASSIGN) } as never)
  expect(ok.consumed).toBeUndefined()
  expect(rec.comments.length).toBe(1)
})

test('a 4th assign without a report is refused and the task goes Blocked', async ($, on) => {
  const rec = team(on, null)
  for (let i = 0; i < 3; i++) expect((await $.session.send({ to: 'delivery', text: ASSIGN })).isDelivered).toBe(true)
  const fourth = await $.session.send({ to: 'delivery', text: ASSIGN })
  expect(fourth.isDelivered).toBe(false)
  expect(String(fourth.reason)).toMatch(/3 assigns without a report/)
  expect(rec.delivered.length).toBe(3)
  expect(rec.updates).toContainEqual({ Status: 'Blocked' })
  expect(rec.updates).toContainEqual({ 'Executing agent': 'head-of-delivery', Department: 'Delivery' })
  // a report resets the count and puts the task in review
  await $.session.receive({ origin: { kind: 'peer' }, text: envelope(200, 'delivery', 'TASK VT-10 | FROM delivery | TO chief-of-staff | TYPE report\nDone.') } as never)
  expect(rec.updates).toContainEqual({ Status: 'Needs your review' })
  expect((await $.session.send({ to: 'delivery', text: ASSIGN })).isDelivered).toBe(true)
})

test('the hourly hand-off cap holds new assigns', async ($, on) => {
  const rec = team(on, null)
  for (let i = 0; i < 20; i++) await $.session.send({ to: 'delivery', text: ASSIGN.replace('VT-10', `VT-${100 + i}`) })
  const held = await $.session.send({ to: 'delivery', text: ASSIGN })
  expect(held.isDelivered).toBe(false)
  expect(String(held.reason)).toMatch(/assign held: 20 hand-offs in the last hour/)
  expect(rec.status.join(' ')).toMatch(/assign held/)
})

test('a failed Notion write still delivers the message and shows a status line', async ($, on) => {
  const rec = team(on, null, { notionFails: true })
  const r = await $.session.send({ to: 'delivery', text: ASSIGN })
  expect(r.isDelivered).toBe(true)
  expect(rec.delivered.length).toBe(1)
  expect(rec.status.join(' ')).toMatch(/Notion log failed for VT-10 assign .*delivered/)
})

test('a head messaging its own subagent is not guarded', async ($, on) => {
  const rec = team(on, 'delivery')
  const r = await $.session.send({ to: 'a46965924fd941b47', text: 'Recheck N1-N5' })
  expect(r.isDelivered).toBe(true)
  expect(rec.delivered).toEqual(['Recheck N1-N5'])
})

test('a subagent note to main is not guarded', async ($, on) => {
  const rec = team(on, 'delivery')
  const r = await $.session.send({ to: 'main', text: 'subagent note' })
  expect(r.isDelivered).toBe(true)
  expect(rec.delivered).toEqual(['subagent note'])
})

test('phase-1 guards still hold inside a department session', async ($, on) => {
  team(on, 'delivery')
  connectors(on, true)
  const r = await $.tool.call({ tool: 'mcp__Gmail__send_message', to: ['a@b.co'], subject: 'hi', body: 'x' } as never)
  expect(refused(r)).toBe(true)
  const w = await $.tool.call({ tool: GHL, operationId: 'create-note', locationId: CS_LOC, params: { contactId: 'c1', body: 'x' } } as never)
  expect(reason(w)).toMatch(/no client is active/)
})

test('an agent cannot set a task to Approved', async ($, on) => {
  connectors(on, true)
  const r = await $.tool.call({ tool: 'mcp__Notion__notion-update-page', page_id: 'abc', command: 'update_properties', properties: { Status: 'Approved' } } as never)
  expect(reason(r)).toMatch(/only Vinny sets a task to Approved/)
  const c = await $.tool.call({ tool: 'mcp__claude_ai_Notion__notion-create-pages', pages: [{ properties: { Name: 'x', Status: 'Approved' } }] } as never)
  expect(refused(c)).toBe(true)
})

test('a newly Approved task wakes the chief with the department to assign it to', async ($, on) => {
  let approved = [{ url: 'https://app.notion.com/old', Name: 'Old', 'Task ID': 3, Department: 'Ops', Client: '' }]
  team(on, null, { approved: () => approved })
  const prompts: string[] = []
  on('prompt.submit', ($, e) => { prompts.push(String(e.text)); return { text: e.text } })
  on('command.register', () => ({ value: undefined }))
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  const start = { cwd: '/home/v/vyntec', surface: null, isInteractive: false, source: 'startup' } as never
  await $.session.start(start)
  expect(prompts).toEqual([]) // first check only records what is already Approved
  approved = [...approved, { url: 'https://app.notion.com/new', Name: 'Fix B3 — CS Laser', 'Task ID': 12, Department: 'Delivery', Client: 'CS Laser' }]
  await $.session.start(start)
  expect(prompts.length).toBe(1)
  expect(prompts[0]).toMatch(/VT-12 · Fix B3 — CS Laser · CS Laser → delivery/)
  expect(prompts[0]).not.toMatch(/VT-3/)
  await $.session.start(start)
  expect(prompts.length).toBe(1) // never routed twice
})

// --- phase 3: tiers and the due-date rule ---
test('a T0 Notion update runs with no approval', async ($, on) => {
  connectors(on, false)
  const r = await $.tool.call({ tool: 'mcp__Notion__notion-update-page', page_id: 'abc', command: 'update_properties', properties: { Status: 'In progress', Rollovers: 1 } } as never)
  expect(refused(r)).toBe(false)
})

test('a T0 internal note on the platform runs under an open T0 task without Approved', async ($, on) => {
  connectors(on, false, true)
  labFile(on)
  await $.command.run({ command: 'client', args: 'test-lab' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-note', locationId: LAB_LOC, reason: 'VT-900 research notes', params: { contactId: 'c1', body: 'Research notes' } } as never)
  expect(refused(r)).toBe(false)
})

test('a T1 client build is refused unless Approved, even with an open T0 task', async ($, on) => {
  connectors(on, false, true)
  labFile(on)
  await $.command.run({ command: 'client', args: 'test-lab' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-custom-field-folder', locationId: LAB_LOC, reason: 'VT-900 folder', params: { name: 'Packages' } } as never)
  expect(reason(r)).toMatch(/Approved/)
})

test('a T2 send is refused even with an Approved task', async ($, on) => {
  connectors(on, true, true)
  const r = await $.tool.call({ tool: 'mcp__Gmail__send_message', to: ['joe@example.com'], subject: 'Update', body: 'x' } as never)
  expect(refused(r)).toBe(true)
})

test('a new task with no Due and No date unticked is refused, with a reason', async ($, on) => {
  connectors(on, false)
  const parent = { type: 'data_source_id', data_source_id: '7f6f9759-bbbf-45aa-ab9a-b2448918a625' }
  const r = await $.tool.call({ tool: 'mcp__Notion__notion-create-pages', parent, pages: [{ properties: { Name: 'Email Joe — Top Truck', Status: 'Queued' } }] } as never)
  expect(reason(r)).toMatch(/needs Due .* or No date ticked. Missing on: Email Joe/)
  const ok1 = await $.tool.call({ tool: 'mcp__Notion__notion-create-pages', parent, pages: [{ properties: { Name: 'x', 'No date': '__YES__' } }] } as never)
  const ok2 = await $.tool.call({ tool: 'mcp__Notion__notion-create-pages', parent, pages: [{ properties: { Name: 'y', 'date:Due:start': '2026-10-20' } }] } as never)
  expect(refused(ok1) || refused(ok2)).toBe(false)
})


// --- phase 4: client-account rails ---
test('a client-location write is refused in this phase, even with an Approved task', async ($, on) => {
  connectors(on, true)
  clientFile(on)
  await $.command.run({ command: 'client', args: 'cs-laser' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-note', locationId: CS_LOC, reason: 'VT-900 note', params: { contactId: 'c1', body: 'x' } } as never)
  expect(reason(r)).toMatch(/read only in this phase/)
})

test('a Test Lab write must name its VT task', async ($, on) => {
  connectors(on, true)
  labFile(on)
  await $.command.run({ command: 'client', args: 'test-lab' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-tag', locationId: LAB_LOC, params: { name: 'pilot' } } as never)
  expect(reason(r)).toMatch(/name the vyntec Tasks entry/)
})

test('a bulk write without a backup is refused', async ($, on) => {
  connectors(on, true)
  labFile(on)
  on('fs.list', () => ({ value: [] }))
  await $.command.run({ command: 'client', args: 'test-lab' })
  const contacts = Array.from({ length: 10 }, (_, i) => ({ email: `p${i}@example.com` }))
  const r = await $.tool.call({ tool: GHL, operationId: 'create-note', locationId: LAB_LOC, reason: 'VT-900 bulk', params: { body: { contacts } } } as never)
  expect(reason(r)).toMatch(/Save a backup first as clients\/test-lab\/backups\/VT-900/)
})

test('go-live or publishing without a T2 yes is refused', async ($, on) => {
  connectors(on, true)
  labFile(on)
  await $.command.run({ command: 'client', args: 'test-lab' })
  const r = await $.tool.call({ tool: GHL, operationId: 'update-custom-value', locationId: LAB_LOC, reason: 'VT-900 go live', params: { body: { status: 'PUBLISHED' } } } as never)
  expect(reason(r)).toMatch(/go-live gate/)
  for (const op of ['create-blog-post', 'create-post', 'add-contact-to-workflow', 'create-redirect']) {
    const g = await $.tool.call({ tool: GHL, operationId: op, locationId: LAB_LOC, reason: 'VT-900 go live', params: { body: { status: 'PUBLISHED' } } } as never)
    expect(refused(g)).toBe(true)
  }
})

test('a second session writing while another holds the lock waits', async ($, on) => {
  connectors(on, true)
  labFile(on, { 'locks/orGC5WISXbnF64QlfjXV.json': JSON.stringify({ sessionId: 'other', role: 'delivery', at: Date.now() - 60e3 }) })
  on('session.id', () => ({ value: 'me' }))
  on('session.root', () => ({ value: '/home/v/vyntec' }))
  await $.command.run({ command: 'client', args: 'test-lab' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-tag', locationId: LAB_LOC, reason: 'VT-900 tag', params: { name: 'pilot' } } as never)
  expect(reason(r)).toMatch(/vyntec lock: the delivery session holds the lock/)
})

test('every allowed Test Lab write is appended to the change log with an undo step', async ($, on) => {
  connectors(on, true, false, { ghl: '{"tag":{"id":"tag123","name":"pilot"}}' })
  labFile(on)
  const writes: Record<string, string> = {}
  on('fs.write', ($, e) => { writes[e.path] = e.text; return { value: undefined } })
  await $.command.run({ command: 'client', args: 'test-lab' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-tag', locationId: LAB_LOC, reason: 'VT-900 add pilot tag', params: { name: 'pilot' } } as never)
  expect(refused(r)).toBe(false)
  const log = Object.entries(writes).find(([k]) => k.endsWith('clients/test-lab/changelog.md'))?.[1] ?? ''
  expect(log).toMatch(/\| VT-900 \| create-tag \| .*pilot.* \| delete-tag tag123 \|/)
})

test('Done without a QA PASS is refused on a client task', async ($, on) => {
  connectors(on, false)
  on('tool.list', () => ({ value: [] }))
  on('mcp.call', ($, e) => ({ value: { content: [{ type: 'text', text: JSON.stringify({ text: '<properties>{"Client":"CS Laser","QA":null,"Evidence":""}</properties>' }) }], isError: false } }))
  const r = await $.tool.call({ tool: 'mcp__Notion__notion-update-page', page_id: 'abc', command: 'update_properties', properties: { Status: 'Done' } } as never)
  expect(reason(r)).toMatch(/done gate: .* no QA Lead PASS/)
  const ok = await $.tool.call({ tool: 'mcp__Notion__notion-update-page', page_id: 'abc', command: 'update_properties', properties: { Status: 'Done', QA: 'PASS', Evidence: 'Read back tag pilot on contact Pilot Test' } } as never)
  expect(refused(ok)).toBe(false)
})

test('placing an asset missing from the register is refused', async ($, on) => {
  connectors(on, true)
  labFile(on, { 'clients/test-lab/assets.md': '| ID | Type | File | Source | Owner | Usage rights | Approved by | Used on |\n|---|---|---|---|---|---|---|---|\n| A1 | image | logo.png | client | vyntec | owned | Vinny 2026-10-10 | - |\n' })
  await $.command.run({ command: 'client', args: 'test-lab' })
  const r = await $.tool.call({ tool: GHL, operationId: 'upload-media-content', locationId: LAB_LOC, reason: 'VT-900 upload', params: { body: { name: 'hero.jpg' } } } as never)
  expect(reason(r)).toMatch(/(asset guard|unknown operation ID)/)
})

test('image or video generation is refused while the budget is 0', async ($, on) => {
  connectors(on, true)
  const r = await $.tool.call({ tool: 'mcp__Higgsfield__generate_image', prompt: 'truck' } as never)
  expect(refused(r)).toBe(true)
})

test('a blog post can be placed as DRAFT in the Test Lab only; any other status stays refused', async ($, on) => {
  connectors(on, true)
  labFile(on)
  await $.command.run({ command: 'client', args: 'test-lab' })
  const draft = await $.tool.call({ tool: GHL, operationId: 'create-blog-post', locationId: LAB_LOC, reason: 'VT-868 blog draft pilot', params: { body: { title: 'x', status: 'DRAFT' } } } as never)
  expect(refused(draft)).toBe(false)
  const archive = await $.tool.call({ tool: GHL, operationId: 'update-blog-post', locationId: LAB_LOC, reason: 'VT-868 undo', params: { postId: 'p1', body: { status: 'ARCHIVED' } } } as never)
  expect(refused(archive)).toBe(false)
  const live = await $.tool.call({ tool: GHL, operationId: 'create-blog-post', locationId: LAB_LOC, reason: 'VT-868', params: { body: { title: 'x', status: 'PUBLISHED' } } } as never)
  expect(refused(live)).toBe(true)
  const archiveOnCreate = await $.tool.call({ tool: GHL, operationId: 'create-blog-post', locationId: LAB_LOC, reason: 'VT-868', params: { body: { title: 'x', status: 'ARCHIVED' } } } as never)
  expect(refused(archiveOnCreate)).toBe(true)
})

test('a DRAFT blog post in a client sub-account is still refused', async ($, on) => {
  connectors(on, true)
  clientFile(on)
  await $.command.run({ command: 'client', args: 'cs-laser' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-blog-post', locationId: CS_LOC, reason: 'VT-868', params: { body: { title: 'x', status: 'DRAFT' } } } as never)
  expect(refused(r)).toBe(true)
})

test('when Notion SQL hits its usage limit, the Approved check reads the saved view instead', async ($, on) => {
  connectors(on, false, false, { sqlLimit: true, viewRows: [{ Status: 'Approved', Client: 'vyntec Test Lab', Name: 'Review: API pilot' }] })
  labFile(on)
  await $.command.run({ command: 'client', args: 'test-lab' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-tag', locationId: LAB_LOC, reason: 'VT-867 tag', params: { name: 'pilot' } } as never)
  expect(refused(r)).toBe(false)
})

test('the view fallback still refuses a write when no Approved task is for this client', async ($, on) => {
  connectors(on, false, false, { sqlLimit: true, viewRows: [{ Status: 'Approved', Client: 'CS Laser', Name: 'Review: x' }] })
  labFile(on)
  await $.command.run({ command: 'client', args: 'test-lab' })
  const r = await $.tool.call({ tool: GHL, operationId: 'create-tag', locationId: LAB_LOC, reason: 'VT-867 tag', params: { name: 'pilot' } } as never)
  expect(refused(r)).toBe(true)
  expect(reason(r)).toMatch(/Approved/)
})
