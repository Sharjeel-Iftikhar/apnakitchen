// Uploads the placeholder catalogue (src/lib/data + public/images) to Sanity so
// the client starts with example content to edit or replace.
// Safe to re-run: it only creates documents that don't exist yet, so it never
// overwrites the client's edits. Images are deduplicated by Sanity.
//
//   npm run seed        (needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local)

import { createReadStream } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { buildSeedDocuments, type ImageValue } from "./seed-documents";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local first.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-01-01",
  token,
  useCdn: false,
});

const uploaded = new Map<string, string>();
async function uploadImage(publicPath: string): Promise<ImageValue> {
  if (!uploaded.has(publicPath)) {
    const file = path.join(process.cwd(), "public", publicPath);
    const asset = await client.assets.upload("image", createReadStream(file), { filename: path.basename(file) });
    uploaded.set(publicPath, asset._id);
    process.stdout.write(".");
  }
  return { _type: "image", asset: { _type: "reference", _ref: uploaded.get(publicPath)! } };
}

async function main() {
  console.log(`Seeding ${projectId}/${client.config().dataset}`);
  const docs = await buildSeedDocuments(uploadImage);
  const tx = client.transaction();
  for (const doc of docs) tx.createIfNotExists(doc as { _id: string; _type: string });
  await tx.commit();
  console.log(`\nDone: ${docs.length} documents checked (existing ones left untouched), ${uploaded.size} images.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
