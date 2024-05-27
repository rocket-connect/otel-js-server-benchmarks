# otel-js-server-benchmarks

This repo contains benchmarks for node.js webservers with and without OpenTelemetry instrumentation.

The initial benchmarks are ported from [graphql-crystal/benchmarks](https://github.com/graphql-crystal/benchmarks) and use a combination of nix and bombardier to run the benchmarks.

Each benchmark contains a single GET `/hello` endpoint that returns a JSON response with a single key-value pair. Half of the benchmarks are instrumented with OpenTelemetry and the other half are not.

The benchmarks are outputted on each commit to the repo and can be viewed in the [`benchmarks.md`](./benchmarks.md) file.
