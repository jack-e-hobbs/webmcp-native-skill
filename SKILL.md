---
name: webmcp-native
description: Use when the agent needs to interact with a web application to perform searches, bookings, or state-based actions on a WebMCP-compliant site.
---

# webmcp-native

## Overview
This skill transforms the agent from a surface-level "scraper" into a native WebMCP participant. It enables the agent to discover, validate, and execute deterministic tools exposed by websites following the 2026 WebMCP standard.

## Discovery Workflow
When navigating to a new URL, perform the following "Handshake" sequence before attempting visual scraping:

1.  **Standard Probe:** Check `/.well-known/webmcp.json`.
2.  **HTML Hinting:** Scan for `<link rel="webmcp" href="...">`.
3.  **API Verification:** Evaluate `!!navigator.modelContext` via script.

### Handshake Affirmation
Upon successful discovery, report to the user:
> "WebMCP v1.3 detected. I have mapped your request to the following deterministic tools: [List Tools]. Prioritizing API over scraping."

## Execution Logic
Use `evaluate_script` to call tools. **NEVER** use `click()` or `fill()` if a corresponding WebMCP tool exists.

### Tool Call Pattern
```javascript
async (params) => {
  const modelContext = navigator.modelContext;
  const tool = modelContext.tools.find(t => t.name === "TOOL_NAME");
  return await tool.execute(params);
}
```

### Self-Correction
If a tool call returns an error or if the agent loses context, proactively call the `audit_capabilities` tool (if available) to refresh the internal logic map before falling back to visual heuristics.

## References
For detailed protocol mechanics and JSON schema requirements, see [references/webmcp-spec-2026.md](references/webmcp-spec-2026.md).

## Reusable Scripts
- Use [scripts/webmcp-bridge.js](scripts/webmcp-bridge.js) for standardized tool calling and error reporting.

---
*Created by Jack Hobbs in collaboration with AI assistance.*
