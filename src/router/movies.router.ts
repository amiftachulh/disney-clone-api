import { Hono } from "hono";
import { authenticate } from "../middlewares";
import moviesFetcher, { DEFAULT_API_PARAMS } from "../utils/movies-fetcher";
import { res } from "../utils";
import { AxiosError } from "axios";

const movies = new Hono()
  .use(authenticate)
  .get("/now-playing", async (c) => {
    const page = c.req.query("page");
    const movies = await moviesFetcher("/movie/now_playing", {
      params: {
        ...DEFAULT_API_PARAMS,
        page: Number(page) || 1,
      }
    });

    return c.json(res("Success.", movies.data));
  })
  .get("/top-rated", async (c) => {
    const page = c.req.query("page");
    const movies = await moviesFetcher("/movie/top_rated", {
      params: {
        ...DEFAULT_API_PARAMS,
        page: Number(page) || 1,
      }
    });

    return c.json(res("Success.", movies.data));
  })
  .get("/search", async (c) => {
    const { query, page } = c.req.query();
    const movies = await moviesFetcher("/search/movie", {
      params: {
        ...DEFAULT_API_PARAMS,
        query: query || "",
        page: Number(page) || 1,
        include_adult: false,
      }
    });

    return c.json(res("Success.", movies.data));
  })
  .get("/:id", async (c) => {
    try {
      const movie = await moviesFetcher(`/movie/${c.req.param("id")}`, {
        params: {
          ...DEFAULT_API_PARAMS,
        }
      });

      return c.json(res("Success.", movie.data));
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return c.json(res("Movie not found."), 404);
        }

        return c.json(res("Internal server error."), 500);
      }
    }

  });

export default movies;
