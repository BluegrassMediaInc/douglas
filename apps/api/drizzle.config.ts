/// <reference types="node" />
import type { Config } from "drizzle-kit";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL
  },
  schemaFilter: ["app"]
} satisfies Config;
