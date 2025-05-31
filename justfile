#!/usr/bin/env just

# Install dependencies and link the CLI globally
install:
	cd /Users/david/src/claudepretty && npm install && npm link

# Run tests (if any)
test:
	cd /Users/david/src/claudepretty && npm test

# Demo piping claude output into claudepretty
try:
	cd /Users/david/src/claudepretty && claude -p "Run ls on this directory" --verbose --output-format stream-json | node bin/claudepretty.js
