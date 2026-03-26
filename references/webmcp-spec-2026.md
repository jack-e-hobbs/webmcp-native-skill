# Web Model Context Protocol (WebMCP) Specification - 2026 Summary

## Protocol Entry Point
The primary interface is `navigator.modelContext` (standardized) or `navigator.webmcp` (branded).

## Core API Methods

### `registerTool(definition)`
Registers a JavaScript function as an agent-callable tool.
- `definition.name`: Unique identifier.
- `definition.description`: Natural language purpose.
- `definition.inputSchema`: JSON Schema for parameters.
- `definition.execute`: The async function logic.

### `provideContext(manifest)`
Synchronizes application state and capabilities with the agent.
- `manifest.state`: High-fidelity JSON representation of the current view (e.g., `active_product_id`).
- `manifest.tools`: Array of all registered tool definitions.

## Security & Constraints
- **Secure Context Only:** Requires HTTPS or localhost.
- **Same-Origin Policy:** Agents can only call tools registered by the current domain.
- **Human-in-the-Loop:** High-impact tools (e.g., payments) trigger a browser-native confirmation dialog via `client.requestUserInteraction`.

## Discoverability standards
1.  **Well-Known:** `/.well-known/webmcp.json` (JSON manifest).
2.  **HTML Link:** `<link rel="webmcp" href="/path/to/manifest.json">`.
3.  **Console Handshake:** Standard string `[WebMCP] Discovery: navigator.modelContext is ready.`

## Interaction Flow
1.  **Probe:** Agent detects protocol.
2.  **Affirm:** Agent declares intent to use API.
3.  **Execute:** Agent calls tools via `evaluate_script`.
4.  **Sync:** Page updates context; agent adjusts reasoning.
