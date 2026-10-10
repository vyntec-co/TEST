# vyntec HQ

- `CLAUDE.md`: vyntec-wide rules. `sops/`: meeting-to-action, platform-radar, work-tracking (Notion IDs). `clients/<slug>/CLAUDE.md`: everything client-specific. `ROLE-MAP.md`: old roles → new agents.
- `vyntec-hq/`: the plugin (27 agents, `vyntec-rules` and `work-tracking` skills, `/brief`, and the mod: guards, `/client`, `/cockpit`, cheap-model routing).

## Install on your PC (Claude Code v2.1.287 or later)
```
git clone <this repo> ~/vyntec-repo && ln -s ~/vyntec-repo/vyntec ~/vyntec   # or copy the folder to ~/vyntec
claude plugin marketplace add ~/vyntec
claude plugin install vyntec-hq@vyntec
```
Then `/plugin` shows vyntec-hq, `/agents` lists the vyntec-hq agents, and `/client cs-laser` sets the client. Edits to `~/vyntec/vyntec-hq` take effect after `/reload-plugins`.

## HighLevel connection (leadconnector)
The plugin ships no `.mcp.json`: in the build session leadconnector was already connected through the claude.ai sign-in, and a second copy would make two servers. On your PC, run `/mcp` first. If leadconnector is there and connected, you're done. Only if it's missing, add `vyntec-hq/.mcp.json`:
```json
{ "mcpServers": { "leadconnector": { "type": "http", "url": "https://services.leadconnectorhq.com/mcp/anthropic/v2" } } }
```
then `/reload-plugins`, open `/mcp`, sign in to LeadConnector and pick the sub-accounts to allow.

## Checks
```
claude plugin validate ~/vyntec/vyntec-hq
claude plugin test ~/vyntec/vyntec-hq
```
