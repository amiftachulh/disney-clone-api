import { Hono } from "hono";
import auth from "./auth.router";
import accounts from "./accounts.router";

const router = new Hono();

router
  .route("/auth", auth)
  .route("/accounts", accounts);

export default router;
