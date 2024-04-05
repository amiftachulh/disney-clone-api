import { Hono } from "hono";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { validate } from "../middlewares";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import prisma from "../config/prisma";
import { res } from "../utils";

const auth = new Hono()
  .post("/register", validate("json", registerSchema), async (c) => {
    const { phone, password } = c.req.valid("json");

    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt",
    });

    await prisma.account.create({
      data: {
        phone,
        password: hashedPassword,
      },
    });

    return c.json(res("Account created."));
  })
  .post("/login", validate("json", loginSchema), async (c) => {
    const { phone, password } = c.req.valid("json");

    const account = await prisma.account.findUnique({
      where: { phone },
      include: { profiles: true },
    });

    if (!account) {
      return c.json(res("Account not found."), 401);
    }

    const isMatch = await Bun.password.verify(password, account.password);
    if (!isMatch) {
      return c.json(res("Invalid password."), 401);
    }

    const { id, password: _, ...data } = account;
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
    const token = await sign(
      { id, exp },
      process.env.JWT_SECRET
    );

    setCookie(c, "session", token, {
      path: "/",
      secure: true,
      httpOnly: true,
      expires: new Date(exp * 1000),
      sameSite: "None",
    });

    return c.json(res("Login successful.", data));
  });

export default auth;
