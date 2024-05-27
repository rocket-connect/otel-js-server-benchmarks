import cluster from "cluster";
import { cpus } from "os";
import express from "express";

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
  var app = express();

  app.use("/hello", async (req, res) => {
    const tracer = opentelemetry.trace.getTracer("hello-tracer");
    const span = tracer.startSpan("hello");
    span.setAttribute("value", "world");
    span.end();

    res.json({ message: "Hello World" }).end();
  });

  app.listen(8000);
}
