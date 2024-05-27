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

  server.listen(8000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
