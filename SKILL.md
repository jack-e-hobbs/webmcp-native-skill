---
name: webmcp-native
description: Use when navigating to a website to discover and call its WebMCP tools instead of scraping the DOM. Detects document.modelContext, enumerates tools via getTools(), and executes them via executeTool() — driven through a browser MCP's evaluate-script tool.
---

# WebMCP Native

Discover and call a website's **WebMCP** tools (`document.modelContext`) so you act
through the site's own deterministic API instead of scraping the DOM.

You do this through your browser MCP's **evaluate-script** tool
(`mcp__chrome-devtools__evaluate_script`). All WebMCP calls run as JavaScript you pass to
that tool. WebMCP tools are **not** native agent tools — never try to call a tool name directly.

Full protocol details: [references/webmcp-spec-2026.md](references/webmcp-spec-2026.md).
Read it if anything below fails — the API ships ahead of the spec and may shift.

## 1. Discover

Navigate to the page, then pass this **plain async arrow function** to evaluate-script.
(Do NOT wrap it in an IIFE like `(async () => {...})()` — the evaluate-script tool
invokes the function for you; a pre-invoked IIFE throws `fn is not a function`.)

```javascript
async () => {
  const mc = document.modelContext || navigator.modelContext;   // shim: navigator.* is deprecated
  if (!mc) return { present: false };
  const tools = typeof mc.getTools === 'function'
    ? await mc.getTools()                                        // current API
    : (Array.isArray(mc.tools) ? mc.tools : []);                 // legacy fallback only
  return {
    present: true,
    canExecute: typeof mc.executeTool === 'function',
    tools: tools.map(t => ({ name: t.name, description: t.description, inputSchema: t.inputSchema }))
  };
}
```

- `present: false` → the site/browser has no WebMCP. Say so plainly and fall back to
  normal DOM interaction. Do not invent tools. (Browser support needs Chrome 149+ with
  `chrome://flags/#enable-webmcp-testing`, or an equivalent polyfill — see references.)
- There is **no readable `.tools` array** on a spec-compliant page; `getTools()` is the
  real path. The fallback exists only for older/polyfilled pages.

## 2. Execute (CRITICAL)

Write a fresh function per call with the tool name and params **inlined** (don't rely on
passing args through the evaluate-script `args` field — it's for element handles):

```javascript
async () => {
  const mc = document.modelContext || navigator.modelContext;
  const NAME  = "search_experiences";          // <- the tool you chose
  const INPUT = { location: "Melbourne" };      // <- params matching its inputSchema
  if (typeof mc.executeTool === 'function') {
    // The agent-side executeTool you reach (injected polyfill — Claude extension /
    // chrome-devtools bridge) wants (NAME, inputOBJECT). Do NOT JSON.stringify the
    // input: the polyfill won't throw, it just runs with no params (search returns
    // ALL rows). Native Chrome's DevTools console differs — (toolObject, jsonString)
    // — handled as a fallback below. Verified live, mid-2026.
    try { return await mc.executeTool(NAME, INPUT); }
    catch {
      const tools = typeof mc.getTools === 'function' ? await mc.getTools() : [];
      const tool = tools.find(t => t.name === NAME);
      return await mc.executeTool(tool, JSON.stringify(INPUT));
    }
  }
  // legacy fallback (older/polyfilled pages exposing tool.execute):
  const tools = typeof mc.getTools === 'function' ? await mc.getTools() : (mc.tools || []);
  const tool = tools.find(t => t.name === NAME);
  if (!tool || typeof tool.execute !== 'function') throw new Error("Tool not executable: " + NAME);
  return await tool.execute(INPUT);
}
```

Return value: current tools return a **plain value/string**. Older tools may return
`{ content: [{ type: "text", text }] }` — handle both (read `.content?.[0]?.text` if present,
else use the value directly).

## 3. Affirm

Once tools are discovered, tell the user briefly:
> "WebMCP detected — using deterministic tools for [intent]. Available: [names]."

Then prefer these tools over clicking/scraping for the rest of the task.

## Notes

- **Mutating tools** (booking, payment, anything without `annotations.readOnlyHint: true`)
  may trigger a browser human-in-the-loop prompt. There is no standardised confirmation
  API — let the browser handle consent; don't try to suppress it.
- **Telemetry tools** are site-specific, not part of the protocol. If discovery surfaces a
  tool whose description says to call it on discovery (e.g. `track_discovery`), call it once;
  otherwise ignore. Never assume such a tool exists.
- **Stale closures:** a React site may register tools that read live state via refs. If a
  result looks stale, re-run discovery — tools can be added/removed as the user navigates.

## Troubleshooting

- `fn is not a function` → you passed an IIFE. Pass a bare `async () => {...}`.
- `present: false` but you expected support → wrong browser/flag, or the page registered on
  `navigator.modelContext` only and your build dropped the alias — the shim covers both, so
  it genuinely lacks WebMCP. Fall back to DOM.
- Empty `getTools()` → the page hasn't registered yet (SPA still mounting). Re-run discovery
  after a short wait or after the relevant view loads.

---
*Created by Jack Hobbs. Spec tracked in references/webmcp-spec-2026.md.*
