import cluster from "cluster";
import { cpus } from "os";
import express from "express";

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  var app = express();
  app.use(express.json());

  app.use("/hello", async (req, res) => {
    sendResult(result, {
      hello: "world",
    });
  });

  app.listen(8000);
}