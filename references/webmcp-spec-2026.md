# WebMCP Specification — Current State (mid-2026)

> Web Model Context Protocol. W3C Web Machine Learning Community Group.
> Spec: https://webmachinelearning.github.io/webmcp/ · Repo: https://github.com/webmachinelearning/webmcp
> Chrome docs: https://developer.chrome.com/docs/ai/webmcp
>
> **This file supersedes the early-2026 draft.** A breaking migration happened
> after ~March 2026. If you read older notes citing `navigator.modelContext`,
> `provideContext`, `navigator.webmcp`, or a readable `.tools` array — they are
> stale. See "What changed" at the bottom.

## Entry point

`document.modelContext` (interface `ModelContext`).

- `navigator.modelContext` is **deprecated as of Chrome 150** but still works.
- Always use the shim: `const mc = document.modelContext || navigator.modelContext;`
- `navigator.webmcp` was **never real** — do not probe for it.

## Page-side API (the site registers tools)

```js
const mc = document.modelContext || navigator.modelContext;

mc.registerTool({
  name: "add_to_cart",          // required, unique
  description: "Adds an item.", // required, natural language
  inputSchema: { /* JSON Schema */ },        // optional
  annotations: { readOnlyHint: false, untrustedContentHint: false }, // optional
  async execute(input) {        // required
    await app.cart.add(input);
    return `Added. Cart total: ${app.cart.total}`;   // plain value/string
  }
});

mc.unregisterTool("add_to_cart");
```

- **`provideContext` and the `state` field are GONE.** Register tools incrementally
  with `registerTool` / `unregisterTool`. There is no "register all + state" call,
  and passing page state to the agent was removed from the spec.
- **`execute` returns a plain value (string is typical).** The old MCP-style
  `{ content: [{ type: "text", text }] }` envelope is no longer the contract
  (may still be tolerated as `any`, but don't rely on it).
- Page state that an agent needs should be exposed as a **read-only tool**
  (`annotations.readOnlyHint: true`), e.g. `get_active_item`, not via `provideContext`.

## Agent-side API (how an external agent discovers + calls tools)

There is **no readable `.tools` array** on the modelContext object. Reading
`mc.tools` returns `undefined`. Discovery and execution are async methods:

```js
const tools  = await mc.getTools();              // -> [{name, description, inputSchema, annotations}], alphabetical
const result = await mc.executeTool(name, input); // -> the tool's return value
```

- For a **Puppeteer/CDP-driven** agent the privileged path is `page.webmcp.tools()`
  + the returned `WebMCPTool.execute({...})`, with `toolsadded` / `toolsremoved` /
  `toolinvoked` / `toolresponded` events. Requires Chrome 150+ `--enable-features=WebMCP`.
- For an agent that only has an **inject-JS / evaluate-script** capability (most CLI
  agents via a chrome-devtools MCP), use `getTools()` / `executeTool()` from injected JS.
- `getTools()` / `executeTool()` are shipping in Chrome **ahead of full spec text**
  (marked TODO in the spec repo) — signatures may shift. Code defensively (fallbacks).

## Declarative HTML API (still current)

Form attributes expose tools with no JS:

```html
<form toolname="find_experiences"
      tooldescription="Searches for experiences."
      toolautosubmit action="/search">
  <input name="location" toolparamdescription="City, e.g. Melbourne">
  <button type="submit">Search</button>
</form>
```

`toolname`, `tooldescription`, `toolautosubmit` (form) and `toolparamdescription`
(field) are real and current. Experimental.

## Security model

- Secure context only (HTTPS or localhost). Same-origin: an agent only sees tools
  the current document registered.
- Annotations: `readOnlyHint` (default false), `untrustedContentHint` (default false).
- **No standardised confirmation API.** The spec only conveys hints and defers the
  human-in-the-loop prompt to the user agent. (`agent.requestUserInteraction()` from
  a Feb-2026 editor post predates the `navigator`→`document` move and is not in the
  current spec — do not depend on it.)

## Browser availability

- Chrome: preview in 146 Canary (Feb 2026) → origin trial from 149 → `navigator`
  alias deprecated in 150. Flag: `chrome://flags/#enable-webmcp-testing` (Enabled).
  Automation: launch with `--enable-features=WebMCP`.
- Edge: native support reported ~147 (Microsoft co-develops; unconfirmed on a primary doc).
- Polyfill: `@mcp-b/webmcp-polyfill` (mcp-b.ai / WebMCP-org), targets `document.modelContext`.
- No WebMCP support → `document.modelContext` is `undefined`; the skill must say so
  rather than hallucinate tools.

## mcp-b.ai

Community reference implementation on top of the W3C spec: polyfill, React hooks
(`@mcp-b/react-webmcp`), transports, and a browser extension that bridges page tools
to external MCP agents. Useful for local dev; not the spec itself.

## What changed since the early-2026 draft (migration checklist)

| Old (≈ Mar 2026) | Now (mid-2026) |
| --- | --- |
| `navigator.modelContext` | `document.modelContext` (shim the fallback) |
| `navigator.webmcp` alias | never real — remove |
| `provideContext({ state, tools })` | removed — use `registerTool`/`unregisterTool` |
| page `state` passed to agent | removed — expose as a read-only tool |
| read `ctx.tools` array | `await mc.getTools()` (no array) |
| call `tool.execute()` off the array | `await mc.executeTool(name, input)` |
| `execute` returns `{content:[{type,text}]}` | returns a plain value/string |
| `readOnlyHint` | still valid (+ `untrustedContentHint`) |
| declarative `toolname`/`tooldescription`/`toolautosubmit` | still valid |

*Sources: webmachinelearning.github.io/webmcp (24 Jun 2026); developer.chrome.com/docs/ai/webmcp (imperative + declarative, May–Jun 2026); pptr.dev/guides/webmcp; github.com/webmachinelearning/webmcp; docs.mcp-b.ai.*
