import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import router from "./router";

const app = new Hono();

app.use(logger());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.route("/v1", router);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error." }, 500);
});

console.log("Server started.");

export default app;
