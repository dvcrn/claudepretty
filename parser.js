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
    // Format object entries into 'key: value' pairs
    if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
      return Object.entries(obj)
        .map(([k, v]) => {
          if (typeof v === "object" && v !== null) {
            return `${k}: ${JSON.stringify(v)}`;
          }
          return `${k}: ${v}`;
        })
        .join(", ");
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
