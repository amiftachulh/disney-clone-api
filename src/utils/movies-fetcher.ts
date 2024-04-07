import axios from "axios";

export const DEFAULT_API_PARAMS = {
  api_key: process.env.TMDB_API_KEY,
};

const moviesFetcher = axios.create({
  baseURL: process.env.TMDB_API_URL,
});

moviesFetcher.defaults.headers.common["Accept-Encoding"] = "gzip";

export default moviesFetcher;
