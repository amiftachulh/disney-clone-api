import { z } from "zod";

const envVariables = z.object({
  NODE_ENV: z.string().optional(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  TMDB_API_URL: z.string(),
  TMDB_API_KEY: z.string(),
});

export function validateEnv() {
  envVariables.parse(process.env);
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> { }
  }
}
