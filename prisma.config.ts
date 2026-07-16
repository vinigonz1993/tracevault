import "dotenv/config";
import { defineConfig, env } from "prisma/config";

console.log("DATABASE_URL:", env("DATABASE_URL")); // Log the DATABASE_URL to verify it's being read correctly

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});