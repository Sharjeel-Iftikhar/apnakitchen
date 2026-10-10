// Sanity connection settings. Public values (project ID, dataset) are safe in
// the browser; tokens are read only in server files (see ./write-client.ts).

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-01-01";

/** False until the project ID is set: the site then falls back to mock data. */
export const isSanityConfigured = projectId.length > 0;
