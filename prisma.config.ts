import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

dotenv.config({
  path: process.env.PRISMA_ENV_FILE ?? ".env",
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});