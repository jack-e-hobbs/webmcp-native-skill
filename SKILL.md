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

### 2. Handshake Discovery
Upon landing on a URL, perform this discovery sequence to retrieve tools:
1.  **Standard Probe:** Retrieve `/.well-known/webmcp.json`.
2.  **HTML Hinting:** Scan for `<link rel="webmcp" href="...">`.
3.  **Signal Watch:** Listen for the console handshake: `[WebMCP] Discovery: navigator.modelContext is ready.`

### 3. State Synchronization
Instead of scraping pixels, the agent must check the "Injected Context":
- **Query State:** Evaluate `navigator.modelContext.state` to resolve relative terms (e.g., "this product", "my last booking").
- **Dynamic Awareness:** Re-evaluate the state whenever the URL path changes to stay synchronized with the user's view.

### 4. Deterministic Execution
Tools must be called via the native API using structured JSON.
- **Pattern:** `navigator.modelContext.tools.find(t => t.name === "TOOL_NAME").execute(params)`.
- **Self-Correction:** If a call fails, invoke `audit_capabilities` (if available) to get a fresh logic map.

## Handshake Affirmaton
Once WebMCP is detected and tools are retrieved, report to the user:
> "WebMCP v1.3 detected. I am using the deterministic logic contract for this site. Available tools: [List Tool Names]."

## Common Mistakes
- **Scraping First:** Reverting to snapshots before checking for a manifest.
- **Ignoring Versioning:** Calling tools without verifying the `protocolVersion` in the manifest.
- **Mechanical Clicks:** Using `click()` on a button when a high-fidelity tool exists.

## References
For detailed mechanics, see [references/webmcp-spec-2026.md](references/webmcp-spec-2026.md).

---
*Created by Jack Hobbs in collaboration with AI assistance.*
