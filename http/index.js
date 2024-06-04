import cluster from "cluster";
import { cpus } from "os";
import http from "http";

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/hello") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Hello World" }));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });

  server.listen(8000);
}

const resolvers = {
  Query: {
    hello: (root, args, context, info) => {
      const tracer = opentelemetry.trace.getTracer("example-tracer");
      const span = tracer.startSpan("say-hello");
      span.setAttribute("hello-to", "world");
      span.setAttribute("query", JSON.stringify(info.operation));
      span.addEvent("invoking resolvers");
      span.end();
      return "world";
    },
  },
};

app.use("/hello", async (req, res) => {
  const tracer = opentelemetry.trace.getTracer("hello-tracer");
  const span = tracer.startSpan("hello");
  span.setAttribute("value", "world");
  span.end();

  res.json({ message: "Hello World" }).end();
});
