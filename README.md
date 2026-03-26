# WebMCP Native Skill 🚧
NOTE 2025-03-06: this is currently in TESTING and is not ready for wider adoption 

This repository provides a standardized procedural bridge for AI agents to discover, validate, and execute **WebMCP (Web Model Context Protocol)** tools on any compliant website.

## Why Use This Skill?
Traditional AI agents rely on visual "scraping"—guessing button functions based on pixels. This skill teaches the agent to use the **Deterministic Logic Contract** provided by WebMCP-enabled websites, resulting in:
- **Reduced Latency:** Eliminates redundant snapshots and visual parsing loops.
- **Improved Reliability:** Tools remain functional even if CSS classes or layouts change.
- **Zero-Shot Accuracy:** Direct mapping of user intent to business logic via formal JSON Schema.

## Installation

### For Gemini CLI
Install this skill directly from the GitHub repository:

```bash
gemini skills install https://github.com/jack-e-hobbs/webmcp-native-skill.git --scope user
```

Once installed, reload your session to activate the skill:
```text
/skills reload
```

## What's Inside

This package contains a suite of procedural capabilities that turn a general-purpose agent into a WebMCP-native participant:

### Passive Discovery
The agent is instructed to proactively look for application capabilities before falling back to scraping. It automatically checks for:
- Standardized manifests at `/.well-known/webmcp.json`.
- Link-based hints like `<link rel="webmcp" href="...">`.
- Protocol handshake signals in the browser console.

### Intent-to-Contract Mapping
The agent intelligently maps natural language requests to the site's formal logic.
- **Example:** You say "Find a picnic in Sydney."
- **Agent Logic:** Identifies the `search_experiences` tool in the manifest and executes it with `{ "location": "Sydney" }`.

### Deterministic Execution
Standardizes the workflow for calling JavaScript functions directly through the `navigator.modelContext` API.
- **Example:** The agent can call `initiate_booking` on the [AmazingExperiences Demo](https://jack-e-hobbs.github.io/webmcp-experiences-platform/) to open the checkout page instantly, bypassing the need to find a "Book Now" button.

### Self-Correction
If a tool call fails or state synchronization is lost, the agent invokes `audit_capabilities` to retrieve a fresh logic map from the application.

## Verify Installation

To confirm the skill is active and correctly configured:

1. **List Skills:** Run `/skills list`. You should see `webmcp-native` in the list.
2. **Test Handshake:** Open a WebMCP-compliant site like [AmazingExperiences](https://jack-e-hobbs.github.io/webmcp-experiences-platform/).
3. **Check Discovery:** Prompt the agent: "Detect WebMCP capabilities on this page."
4. **Observe Output:** The agent should report the tools from the manifest rather than describing the visual elements of the page.

## Collaboration
This skill was developed by **Jack Hobbs** in collaboration with **AI assistance** as a reference implementation for the 2026 WebMCP standard.

## License
MIT
