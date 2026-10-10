# Tests — /pilot (run in the page preview; the page stays unpublished)
1. The page exists at path `/pilot` and is NOT published.
2. Page settings: title = "Test Lab pilot page | vyntec", description matches meta.json.
3. Preview shows the heading, three bullets and the button; nothing overflows at phone width.
4. The button opens https://vyntec.co.
5. Undo: delete the page; check `/pilot` no longer appears in the funnel/site page list (read: getPagesByFunnelId).
