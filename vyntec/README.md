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

## Checks
```
claude plugin validate ~/vyntec/vyntec-hq
claude plugin test ~/vyntec/vyntec-hq
```
