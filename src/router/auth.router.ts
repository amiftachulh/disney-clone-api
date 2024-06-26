import { Hono } from "hono";
import { sign } from "hono/jwt";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import prisma from "../config/prisma";
import { res } from "../utils";

const auth = new Hono()
  .post("/", async (c) => {
    const body = await c.req.json();

    const valid = loginSchema.safeParse(body);
    if (!valid.success) {
      return c.json(res(valid.error.message), 400);
    }

    const { phone, password } = valid.data;

    let account = await prisma.account.findUnique({
      where: { phone },
      include: { profiles: true },
    });

    if (account) {
      const isMatch = await Bun.password.verify(password, account.password);
      if (!isMatch) {
        return c.json(res("Incorrect password."), 401);
      }
    } else {
      const validRegister = registerSchema.safeParse({ phone, password });
      if (!validRegister.success) {
        return c.json(res(validRegister.error.message), 400);
      }

      const hashedPassword = await Bun.password.hash(password, {
        algorithm: "bcrypt",
      });

      account = await prisma.account.create({
        data: {
          phone,
          password: hashedPassword,
        },
        include: { profiles: true },
      });
    }

    const { id, password: _, ...data } = account;
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
    const token = await sign({ id, exp }, process.env.JWT_SECRET);

    await prisma.session.create({
      data: {
        accountId: id,
        token,
      }
    });

    setCookie(c, "session", token, {
      path: "/",
      secure: true,
      httpOnly: true,
      expires: new Date(exp * 1000),
      sameSite: "None",
    });

    return c.json(res("Login successful.", { id, ...data }));
  })
  .post("/logout", async (c) => {
    const session = getCookie(c, "session");
    if (!session) {
      return c.json(res("Logout success."));
    }

    await prisma.session.delete({
      where: { token: session },
    });

    deleteCookie(c, "session", {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "None",
    });

    deleteCookie(c, "profile", {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "None",
    });

    return c.json(res("Logout success."));
  });

export default auth;
