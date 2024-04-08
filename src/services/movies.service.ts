import { AxiosError } from "axios";
import moviesFetcher, { DEFAULT_API_PARAMS } from "../utils/movies-fetcher";

export async function getNowPlayingMovies(page: number) {
  const { data } = await moviesFetcher("/movie/now_playing", {
    params: {
      ...DEFAULT_API_PARAMS,
      page,
    }
  });

  return data;
}

export async function getTopRatedMovies(page: number) {
  const { data } = await moviesFetcher("/movie/top_rated", {
    params: {
      ...DEFAULT_API_PARAMS,
      page,
    }
  });

  return data;
}

export async function searchMovies(query: string, page: number) {
  const { data } = await moviesFetcher("/search/movie", {
    params: {
      ...DEFAULT_API_PARAMS,
      query,
      page,
      include_adult: false,
    }
  });

  return data;
}

export async function getMovieById(id: string) {
  try {
    const { data } = await moviesFetcher(`/movie/${id}`, {
      params: {
        ...DEFAULT_API_PARAMS,
      }
    });

    return data;
  } catch (error) {
    if ((error as AxiosError).response?.status === 404) {
      return null;
    }

    throw error;
  }
}
}
