const assert = require("node:assert");
const { parse, parseLine } = require("./parser");

// Helper function to strip ANSI color codes for testing
function stripColors(str) {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: needed for ANSI color stripping in tests
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

describe("parse()", () => {
  it("should format a single JSON object into one line", () => {
    const input =
      '{"type":"system","subtype":"init","session_id":"123-456","tools":["Task","Bash"]}';
    const expected = ["[SYSTEM] Session 123-456 started with 2 tools"];
    assert.deepStrictEqual(parse(input).map(stripColors), expected);
  });

  it("should format multiple JSON objects into one-line entries", () => {
    const input =
      '{"type":"system","subtype":"init","session_id":"abc","tools":[]}\n{"type":"result","is_error":false,"cost_usd":0.05,"duration_ms":1000}';
    const expected = [
      "[SYSTEM] Session abc started with 0 tools",
      "[RESULT] SUCCESS - Cost: $0.0500, Duration: 1000ms",
    ];
    assert.deepStrictEqual(parse(input).map(stripColors), expected);
  });

  it("should skip blank lines and format entries", () => {
    const input =
      '\n  {"type":"system","subtype":"other"}  \n\n{"type":"result","is_error":true}\n';
    const expected = [
      "[SYSTEM] other",
      "[RESULT] ERROR - Cost: unknown, Duration: unknown",
    ];
    assert.deepStrictEqual(parse(input).map(stripColors), expected);
  });

  it("should stringify JSON arrays", () => {
    const input = "[1, 2, 3]";
    const expected = ["[1,2,3]"];
    assert.deepStrictEqual(parse(input).map(stripColors), expected);
  });
});

describe("parseLine()", () => {
  it("should format a single JSON object line", () => {
    const line =
      '{"type":"system","subtype":"init","session_id":"test","tools":["Tool1"]}';
    const expected = "[SYSTEM] Session test started with 1 tools";
    assert.strictEqual(stripColors(parseLine(line)), expected);
  });

  it("should return null for empty lines", () => {
    assert.strictEqual(parseLine(""), null);
    assert.strictEqual(parseLine("   "), null);
  });

  it("should return null for invalid JSON", () => {
    assert.strictEqual(parseLine("{invalid json}"), null);
  });

  it("should stringify arrays", () => {
    const line = "[1, 2, 3]";
    const expected = "[1,2,3]";
    assert.strictEqual(stripColors(parseLine(line)), expected);
  });

  it("should format assistant messages properly", () => {
    const line =
      '{"type":"assistant","message":{"content":[{"type":"text","text":"Hello world"}]}}';
    const expected = "[ASSISTANT] Hello world";
    assert.strictEqual(stripColors(parseLine(line)), expected);
  });

  it("should format user messages with tool results", () => {
    const line =
      '{"type":"user","message":{"content":[{"type":"tool_result","content":"Success","is_error":false}]}}';
    const expected = "[USER] [Tool result: Success]";
    assert.strictEqual(stripColors(parseLine(line)), expected);
  });
});
