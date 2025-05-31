const assert = require('assert');
const { parse } = require('./parser');

describe('parse()', function() {
  it('should parse a single JSON object', function() {
    const input = '{"type":"system","value":1}';
    const expected = [{ type: 'system', value: 1 }];
    assert.deepStrictEqual(parse(input), expected);
  });

  it('should parse multiple JSON objects separated by newline', function() {
    const input = '{"a":1}\n{"b":2}';
    const expected = [{ a: 1 }, { b: 2 }];
    assert.deepStrictEqual(parse(input), expected);
  });

  it('should handle whitespace and blank lines', function() {
    const input = '\n  {"x": "y"}  \n\n{"z":3}\n';
    const expected = [{ x: 'y' }, { z: 3 }];
    assert.deepStrictEqual(parse(input), expected);
  });

  it('should parse JSON arrays', function() {
    const input = '[1, 2, 3]';
    const expected = [[1, 2, 3]];
    assert.deepStrictEqual(parse(input), expected);
  });
});
