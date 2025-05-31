const assert = require("assert");
const { parse, parseLine } = require("./parser");

describe("parse()", function () {
  it("should format a single JSON object into one line", function () {
    const input = '{"type":"system","value":1}';
    const expected = ["type: system, value: 1"];
    assert.deepStrictEqual(parse(input), expected);
  });

  it("should format multiple JSON objects into one-line entries", function () {
    const input = '{"a":1}\n{"b":2}';
    const expected = ["a: 1", "b: 2"];
    assert.deepStrictEqual(parse(input), expected);
  });

  it("should skip blank lines and format entries", function () {
    const input = '\n  {"x": "y"}  \n\n{"z":3}\n';
    const expected = ["x: y", "z: 3"];
    assert.deepStrictEqual(parse(input), expected);
  });

  it("should stringify JSON arrays", function () {
    const input = "[1, 2, 3]";
    const expected = ["[1,2,3]"];
    assert.deepStrictEqual(parse(input), expected);
  });
});

describe("parseLine()", function () {
  it("should format a single JSON object line", function () {
    const line = '{"type":"system","value":1}';
    const expected = "type: system, value: 1";
    assert.strictEqual(parseLine(line), expected);
  });

  it("should return null for empty lines", function () {
    assert.strictEqual(parseLine(""), null);
    assert.strictEqual(parseLine("   "), null);
  });

  it("should return null for invalid JSON", function () {
    assert.strictEqual(parseLine("{invalid json}"), null);
  });

  it("should stringify arrays", function () {
    const line = "[1, 2, 3]";
    const expected = "[1,2,3]";
    assert.strictEqual(parseLine(line), expected);
  });
});
