import cluster from "cluster";
import { cpus } from "os";
import http from "http";

import opentelemetry from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "basic-service",
  }),
});

const exporter = new OTLPTraceExporter({});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/hello") {
      const tracer = opentelemetry.trace.getTracer("hello-tracer");
      const span = tracer.startSpan("hello");
      span.setAttribute("value", "world");
      span.end();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Hello World" }));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });

  server.listen(8000);
}
