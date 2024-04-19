import { ValidationTargets } from "hono";
import { validator } from "hono/validator";
import { createMiddleware } from "hono/factory"
import { z } from "zod";
import { res } from "../utils";
import { Auth } from "../types";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { jwtPayloadSchema } from "../schemas/auth.schema";
import prisma from "../config/prisma";
import { Profile } from "@prisma/client";

export function validate<
  Target extends keyof ValidationTargets,
  T extends z.ZodSchema
>(target: Target, schema: T) {
  return validator(target, (value, c) => {
    const result = schema.safeParse(value)
    if (!result.success) {
      let t: string;
      switch (target) {
        case "json":
          t = "request body.";
          break;
        case "query":
          t = "query string.";
          break;
        case "param":
          t = "URL parameters.";
          break;
        default:
          t = "input.";
      }
      return c.json(
        res(`Invalid ${t}`, undefined, result.error.flatten().fieldErrors),
        400
      );
    }
    return result.data as z.infer<T>;
  });
}

export const authenticate = createMiddleware<{ Variables: Auth }>(async (c, next) => {
  const session = getCookie(c, "session");
  if (!session) {
    return c.json(res("Unauthorized"), 401);
  }

  let decoded;
  try {
    decoded = await verify(session, process.env.JWT_SECRET)
  } catch (error) {
    return c.json(res("Unauthorized"), 401);
  }

  const verified = jwtPayloadSchema.safeParse(decoded);
  if (!verified.success) {
    return c.json(res("Unauthorized"), 401);
  }

  const token = await prisma.session.findUnique({
    where: { token: session }
  })

  if (!token) {
    return c.json(res("Unauthorized"), 401);
  }

  c.set("user", verified.data)

  await next();
});

export const validateProfile = createMiddleware<{ Variables: Auth & { profile: Profile } }>(async (c, next) => {
  const profileId = getCookie(c, "profile");
  if (!profileId) {
    return c.json(res("Profile not found."), 404);
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: profileId,
      accountId: c.get("user").id
    }
  });

  if (!profile) {
    return c.json(res("Profile not found."), 404);
  }

  c.set("profile", profile);

  await next();
})
