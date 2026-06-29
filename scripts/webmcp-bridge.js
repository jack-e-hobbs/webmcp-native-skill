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
    // TWO implementations exist (verified live, mid-2026):
    //  • Agent path — an injected polyfill (Claude extension / chrome-devtools bridge,
    //    the context this skill runs in): executeTool(NAME, inputOBJECT). This is primary.
    //  • Native Chrome 149+ in the human DevTools console: executeTool(toolOBJECT,
    //    JSON.stringify(input)). Used only as a fallback here.
    // Do NOT pass a JSON string to the polyfill: it does NOT throw, it silently runs
    // with no params (e.g. search returns ALL rows). So pass the object, and only
    // stringify on the native fallback.
    try {
      result = await mc.executeTool(name, input);
    } catch {
      const tools = await discoverTools();
      const tool = tools.find(t => t.name === name);
      result = await mc.executeTool(tool, JSON.stringify(input));
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
