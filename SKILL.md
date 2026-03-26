---
name: webmcp-native
description: Use when the agent needs to interact with a web application to perform searches, bookings, or state-based actions on a WebMCP-compliant site.
---

# WebMCP Native

## Overview
This skill provides a standardized protocol for AI agents to discover and interact with WebMCP (Web Model Context Protocol) capabilities. It shifts the agent's behavior from fragile visual scraping to deterministic API-based interaction.

## When to Use
- Interacting with websites that implement the 2026 WebMCP standard.
- Performing complex web tasks (search, checkout, state updates) where high reliability is required.
- Situations where token efficiency is critical (WebMCP tool calls use ~90% fewer tokens than HTML snapshots).

## Discovery Workflow
Before attempting visual scraping or DOM manipulation on a new URL, the agent must perform this handshake:

1.  **Probe the Well-Known Path:** Attempt to retrieve `/.well-known/webmcp.json`.
2.  **Scan for Link Tags:** Look for `<link rel="webmcp" href="...">` in the document head.
3.  **Monitor Handshake Logs:** Watch the browser console for the initialization string `[WebMCP] Discovery: navigator.modelContext is ready.`
4.  **Confirm API Availability:** Verify `!!navigator.modelContext` via script evaluation.

### Reporting Discovery
Once WebMCP is detected, the agent should confirm the available tools to the user:
> "WebMCP v1.3 detected. Prioritizing deterministic tools for [intent]."

## Implementation
Tools are executed via the `navigator.modelContext` API using `evaluate_script`.

### Tool Execution Pattern
```javascript
async (params) => {
  const modelContext = navigator.modelContext;
  const tool = modelContext.tools.find(t => t.name === "TOOL_NAME");
  if (!tool) throw new Error("Tool not found");
  return await tool.execute(params);
}
```

### Self-Correction
If a tool call fails or the agent loses synchronization with the page state, call the `audit_capabilities` tool (if available) to retrieve a fresh logic map from the application before reverting to visual heuristics.

## Common Mistakes
- **Scraping First:** Falling back to `take_snapshot` before checking for a manifest.
- **Ignoring Context:** Failing to check `navigator.modelContext.state` which often contains crucial data like `active_product_id`.
- **Stale Tool Registration:** Attempting to call tools before the `[WebMCP] Discovery` signal has fired.

## References
For detailed mechanics, see [references/webmcp-spec-2026.md](references/webmcp-spec-2026.md).
