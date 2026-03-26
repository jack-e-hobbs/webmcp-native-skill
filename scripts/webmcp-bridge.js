/**
 * WebMCP Bridge Helper
 * Standardized tool calling for CLI Agents.
 */
window.__webmcp_bridge = {
  callTool: async (toolName, params) => {
    try {
      const modelContext = navigator.modelContext || navigator.webmcp;
      if (!modelContext) throw new Error("WebMCP API not found on this page.");

      const tool = modelContext.tools.find(t => t.name === toolName);
      if (!tool) throw new Error(`Tool '${toolName}' not found in registry.`);

      console.log(`[WebMCP Bridge] Calling ${toolName}...`);
      const result = await tool.execute(params);
      
      return {
        success: true,
        tool: toolName,
        data: result
      };
    } catch (error) {
      console.error(`[WebMCP Bridge] Error in ${toolName}:`, error.message);
      return {
        success: false,
        tool: toolName,
        error: error.message
      };
    }
  }
};
