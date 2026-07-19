import { execSync } from "node:child_process";

const container = process.argv[2];

while (true) {
  try {
    execSync(`docker exec ${container} pg_isready -U tracevault`, {
      stdio: "ignore",
    });

    console.log("Database is ready");
    break;
  } catch {
    console.log("Waiting for database...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}