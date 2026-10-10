import "server-only";
import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

// Read client. The token is optional: it's only needed if the dataset is made
// private (paid plans). Orders stay private regardless — see orderDocId.
const client = createClient({
  projectId: projectId || "not-configured",
  dataset,
  apiVersion,
  useCdn: false, // Next's data cache + webhook revalidation is the cache layer
  perspective: "published", // never show drafts on the site
  token: process.env.SANITY_API_READ_TOKEN,
});

// With the webhook set up (SANITY_REVALIDATE_SECRET), pages refresh the moment
// the client publishes, so a long cache is safe. Without it (e.g. on localhost,
// which Sanity can't reach), refresh every 10 seconds so edits still show quickly.
const revalidate = process.env.SANITY_REVALIDATE_SECRET ? 3600 : 10;

/** Cache tag per document type; /api/revalidate expires these on publish. */
export type SanityTag = "product" | "category" | "homepage";

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  fresh = false,
}: {
  query: string;
  params?: QueryParams;
  tags: SanityTag[];
  /** Skip every cache — used when re-pricing an order. */
  fresh?: boolean;
}): Promise<T> {
  if (!isSanityConfigured) throw new Error("Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID is empty).");
  return client.fetch<T>(
    query,
    params,
    fresh ? { cache: "no-store" } : { next: { revalidate, tags } },
  );
}
