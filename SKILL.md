---
name: webmcp-native
description: Use when navigating to websites to discover and call WebMCP tools, verify browser compatibility, and synchronize with application state via the navigator.modelContext API.
---

# WebMCP Native

## Overview
This skill provides a standardized protocol for discovering and interacting with WebMCP capabilities. It enables the agent to prioritize deterministic API calls over visual scraping.

## Core Capabilities

### 1. Handshake Discovery (High-Resiliency)
Follow this sequence to retrieve tools, even if the native manifest fails:
1.  **Wait for Handshake:** Wait for the console log: `[WebMCP] Discovery: navigator.modelContext is ready.`
2.  **API Discovery Script:** Use `mcp_chrome-devtools_evaluate_script` with this code:
    ```javascript
    (() => {
      const ctx = navigator.modelContext || navigator.webmcp;
      const tools = ctx && ctx.tools ? ctx.tools : [];
      
      return { 
        present: !!ctx, 
        tools: tools.map(t => ({ name: t.name, description: t.description, schema: t.inputSchema })),
        state: (ctx && ctx.state) ? ctx.state : {}
      };
    })()
    ```

### 2. Tool Execution (CRITICAL)
**WebMCP tools are NOT native agent tools.** You must never try to call them directly (e.g., do NOT call `mcp_chrome_devtools_search_experiences`). 

**MANDATORY PATTERN:** All WebMCP interactions MUST be executed via `mcp_chrome-devtools_evaluate_script`.

#### Execution Template:
```javascript
async (params) => {
  const ctx = navigator.modelContext || navigator.webmcp;
  const tool = ctx.tools.find(t => t.name === "TOOL_NAME_HERE");
  if (!tool) throw new Error("Tool not found in context");
  return await tool.execute(params);
}
```

### 3. Telemetry Handshake
If `track_discovery` is found in the tools list, you **MUST** call it immediately to log your presence:
```javascript
// Telemetry Script
async () => {
  const ctx = navigator.modelContext;
  const telTool = ctx.tools.find(t => t.name === "track_discovery");
  return await telTool.execute({ agentName: "Agent CLI", capabilitiesCount: ctx.tools.length });
}
```

## Handshake Affirmation
Once tools are retrieved, report:
> "WebMCP detected. Discovery telemetry logged. Prioritizing deterministic tools for [intent]. Available tools: [List names]."

## Troubleshooting
- **"fn is not a function":** This usually means the browser's `provideContext` failed due to a schema mismatch. Check the console for `TypeError`.
- **Empty Tools:** If `tools` is `[]`, the site may have registered tools via `registerTool` but failed to provide them in `provideContext`.

## References
For protocol mechanics, see [references/webmcp-spec-2026.md](references/webmcp-spec-2026.md).

---
*Created by Jack Hobbs.*
