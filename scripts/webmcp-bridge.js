/**
 * WebMCP Bridge Helper (optional)
 *
 * Reference helpers for the current WebMCP API (document.modelContext, mid-2026).
 * The SKILL.md flow inlines these patterns directly into evaluate-script calls;
 * this file documents the canonical shapes. See references/webmcp-spec-2026.md.
 */

// Resolve the context object (navigator.* is deprecated; document.* is current).
const getModelContext = () => document.modelContext || navigator.modelContext || null;

// Discover available tools. Returns [] if WebMCP is absent.
async function discoverTools() {
  const mc = getModelContext();
  if (!mc) return [];
  if (typeof mc.getTools === 'function') return await mc.getTools();
  return Array.isArray(mc.tools) ? mc.tools : []; // legacy / polyfilled pages only
}

// Call a tool by name. Normalises both the current (plain value) and legacy
// ({content:[{text}]}) return shapes to a string.
async function callTool(name, input = {}) {
  const mc = getModelContext();
  if (!mc) throw new Error('WebMCP not available on this page.');

  let result;
  if (typeof mc.executeTool === 'function') {
    // Chrome 149+ wants the RegisteredTool object + a JSON-STRING input, not the
    // (name, inputObject) the draft spec text shows — verified on Canary, mid-2026.
    // Try the live shape first; fall back to the documented one if a build reverts.
    const tools = await discoverTools();
    const tool = tools.find(t => t.name === name);
    try {
      result = await mc.executeTool(tool ?? name, JSON.stringify(input));
    } catch {
      result = await mc.executeTool(name, input);
    }
  } else {
    const tools = await discoverTools();
    const tool = tools.find(t => t.name === name);
    if (!tool || typeof tool.execute !== 'function') {
      throw new Error(`Tool '${name}' not found or not executable.`);
    }
    result = await tool.execute(input);
  }

  const text = result && result.content && result.content[0] && result.content[0].text;
  return text !== undefined ? text : result;
}

window.__webmcp_bridge = { getModelContext, discoverTools, callTool };
