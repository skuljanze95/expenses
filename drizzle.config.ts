import { defineConfig } from "drizzle-kit";

import { env } from "@/lib/env";

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/lib/db/schema/*.ts",
  strict: true,
  verbose: true,
});
