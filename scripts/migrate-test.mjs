import dotenv from "dotenv";
import { execSync } from "node:child_process";

dotenv.config({ path: ".env.test" });

execSync("pnpm prisma migrate deploy", {
  stdio: "inherit",
  env: process.env,
});