import { Hono } from "hono";
import { authenticate } from "../middlewares";
import prisma from "../config/prisma";
import { res } from "../utils";

const accounts = new Hono()
  .use(authenticate)
  .get("/me", async (c) => {
    const account = await prisma.account.findUnique({
      where: { id: c.get("user").id },
      select: {
        id: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        profiles: true,
      }
    });

    if (!account) {
      return c.json({ message: "Account not found." }, 404);
    }

    return c.json(res("Account found.", account));
  });

export default accounts;
