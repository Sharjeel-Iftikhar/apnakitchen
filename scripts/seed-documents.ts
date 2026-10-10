// Turns the mock catalogue into Sanity documents. Pure (no network), so the
// seed script and query tests build exactly the same data.

import { categories } from "../src/lib/data/categories";
import { products } from "../src/lib/data/products";

export type ImageValue = { _type: "image"; asset: { _type: "reference"; _ref: string } };
export type ImageResolver = (publicPath: string) => Promise<ImageValue>;

const slug = (s: string) => ({ _type: "slug", current: s });

export async function buildSeedDocuments(image: ImageResolver) {
  const docs: Record<string, unknown>[] = [];

  for (const [i, c] of categories.entries()) {
    docs.push({
      _id: `category-${c.slug}`,
      _type: "category",
      name: c.name,
      slug: slug(c.slug),
      description: c.description,
      image: await image(c.image),
      sortOrder: (i + 1) * 10,
    });
  }

  for (const p of products) {
    const images = [];
    for (const [i, src] of p.images.entries()) images.push({ ...(await image(src)), _key: `img${i}` });
    docs.push({
      _id: `product-${p.slug}`,
      _type: "product",
      name: p.name,
      slug: slug(p.slug),
      category: { _type: "reference", _ref: `category-${p.categorySlug}` },
      images,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      inStock: p.inStock,
      featured: !!p.featured,
      isNew: !!p.isNew,
      shortDescription: p.shortDescription,
      description: p.description,
      material: p.material,
      pieces: p.pieces,
      dimensions: p.dimensions,
      care: p.care,
    });
  }

  docs.push({
    _id: "homepage",
    _type: "homepage",
    heroImage: { ...(await image("/images/hero.svg")), alt: "Stacked cream dinner plates with a sage bowl, terracotta teapot and charcoal mug" },
    heroEyebrow: "New season · Autumn collection",
    heroHeading: "Tableware for everyday rituals",
    heroHighlight: "everyday",
    heroText: "Dinner sets, stoneware and serveware chosen for how they feel in the hand — and how they look on your table.",
    heroCategory: { _type: "reference", _ref: "category-dinner-sets" },
    storyImage: { ...(await image("/images/story.svg")), alt: "Terracotta and cream stoneware bowls" },
  });

  return docs;
}
