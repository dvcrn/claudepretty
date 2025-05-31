# claudepretty

Pretty-print streamed JSON from stdin in a human-friendly format.

## Installation

Use `just` to install dependencies and link the CLI globally:

    just install

Or install via npm:

    cd /Users/david/src/claudepretty && npm install -g .

## Usage

Pipe JSON output into the CLI for pretty-printing:

    echo '{"type":"system","subtype":"init","session_id":"..."}' | claudepretty

You can also stream multiple JSON objects, one per line:

    tail -f logfile.json | claudepretty

## Development

- `just install` to set up
- `just test` to run tests (if any)

## License

MIT
