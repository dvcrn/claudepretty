#!/usr/bin/env node

// Stream JSON from stdin and pretty-print incrementally
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
let buffer = '';
let depth = 0;
let inString = false;
let escape = false;

function printIndent(level) {
  process.stdout.write('  '.repeat(level));
}

rl.on('line', (line) => {
  for (let char of line) {
    buffer += char;
    if (escape) {
      escape = false;
    } else if (char === '\\') {
      escape = true;
    } else if (char === '"') {
      inString = !inString;
    } else if (!inString) {
      if (char === '{' || char === '[') {
        process.stdout.write(char + '\n');
        depth++;
        printIndent(depth);
        buffer = '';
      } else if (char === '}' || char === ']') {
        process.stdout.write('\n');
        depth--;
        printIndent(depth);
        process.stdout.write(char);
        buffer = '';
      } else if (char === ',') {
        process.stdout.write(char + '\n');
        printIndent(depth);
        buffer = '';
      } else if (char === ':') {
        process.stdout.write(char + ' ');
        buffer = '';
      } else {
        process.stdout.write(char);
        buffer = '';
      }
    } else {
      process.stdout.write(char);
      buffer = '';
    }
  }
  // handle newline from line-based
  if (!inString && buffer.trim() === '') {
    process.stdout.write('\n');
    printIndent(depth);
    buffer = '';
  }
});

rl.on('close', () => {
  process.stdout.write('\n');
});
