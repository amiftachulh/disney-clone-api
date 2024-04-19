import { Hono } from "hono";
import { authenticate, validateProfile } from "../middlewares";
import prisma from "../config/prisma";
import { res } from "../utils";
import { getMovieById } from "../services/movies.service";

const recommends = new Hono()
  .use(authenticate)
  .use(validateProfile)
  .post("/:movieId", async (c) => {
    const movieId = c.req.param("movieId");
    const movie = await getMovieById(movieId);
    if (!movie) {
      return c.json(res("Movie not found."), 404);
    }

    const profileId = c.get("profile").id;
    const recommend = await prisma.recommend.findFirst({
      where: {
        movieId,
        profileId,
      }
    });

    if (recommend) {
      return c.json(res("Already recommended."), 409);
    }

    await prisma.recommend.create({
      data: {
        movieId,
        profileId,
      }
    });

    return c.json(res("Success."));
  })
  .delete("/:id", async (c) => {
    const recommend = await prisma.recommend.findFirst({
      where: {
        movieId: c.req.param("id"),
        profileId: c.get("profile").id,
      }
    });

    if (!recommend) {
      return c.json(res("Recommendation not found."), 404);
    }

    await prisma.recommend.delete({
      where: {
        id: recommend.id,
      }
    });

    return c.json(res("Success."));
  });

export default recommends;
