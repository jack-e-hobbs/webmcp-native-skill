---
name: webmcp-native
description: Use when the agent needs to interact with web applications, specifically to discover and call WebMCP tools, verify browser/site compatibility, and synchronize with application state.
---

# WebMCP Native

## Overview
This skill provides a standardized protocol for discovering and interacting with WebMCP (Web Model Context Protocol) capabilities. It enables the agent to act as a native participant in the application's logic rather than a surface-level scraper.

## Core Capabilities

### 1. Compatibility Verification
Before taking action, verify the technical environment:
- **Requirement:** Check for the presence of `navigator.modelContext` or `navigator.webmcp`.
- **Warning:** If missing, notify the user: *"WebMCP is not active in this browser session. Please ensure you are using a compliant browser (e.g., Chrome Canary with #web-mcp enabled)."*

### 2. Handshake Discovery & Telemetry
Follow this strict sequence to avoid race conditions and ensure discovery analytics:
1.  **Wait for Handshake:** If the page just loaded, wait for the console log: `[WebMCP] Discovery: navigator.modelContext is ready.`
2.  **API Verification Script:** Always use `mcp_chrome-devtools_evaluate_script` with this specific code to retrieve the manifest and state:
    ```javascript
    (() => {
      const ctx = navigator.modelContext || navigator.webmcp;
      if (!ctx) return { present: false };
      // Note: We use manifest tools list if direct enumeration fails
      return { 
        present: true, 
        tools: (ctx.tools || []).map(t => ({ name: t.name, description: t.description, schema: t.inputSchema })),
        state: ctx.state || {}
      };
    })()
    ```
3.  **Log Discovery (MANDATORY):** If the verification script returned a `track_discovery` tool, call it immediately via `evaluate_script` to log the agent's presence:
    ```javascript
    // Example wrapper
    async (params) => {
      const ctx = navigator.modelContext || navigator.webmcp;
      const tool = ctx.tools.find(t => t.name === "track_discovery");
      return await tool.execute({ agentName: "Agent CLI", capabilitiesCount: ctx.tools.length });
    }
    ```

### 3. Tool Execution (CRITICAL)
**WebMCP tools are NOT native agent tools.** All interactions MUST be wrapped in `mcp_chrome-devtools_evaluate_script`.

#### Standard Execution Template:
```javascript
async (params) => {
  const ctx = navigator.modelContext || navigator.webmcp;
  const tool = ctx.tools.find(t => t.name === "TOOL_NAME_HERE");
  if (!tool) throw new Error("Tool not found in context");
  return await tool.execute(params);
}
```

### 4. State Synchronization
- **Query State:** Evaluate `navigator.modelContext.state` to resolve relative terms (e.g., "this product").
- **Dynamic Awareness:** Re-evaluate the state whenever the URL path changes.

## Handshake Affirmation
Once WebMCP is detected and tools are retrieved, report to the user:
> "WebMCP detected. I have retrieved [X] tools from the logic contract. Discovery telemetry logged. Prioritizing API over scraping."

## References
For detailed protocol mechanics, see [references/webmcp-spec-2026.md](references/webmcp-spec-2026.md).

---
*Created by Jack Hobbs.*
