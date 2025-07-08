// import { config } from "dotenv";
import Airtable from "airtable";

// config({
//   path: ".env.local",
// });

// Use the singleton pattern to avoid creating multiple connections with HMR
declare global {
  // eslint-disable-next-line no-var
  var __airtable: ReturnType<typeof Airtable.base> | undefined;
}

if (!process.env.AIRTABLE_API_KEY) {
  throw new Error("AIRTABLE_API_KEY is not set");
} else if (!process.env.AIRTABLE_BASE_ID) {
  throw new Error("AIRTABLE_BASE_ID is not set");
}

// Use existing connection in development to avoid too many connections with HMR
export const base =
  global.__airtable ||
  (global.__airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID));

// In production, global is not persisted between restarts/deploys
if (process.env.NODE_ENV !== "production") global.__airtable = base;

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function convertKeysToSnakeCase(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key
        .replace(/\s*\(([^)]*)\)/g, " $1") // remove parentheses but keep content
        .replace(/\s+/g, "_") // replace spaces with underscores
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2") // insert _ only between lower/number and upper
        .toLowerCase(),
      value,
    ])
  );
}
