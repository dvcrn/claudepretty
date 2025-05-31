# claudepretty

A CLI tool for pretty-printing streamed JSON output from Claude's `--output-format stream-json --verbose` non-interactive mode.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

Generates this:

![screenshots](./screenshots/after.png)

From this:

![screenshots](./screenshots/before.png)

## Installation

```bash
npm install -g claudepretty
```

## Usage

Use with Claude's streaming JSON output:

```bash
claude -p "create a simple todo app" --verbose --output-format stream-json | claudepretty
```

## Requirements

- Node.js 18.0.0+
- Used exclusively with piped input

## License

MIT © [David Mohl](https://github.com/dvcrn)
