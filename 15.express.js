import express from "express";
import { rateLimiter } from "./rateLimiter.js";

const app = express();

app.use(rateLimiter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(5000, () => console.log("Server running"));
