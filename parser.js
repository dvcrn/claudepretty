/**
 * Format assistant message content
 * @param {Object} message Message object
 * @returns {string} Formatted content
 */
function formatAssistantMessage(message) {
  if (!message.content) return "";
  
  const parts = [];
  for (const content of message.content) {
    if (content.type === "text") {
      parts.push(content.text);
    } else if (content.type === "tool_use") {
      parts.push(`[${content.name}: ${JSON.stringify(content.input)}]`);
    }
  }
  return parts.join(" ");
}

/**
 * Format user message content
 * @param {Object} message Message object
 * @returns {string} Formatted content
 */
function formatUserMessage(message) {
  if (!message.content) return "";
  
  const parts = [];
  for (const content of message.content) {
    if (content.type === "tool_result") {
      if (content.is_error) {
        parts.push(`[ERROR: ${content.content}]`);
      } else {
        // Truncate long tool results
        const result = content.content.length > 100 
          ? content.content.substring(0, 100) + "..."
          : content.content;
        parts.push(`[Tool result: ${result}]`);
      }
    } else if (typeof content === "string") {
      parts.push(content);
    }
  }
  return parts.join(" ");
}

/**
 * Parse a single line of JSON input
 * @param {string} line Raw line string
 * @returns {string|null} Formatted one-line JSON string or null if line is empty/invalid
 */
function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  
  try {
    const obj = JSON.parse(trimmed);
    
    if (obj && typeof obj === "object" && obj.type) {
      switch (obj.type) {
        case "system":
          if (obj.subtype === "init") {
            const toolCount = Array.isArray(obj.tools) ? obj.tools.length : 0;
            return `[SYSTEM] Session ${obj.session_id?.substring(0, 8)} started with ${toolCount} tools`;
          }
          return `[SYSTEM] ${obj.subtype || "unknown"}`;
          
        case "assistant":
          const content = formatAssistantMessage(obj.message);
          return `[ASSISTANT] ${content}`;
          
        case "user":
          const userContent = formatUserMessage(obj.message);
          return `[USER] ${userContent}`;
          
        case "result":
          const cost = obj.cost_usd ? `$${obj.cost_usd.toFixed(4)}` : "unknown";
          const duration = obj.duration_ms ? `${obj.duration_ms}ms` : "unknown";
          const status = obj.is_error ? "ERROR" : "SUCCESS";
          return `[RESULT] ${status} - Cost: ${cost}, Duration: ${duration}`;
          
        default:
          // Fallback to generic formatting
          return Object.entries(obj)
            .map(([k, v]) => {
              if (typeof v === "object" && v !== null) {
                return `${k}: ${JSON.stringify(v)}`;
              }
              return `${k}: ${v}`;
            })
            .join(", ");
      }
    }
    
    // For arrays or other types, stringify
    return JSON.stringify(obj);
  } catch (e) {
    return null; // Skip invalid JSON
  }
}

/**
 * Parse streamed JSON input (possibly multiple JSON objects separated by newlines)
 * @param {string} input Raw input string
 * @returns {Array<string>} Array of formatted one-line JSON strings
 */
function parse(input) {
  return input
    .split(/\r?\n/) // split lines
    .map(parseLine) // parse each line
    .filter(line => line !== null); // remove null results
}

module.exports = { parse, parseLine };
