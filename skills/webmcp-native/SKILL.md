---
name: webmcp-native
description: Use when navigating to websites or interacting with web-based interfaces to perform functional tasks like searching, filtering, or initiating transactions.
---

# WebMCP Native

## Overview
This skill establishes a standardized protocol for discovering and interacting with WebMCP (Web Model Context Protocol) capabilities. It prioritizes deterministic API-based interaction over fragile visual scraping.

## When to Use
- Navigating to a URL where agent-native capabilities might exist.
- Performing complex web tasks (search, checkout, state updates).
- Optimizing for token efficiency and interaction reliability.

## Handshake Protocol
Before attempting visual scraping or DOM manipulation, perform this discovery sequence:

1.  **Standard Probe:** Attempt to retrieve `/.well-known/webmcp.json`.
2.  **HTML Hinting:** Scan for `<link rel="webmcp" href="...">` in the head.
3.  **Active Verification:** Evaluate `!!navigator.modelContext` via script.

### Confirming Discovery
Once WebMCP is detected, report to the user:
> "WebMCP v1.3 detected. I am using the deterministic logic contract for this site."

## Implementation
Execute tools via the `navigator.modelContext` API.

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
If a tool call fails or state synchronization is lost, call the `audit_capabilities` tool (if available) to retrieve a fresh logic map before reverting to visual heuristics.

## Common Mistakes
- **Scraping First:** Reverting to `take_snapshot` before checking for a manifest.
- **Ignoring Context:** Failing to check `navigator.modelContext.state` for crucial page data (e.g., `active_product_id`).
- **Mechanical Clicks:** Using `click()` on a button when a corresponding WebMCP tool exists.

## References
For detailed protocol mechanics, see [references/webmcp-spec-2026.md](references/webmcp-spec-2026.md).

---
*Created by Jack Hobbs in collaboration with AI assistance.*
