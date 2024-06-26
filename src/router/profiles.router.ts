import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { authenticate, validate, validateProfile } from "../middlewares";
import prisma from "../config/prisma";
import { res } from "../utils";
import { profileSchema } from "../schemas/profiles.schema";
import { getProfileById } from "../services/profiles.service";

const profiles = new Hono()
  .use(authenticate)
  .post("/", validate("json", profileSchema), async (c) => {
    const profiles = await prisma.profile.count({
      where: { accountId: c.get("user").id },
    });

    if (profiles >= 4) {
      return c.json(res("You can only have 4 profiles."), 400);
    }

    const { name } = c.req.valid("json");
    await prisma.profile.create({
      data: {
        name,
        accountId: c.get("user").id,
      }
    });

    return c.json(res("Success."), 201);
  })
  .get("/me", validateProfile, async (c) => {
    return c.json(res("Success.", c.get("profile")));
  })
  .get("/:id", async (c) => {
    const user = c.get("user");
    const profile = await getProfileById(c.req.param("id"), user.id);
    if (!profile) {
      return c.json(res("Profile not found."), 404);
    }

    setCookie(c, "profile", profile.id, {
      path: "/",
      httpOnly: true,
      secure: true,
      expires: new Date(user.exp * 1000),
      sameSite: "None",
    });

    return c.json(res("Success.", profile));
  })
  .put("/:id", validate("json", profileSchema), async (c) => {
    const profile = await getProfileById(c.req.param("id"), c.get("user").id);
    if (!profile) {
      return c.json(res("Profile not found."), 404);
    }

    const { name } = c.req.valid("json");
    await prisma.profile.update({
      where: { id: profile.id },
      data: { name },
    });

    return c.json(res("Success."));
  })
  .delete("/:id", async (c) => {
    const profile = await getProfileById(c.req.param("id"), c.get("user").id);
    if (!profile) {
      return c.json(res("Profile not found."), 404);
    }

    await prisma.profile.delete({
      where: { id: profile.id },
    });

    return c.json(res("Success."));
  });

export default profiles;
