export type VyntecClient = { slug: string; name: string; notionClient: string }
export type CockpitTask = { url: string; name: string; client: string; agent: string }
export type CockpitEvent = { time: string; title: string }
export type Cockpit = {
  review: CockpitTask[]
  blocked: CockpitTask[]
  events: CockpitEvent[]
  error: string | null
  loadedAt: string | null
}

declare module 'claude-code' {
  interface PluginState {
    'vyntec-hq': { client: VyntecClient | null; cockpit: Cockpit }
  }
}
