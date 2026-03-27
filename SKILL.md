---
name: webmcp-native
description: Use when the agent needs to interact with web applications, specifically to discover and call WebMCP tools, verify browser/site compatibility, and synchronize with application state.
---

# WebMCP Native

## Overview
This skill provides a standardized protocol for discovering and interacting with WebMCP (Web Model Context Protocol) capabilities. It enables the agent to act as a native participant in the application's logic rather than a surface-level scraper.

## Core Capabilities

### 1. Compatibility Verification
Before taking action, the agent must verify the technical environment:
- **Browser Support:** Check for the presence of `navigator.modelContext` or `navigator.webmcp`.
- **Warning:** If the native API is missing, notify the user: *"WebMCP is not active in this browser session. Please ensure you are using a compliant browser (e.g., Chrome Canary with #web-mcp enabled)."*

### 2. Handshake Discovery (Resilient Workflow)
Lite models must follow this strict sequence to avoid race conditions or protocol hallucinations:
1.  **Wait for Handshake:** If the page just loaded, wait up to 2 seconds for the console handshake: `[WebMCP] Discovery: navigator.modelContext is ready.`
2.  **Manifest Probe:** Retrieve `/.well-known/webmcp.json` or scan `<link rel="webmcp">`.
3.  **API Verification Script:** Always evaluate this specific script to see the *actual* registered tools:
    ```javascript
    (() => {
      const ctx = navigator.modelContext || navigator.webmcp;
      return ctx ? { present: true, tools: ctx.tools.map(t => t.name) } : { present: false };
    })()
    ```

### 3. Execution & State Synchronization
- **Strict Adherence:** ONLY use tools returned by the verification script. Do NOT assume standard MCP methods like `get_state` or `discover_tools` exist unless they are explicitly in the `tools` array.
- **Query State:** Evaluate `navigator.modelContext.state` to resolve relative terms (e.g., "this product").
- **Tool Call Pattern:**
    ```javascript
    async (params) => {
      const ctx = navigator.modelContext;
      const tool = ctx.tools.find(t => t.name === "TOOL_NAME");
      return await tool.execute(params);
    }
    ```

## Handshake Affirmation
Once WebMCP is detected and tools are retrieved, report to the user:
> "WebMCP v1.3 detected. I have verified 7 deterministic tools from the site's logic contract. Prioritizing API over scraping."

## Common Mistakes
- **Protocol Hallucination:** Assuming standard MCP boilerplate exists. Always check the `tools` array first.
- **Race Conditions:** Probing before React hooks have finished tool registration.
- **Scraping First:** Reverting to snapshots before the 2-second handshake window has closed.

## References
For detailed protocol mechanics, see [references/webmcp-spec-2026.md](references/webmcp-spec-2026.md).

---
*Created by Jack Hobbs.*
