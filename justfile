#!/usr/bin/env just

# Install dependencies and link the CLI globally
install:
    npm install && npm link

# Run tests
test:
    npm test

# Lint code with biome
lint:
    npm run lint

# Format code with biome
format:
    npm run format

# Check formatting without writing
format-check:
    npm run format:check

# Run biome check (lint + format check)
check:
    npm run check

# Demo piping claude output into claudepretty
try:
    claude -p "Run ls on this directory" --verbose --output-format stream-json | node bin/claudepretty.js
