/**
 * Parse streamed JSON input (possibly multiple JSON objects separated by newlines)
 * @param {string} input Raw input string
 * @returns {Array<any>} Array of parsed JSON objects
 */
function parse(input) {
  return input
    .split(/\r?\n/)           // split lines
    .map(line => line.trim())   // trim whitespace
    .filter(line => line)       // remove empty lines
    .map(JSON.parse);           // parse each line as JSON
}

module.exports = { parse };
