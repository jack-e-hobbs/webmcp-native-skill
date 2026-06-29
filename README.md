# WebMCP Native Skill

An agent skill that lets a CLI coding agent act through a website's **WebMCP**
(Web Model Context Protocol) tools instead of scraping the DOM. The agent detects
`document.modelContext`, enumerates tools with `getTools()`, and runs them with
`executeTool()` — all via its browser MCP's evaluate-script tool.

- **Reliable:** interactions survive UI changes — they call the site's own API contract.
- **Efficient:** deterministic tool calls instead of multi-step DOM scraping.
- **Honest:** if a page has no WebMCP, the skill says so and falls back to the DOM.

Tracks the current spec (mid-2026): `document.modelContext`, `getTools()`/`executeTool()`,
plain-value returns. See [`references/webmcp-spec-2026.md`](references/webmcp-spec-2026.md).

## Requirements

- A browser MCP with an evaluate-script tool (e.g. the chrome-devtools MCP).
- A WebMCP-capable browser **for real sites**: Chrome 149+ with
  `chrome://flags/#enable-webmcp-testing` set to Enabled (or launched with
  `--enable-features=WebMCP`), or a page that ships `@mcp-b/webmcp-polyfill`.
  Without support, `document.modelContext` is `undefined` and the skill falls back.

## Install

Copy this folder into your Claude Code skills directory:

```bash
cp -r webmcp-native-skill ~/.claude/skills/webmcp-native
```

The agent loads it on demand when a task involves discovering/calling a site's WebMCP tools.

## Verify

1. Open a WebMCP-capable page (e.g. the AmazingExperiences demo) in your flagged browser.
2. Ask the agent: *"Discover this site's WebMCP tools and list them."*
   → expect a tool list (e.g. `search_experiences`, `get_availability`, …).
3. Ask: *"Use the WebMCP tools to find Melbourne experiences."*
   → expect a deterministic `executeTool("search_experiences", { location: "Melbourne" })`
   call returning results, not DOM scraping.

## License
MIT
