#!/usr/bin/env node

// Use the parser module to format streamed JSON input from stdin
const readline = require("readline");
const { parseLine } = require("../parser");

const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

rl.on("line", (line) => {
  const result = parseLine(line);
  if (result !== null) {
    process.stdout.write(result + "\n");
  }
});

rl.on("close", () => {
  // Nothing needed here for streaming
});
