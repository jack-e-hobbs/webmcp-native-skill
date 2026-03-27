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

### 2. Handshake Discovery (Resilient Workflow)
Follow this strict sequence to avoid race conditions:
1.  **Wait for Handshake:** If the page just loaded, wait for the console log: `[WebMCP] Discovery: navigator.modelContext is ready.`
2.  **API Verification Script:** Use `mcp_chrome-devtools_evaluate_script` with this code to see the actual registered tools:
    ```javascript
    (() => {
      const ctx = navigator.modelContext || navigator.webmcp;
      if (!ctx) return { present: false };
      return { 
        present: true, 
        tools: (ctx.tools || []).map(t => ({ name: t.name, description: t.description, schema: t.inputSchema })),
        state: ctx.state || {}
      };
    })()
    ```

### 3. Tool Execution (CRITICAL)
**WebMCP tools are NOT native agent tools.** You will never see them in your tool list (e.g., `search_experiences` is NOT a tool you can call directly). 

**MANDATORY PATTERN:** All WebMCP interactions MUST be wrapped in `mcp_chrome-devtools_evaluate_script`.

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
- **Query State:** Evaluate `navigator.modelContext.state` to resolve relative terms (e.g., "this product", "my last booking").
- **Dynamic Awareness:** Re-evaluate the state whenever the URL path changes.

## Handshake Affirmation
Once WebMCP is detected, report to the user:
> "WebMCP detected. Prioritizing deterministic tools for [intent]. Available tools: [List Tool Names]."

## Common Mistakes
- ** hallunicating tools:** Trying to call `mcp_chrome_devtools_search_experiences`. You must use `evaluate_script` instead.
- **Race Conditions:** Probing before `ctx.tools` is populated. Always check if `ctx.tools` is defined in your script.
- **Ignoring Context:** Failing to check `navigator.modelContext.state` for current page data.

## References
For detailed protocol mechanics, see [references/webmcp-spec-2026.md](references/webmcp-spec-2026.md).

---
*Created by Jack Hobbs.*
