import { Hono } from "hono";
import auth from "./auth.router";

const router = new Hono();

router.route("/auth", auth);

export default router;
