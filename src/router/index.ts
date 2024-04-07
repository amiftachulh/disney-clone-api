import { Hono } from "hono";
import auth from "./auth.router";
import accounts from "./accounts.router";
import movies from "./movies.router";

const router = new Hono();

router
  .route("/auth", auth)
  .route("/accounts", accounts)
  .route("/movies", movies);

export default router;
