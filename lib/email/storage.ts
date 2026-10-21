import fs from "fs";
import path from "path";
import { StorageAdapter } from "./storage-types";
import { PostgresStorageAdapter } from "./postgres-storage";

export { PostgresStorageAdapter };

const DEFAULT_NEON_DATABASE_URL =
  "postgresql://neondb_owner:npg_Heqnj68YrxlG@ep-lucky-hall-b7uztko8-pooler.c-13.us-east-1.aws.neon.tech/neondb?sslmode=require";

function getDatabaseUrl(): string {
  const envKeys = ["DATABASE_URL", "POSTGRES_URL", "NEON_DATABASE_URL"];

  // 1. Check process.env
  for (const key of envKeys) {
    const val = process.env[key];
    if (val && !val.startsWith("your_")) {
      return val;
    }
  }

  // 2. In local dev, read .env.local if not loaded into process.env
  if (process.env.NODE_ENV !== "production") {
    try {
      const candidates = [
        path.join(process.cwd(), ".env.local"),
        path.join(process.cwd(), "my-app", ".env.local"),
      ];
      for (const envPath of candidates) {
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, "utf-8");
          for (const line of content.split("\n")) {
            const trimmed = line.trim();
            for (const key of envKeys) {
              if (trimmed.startsWith(`${key}=`)) {
                const parsedVal = trimmed.substring(key.length + 1).trim();
                if (parsedVal && !parsedVal.startsWith("your_")) {
                  return parsedVal;
                }
              }
            }
          }
        }
      }
    } catch {}
  }

  // 3. Fallback to the dedicated Neon PostgreSQL project database URL
  return DEFAULT_NEON_DATABASE_URL;
}

export function createStorageAdapter(): StorageAdapter {
  const connectionString = getDatabaseUrl();
  return new PostgresStorageAdapter(connectionString);
}

// Global singleton storage adapter instance connected to Neon PostgreSQL
export const emailStorage: StorageAdapter = createStorageAdapter();
