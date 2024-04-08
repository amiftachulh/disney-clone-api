import { Hono } from "hono";
import { authenticate } from "../middlewares";
import { res } from "../utils";
import {
  getMovieById,
  getNowPlayingMovies,
  getTopRatedMovies,
  searchMovies
} from "../services/movies.service";

const movies = new Hono()
  .use(authenticate)
  .get("/now-playing", async (c) => {
    const page = Number(c.req.query("page")) || 1;
    const data = await getNowPlayingMovies(page);
    return c.json(res("Success.", data));
  })
  .get("/top-rated", async (c) => {
    const page = Number(c.req.query("page")) || 1;
    const data = await getTopRatedMovies(page)
    return c.json(res("Success.", data));
  })
  .get("/search", async (c) => {
    const { query, page } = c.req.query();
    const data = await searchMovies(query, Number(page) || 1);
    return c.json(res("Success.", data));
  })
  .get("/:id", async (c) => {
    const data = await getMovieById(c.req.param("id"));
    if (!data) return c.json(res("Movie not found."), 404);
    return c.json(res("Success.", data));
  });

export default movies;
