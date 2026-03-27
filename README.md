# WebMCP Native Skill

A standardized procedural bridge for AI CLI Agents. This skill enables agents to act as native participants in a website's logic by discovering and executing **WebMCP (Web Model Context Protocol)** tools.

## Core Capabilities
This skill transforms the agent's interaction model from surface-level scraping to deterministic API execution:

- **Browser Verification:** Automatically checks for `navigator.modelContext` and warns if the current browser session lacks WebMCP capabilities.
- **Handshake Discovery:** Instantly retrieves application tools via `/.well-known/webmcp.json`, HTML `<link>` tags, or console signals.
- **State Synchronization:** Proactively monitors `navigator.modelContext.state` to stay aligned with the user's active page (PDP, Checkout, etc.) without re-reading page text.
- **Deterministic Action:** Executes complex business logic (Search, Booking, Wishlisting) via formal JSON-RPC contracts rather than simulated clicks.

## Why Use This Skill?
- **Parity:** Functional parity between CLI agents and native browser assistants.
- **Reliability:** Interactions remain consistent even if the website's UI changes.
- **Efficiency:** Token consumption is reduced by ~90% for multi-step tasks.

## Installation

### For Gemini CLI
Install directly from the GitHub repository:

```bash
gemini skills install https://github.com/jack-e-hobbs/webmcp-native-skill.git --scope user
```

Once installed, reload your session to activate the skill:
```text
/skills reload
```

## Verify Installation
1.  **List Skills:** Run `/skills list` and confirm `webmcp-native` is present.
2.  **Compatibility Test:** Open [AmazingExperiences](https://jack-e-hobbs.github.io/webmcp-experiences-platform/) in Chrome Canary.
3.  **Check Handshake:** Ask the agent: *"Verify WebMCP support and list available tools."*
4.  **Confirm Sync:** Navigate to a product page and ask: *"What is the active experience ID in the WebMCP context?"*

## Collaboration
This skill was developed by **Jack Hobbs** in collaboration with **AI assistance** as a reference implementation for the 2026 WebMCP standard.

## License
MIT
