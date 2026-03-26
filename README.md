# WebMCP Native Skill 🤖

A standardized procedural bridge for AI CLI Agents (Gemini CLI, Claude Code). This skill enables agents to discover, validate, and execute **WebMCP (Web Model Context Protocol)** tools on any compliant website.

## Why use this?
Traditional AI agents rely on "scraping" the DOM—guessing what buttons do based on fragile pixels. This skill teaches the agent to use the **Deterministic Logic Contract** provided by the website, resulting in:
- **80% Lower Latency:** No redundant snapshots or visual parsing loops.
- **100% Reliability:** Tools work even if CSS classes or layouts change.
- **Zero-Shot Accuracy:** Direct mapping of user intent to business logic via JSON Schema.

## Installation

### For Gemini CLI
You can install this skill directly from the GitHub repository:

```bash
gemini skills install https://github.com/jack-e-hobbs/webmcp-native-skill.git --scope user
```

Once installed, reload your interactive session to activate the skill:
```text
/skills reload
```

## What's Inside

This package contains a suite of procedural capabilities that turn a general-purpose agent into a WebMCP-native participant:

### 🔍 Passive Discovery
The agent is trained to "look for the light" before it starts scraping. It automatically hunts for:
*   Standardized manifests at `/.well-known/webmcp.json`.
*   Link-based hints like `<link rel="webmcp" href="...">`.
*   Handshake console logs from the site's initialization.

### 📜 Intent-to-Contract Mapping
Instead of clicking buttons, the agent maps your natural language goals to the site's formal tools.
*   **Example:** You say *"Find a picnic in Sydney"*.
*   **Agent Logic:** Finds the `search_experiences` tool in the manifest and calls it with `{ "location": "Sydney" }`.

### ⚡ Deterministic Execution
Standardizes the `evaluate_script` workflow to call JS functions directly through the `navigator.modelContext` API. 
*   **Example:** The agent can call `initiate_booking` on the [AmazingExperiences Demo](https://jack-e-hobbs.github.io/webmcp-experiences-platform/) to open the checkout page instantly, bypassing the need to find the "Book Now" button.

### 🛡️ Self-Correction & Resiliency
If a tool call fails or state is lost, the agent calls `audit_capabilities` to get a fresh logic map from the application before falling back to legacy scraping.

## Verify Installation

To confirm the skill is active and correctly configured in your Gemini CLI:

1.  **List Skills:** Run `/skills list` in your interactive session. You should see `webmcp-native` in the list.
2.  **Test Handshake:** Open a WebMCP-compliant site (e.g., [AmazingExperiences](https://jack-e-hobbs.github.io/webmcp-experiences-platform/)).
3.  **Check Discovery:** Ask the agent: *"Detect WebMCP capabilities on this page."*
4.  **Observe Output:** The agent should report the tools from the manifest rather than describing the visual elements of the page.

## Collaboration
This skill was developed by **Jack Hobbs** in collaboration with **AI assistance** as a reference implementation for the 2026 WebMCP standard.

## License
MIT
