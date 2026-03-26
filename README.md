# WebMCP Native Skill 🚧
NOTE 2025-03-06: this is currently in TESTING and is not ready for wider adoption 

A standardized procedural bridge for AI CLI Agents. This skill enables agents to discover, validate, and execute **WebMCP (Web Model Context Protocol)** tools on any compliant website.

## Why Use This Skill?
Traditional AI agents often rely on "scraping" the Document Object Model (DOM)—essentially guessing a button's function based on visual cues. This skill shifts the agent's approach to leverage the **Deterministic Logic Contract** provided by WebMCP-enabled websites. This results in:
-   **Enhanced Efficiency:** Significantly reduced latency by eliminating redundant snapshots and visual parsing cycles.
-   **Increased Reliability:** Interactions remain consistent even if a website's user interface (CSS classes, layout) changes.
-   **Zero-Shot Accuracy:** Direct mapping of user intent to a website's underlying business logic via clear JSON Schemas.

## Installation

### For Gemini CLI
You can install this skill directly from its GitHub repository:

```bash
gemini skills install https://github.com/jack-e-hobbs/webmcp-native-skill.git --scope user
```

Once installed, activate the skill by reloading your interactive session:
```text
/skills reload
```

## What's Inside

This package equips a general-purpose agent with specialized capabilities for WebMCP interaction:

### Passive Discovery
The agent is trained to proactively seek out WebMCP capabilities rather than immediately resorting to visual analysis. It automatically identifies:
*   Standardized manifests found at `/.well-known/webmcp.json`.
*   Hints embedded in HTML, such as `<link rel="webmcp" href="...">` tags.
*   Console logs that signal a successful WebMCP handshake during a site's initialization.

### Intent-to-Contract Mapping
The agent intelligently translates natural language requests into calls to a website's formal WebMCP tools.
*   **Example:** If you instruct, *"Find a picnic in Sydney"*, the agent will identify the `search_experiences` tool within the site's manifest and execute it with `{ "location": "Sydney" }`.

### Deterministic Execution
This skill standardizes the process of executing JavaScript functions directly through the `navigator.modelContext` API via `evaluate_script`. This bypasses the need for the agent to manipulate the DOM.
*   **Example:** The agent can directly call `initiate_booking` on a site like the [AmazingExperiences Demo](https://jack-e-hobbs.github.io/webmcp-experiences-platform/). This opens the checkout page instantly, eliminating the need for the agent to visually locate and click a "Book Now" button.

### Self-Correction and Resiliency
Should a WebMCP tool call fail, or if the agent loses synchronization with the page's state, the skill instructs the agent to invoke the `audit_capabilities` tool (if available). This refreshes the agent's understanding of the application's logic map before it considers reverting to traditional scraping methods.

## Verify Installation

To confirm this skill is active and correctly configured within your Gemini CLI environment:

1.  **List Skills:** Run `/skills list` in your interactive session. You should see `webmcp-native` in the list.
2.  **Test Handshake:** Open a WebMCP-compliant website, such as the [AmazingExperiences Demo](https://jack-e-hobbs.github.io/webmcp-experiences-platform/).
3.  **Check Discovery:** Prompt your agent: *"Detect WebMCP capabilities on this page."*
4.  **Observe Output:** The agent should respond by reporting the tools identified from the site's manifest, rather than describing its visual elements of the page.

## License
MIT
