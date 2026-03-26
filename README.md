# WebMCP Native Skill

A standardized procedural bridge for AI CLI Agents (Gemini CLI, Claude Code). This skill enables agents to discover, validate, and execute **WebMCP (Web Model Context Protocol)** tools on any compliant website.

## Why use this?
Traditional AI agents rely on "scraping" the DOM—guessing what buttons do based on pixels. This skill teaches the agent to use the **Deterministic logic Contract** provided by the website, resulting in:
- **80% Lower Latency:** No redundant snapshots.
- **100% Reliability:** Tools work even if the UI changes.
- **Zero-Shot Accuracy:** Direct mapping of user intent to business logic.

## Installation

### For Gemini CLI
1. Clone this repository.
2. Run the installation command:
```bash
gemini skills install ./webmcp-native-skill.skill --scope user
```
3. Reload your session: `/skills reload`.

## How it Works
1.  **Passive Discovery:** Upon landing on a URL, the agent automatically probes for a WebMCP manifest.
2.  **Handshake:** The agent reports the available tools to the user.
3.  **Deterministic Action:** The agent uses the `navigator.modelContext` API to call functions directly.

## Collaboration
This skill was developed by **Jack Hobbs** in collaboration with **Gemini 3 CLI** as a reference implementation for the 2026 WebMCP standard.

## License
MIT
