// Runs every GROQ query in src/sanity/queries.ts against an in-memory copy of
// the seeded dataset (plus documents that must be filtered out), and checks the
// results match the shapes the site expects. No Sanity account needed.
//
//   npm run test:queries

import assert from "node:assert/strict";
import { evaluate, parse } from "groq-js";
import { createImageUrlBuilder } from "@sanity/image-url";
import { buildSeedDocuments } from "./seed-documents";
import * as Q from "../src/sanity/queries";

let n = 0;
// Real asset IDs look like image-<hash>-<w>x<h>-<ext>; the image builder parses them.
const docs = await buildSeedDocuments(async () => ({
  _type: "image",
  asset: { _type: "reference", _ref: `image-${(++n).toString(16).padStart(40, "a")}-1200x1500-png` },
}));

const img = { _type: "image", _key: "x", asset: { _type: "reference", _ref: "image-" + "b".repeat(40) + "-800x1000-jpg" } };
const base = { _type: "product", price: 100, shortDescription: "s", description: "d", material: "m" };
const mustBeHidden = [
  { ...base, _id: "drafts.product-aria-dinner-set", name: "DRAFT", slug: { current: "aria-dinner-set" }, category: { _ref: "category-plates" }, images: [img] },
  { ...base, _id: "product-no-images", name: "No images", slug: { current: "no-images" }, category: { _ref: "category-plates" }, images: [] },
  { ...base, _id: "product-no-category", name: "No category", slug: { current: "no-category" }, images: [img] },
  { ...base, _id: "product-bad-category", name: "Bad category", slug: { current: "bad-category" }, category: { _ref: "category-deleted" }, images: [img] },
  { ...base, _id: "product-no-slug", name: "No slug", category: { _ref: "category-plates" }, images: [img] },
  { _id: "order-ORD-1", _type: "order", orderNumber: "ORD-1", customer: { fullName: "Private" }, total: 1 },
];

// The site queries with perspective "published", which hides drafts.* — emulate that.
const dataset = [...docs, ...mustBeHidden]
  .filter((d) => !String(d._id).startsWith("drafts."))
  .map((d) => ({ _createdAt: "2026-01-01T00:00:00Z", ...d }));

async function run<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return (await (await evaluate(parse(query, { params }), { dataset, params })).get()) as T;
}

type P = Record<string, unknown> & { id: string; slug: string; images: unknown[]; categorySlug: string };
const builder = createImageUrlBuilder({ projectId: "test", dataset: "production" });

const cats = await run<Record<string, unknown>[]>(Q.CATEGORIES_QUERY);
assert.equal(cats.length, 6, "6 categories");
assert.deepEqual(cats.map((c) => c.slug), ["dinner-sets", "plates", "bowls", "mugs-cups", "tea-coffee", "serveware"], "sorted by position");
assert.deepEqual(Object.keys(cats[0]).sort(), ["description", "image", "name", "slug"]);
builder.image(cats[0].image as never).width(10).url(); // must not throw

const cat = await run<Record<string, unknown>>(Q.CATEGORY_QUERY, { slug: "bowls" });
assert.equal(cat.name, "Bowls");
assert.equal(await run(Q.CATEGORY_QUERY, { slug: "nope" }), null);

const all = await run<P[]>(Q.PRODUCTS_QUERY, { categorySlug: null });
assert.equal(all.length, 12, `12 valid products, got ${all.map((p) => p.slug)}`);
for (const p of all) {
  assert.ok(p.id.startsWith("product-") && !p.id.startsWith("drafts."), p.id);
  assert.ok(typeof p.categorySlug === "string" && p.images.length > 0, p.slug);
  for (const key of ["name", "price", "shortDescription", "description", "material", "care", "inStock", "featured", "isNew"])
    assert.notEqual(p[key], undefined, `${p.slug}.${key}`);
  const url = builder.image(p.images[0] as never).width(1200).height(1500).fit("crop").url();
  assert.match(url, /^https:\/\/cdn\.sanity\.io\/images\/test\/production\/.+-1200x1500\.png\?/);
}
assert.ok(!all.some((p) => p.name === "DRAFT"), "draft hidden");

const plates = await run<P[]>(Q.PRODUCTS_QUERY, { categorySlug: "plates" });
assert.deepEqual(plates.map((p) => p.categorySlug), plates.map(() => "plates"));
assert.ok(plates.length >= 1);

const one = await run<P>(Q.PRODUCT_QUERY, { slug: "aria-dinner-set" });
assert.equal(one.name, "Aria Gold-Rim Dinner Set");
assert.equal(one.compareAtPrice, 28000);
assert.equal(await run(Q.PRODUCT_QUERY, { slug: "no-images" }), null, "incomplete product → 404");

const byIds = await run<P[]>(Q.PRODUCTS_BY_IDS_QUERY, { ids: ["product-aria-dinner-set", "product-no-images", "order-ORD-1", "nope"] });
assert.deepEqual(byIds.map((p) => p.id), ["product-aria-dinner-set"], "re-pricing only sees valid products");

const home = await run<Record<string, any>>(Q.HOMEPAGE_QUERY);
assert.equal(home.heroHeading, "Tableware for everyday rituals");
assert.deepEqual(home.heroCategory, { name: "Dinner Sets", slug: "dinner-sets" });
assert.ok(home.heroImage.asset._ref && home.storyImage.asset._ref, "homepage images");
builder.image(home.heroImage).width(2000).url();

console.log("✔ all GROQ queries return the expected shapes (6 categories, 12 products, hidden: drafts, incomplete, orders)");
