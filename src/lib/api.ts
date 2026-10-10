// Data-access layer. Every page reads data ONLY through these functions.
// With NEXT_PUBLIC_SANITY_PROJECT_ID set, data comes from Sanity; without it,
// from the mock files in src/lib/data (handy for local design work).

import type { SanityImageSource } from "@sanity/image-url";
import { categories as mockCategories } from "@/lib/data/categories";
import { products as mockProducts } from "@/lib/data/products";
import { sanityFetch } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { bannerImageUrl, productImageUrl } from "@/sanity/image";
import {
  CATEGORIES_QUERY,
  CATEGORY_QUERY,
  HOMEPAGE_QUERY,
  PRODUCTS_BY_IDS_QUERY,
  PRODUCTS_QUERY,
  PRODUCT_QUERY,
} from "@/sanity/queries";
import type { Category, Homepage, Product, SiteImage, SortOption } from "@/types";

// Raw shapes returned by the GROQ projections (images not yet turned into URLs).
type RawCategory = Omit<Category, "image"> & { image: SanityImageSource | null };
type RawProduct = Omit<Product, "images" | "compareAtPrice" | "pieces" | "dimensions"> & {
  images: SanityImageSource[];
  compareAtPrice: number | null;
  pieces: string | null;
  dimensions: string | null;
  _createdAt: string;
};

const toCategory = (c: RawCategory): Category => ({
  ...c,
  image: c.image ? productImageUrl(c.image, 900) : "/images/hero.svg",
});

const toProduct = ({ _createdAt, ...p }: RawProduct): Product => ({
  ...p,
  images: p.images.map((img) => productImageUrl(img)),
  compareAtPrice: p.compareAtPrice ?? undefined,
  pieces: p.pieces ?? undefined,
  dimensions: p.dimensions ?? undefined,
});

function sortProducts(list: Product[], sort?: SortOption) {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      // Stable sort keeps the newest-created order within each group.
      return sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    default:
      return sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }
}

// Home page defaults: used until the client fills in Studio → Homepage,
// and for any field they leave empty.
const homepageDefaults: Homepage = {
  hero: {
    image: { src: "/images/hero.svg", alt: "Stacked cream dinner plates with a sage bowl, terracotta teapot and charcoal mug" },
    eyebrow: "New season · Autumn collection",
    heading: "Tableware for everyday rituals",
    highlight: "everyday",
    text: "Dinner sets, stoneware and serveware chosen for how they feel in the hand — and how they look on your table.",
    category: { name: "Dinner sets", slug: "dinner-sets" },
  },
  storyImage: { src: "/images/story.svg", alt: "Terracotta and cream stoneware bowls" },
};

type RawImage = (SanityImageSource & { hotspot?: { x: number; y: number }; alt?: string }) | null;
type RawHomepage = {
  heroImage: RawImage;
  heroEyebrow: string | null;
  heroHeading: string | null;
  heroHighlight: string | null;
  heroText: string | null;
  heroCategory: { name: string; slug: string } | null;
  storyImage: RawImage;
} | null;

const toSiteImage = (img: RawImage, fallback: SiteImage): SiteImage =>
  img
    ? {
        src: bannerImageUrl(img),
        alt: img.alt || fallback.alt,
        position: img.hotspot ? `${Math.round(img.hotspot.x * 100)}% ${Math.round(img.hotspot.y * 100)}%` : undefined,
      }
    : fallback;

export async function getHomepage(): Promise<Homepage> {
  if (!isSanityConfigured) return homepageDefaults;
  const raw = await sanityFetch<RawHomepage>({ query: HOMEPAGE_QUERY, tags: ["homepage", "category"] });
  if (!raw) return homepageDefaults;
  const d = homepageDefaults.hero;
  const heading = raw.heroHeading || d.heading;
  return {
    hero: {
      image: toSiteImage(raw.heroImage, d.image),
      eyebrow: raw.heroEyebrow ?? d.eyebrow,
      heading,
      // Only keep the default highlight if the default headline is still in use.
      highlight: raw.heroHighlight || (raw.heroHeading ? undefined : d.highlight),
      text: raw.heroText ?? d.text,
      category: raw.heroCategory ?? undefined,
    },
    storyImage: toSiteImage(raw.storyImage, homepageDefaults.storyImage),
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return mockCategories;
  const raw = await sanityFetch<RawCategory[]>({ query: CATEGORIES_QUERY, tags: ["category"] });
  return raw.map(toCategory);
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  if (!isSanityConfigured) return mockCategories.find((c) => c.slug === slug);
  const raw = await sanityFetch<RawCategory | null>({ query: CATEGORY_QUERY, params: { slug }, tags: ["category"] });
  return raw ? toCategory(raw) : undefined;
}

async function getAllProducts(categorySlug?: string): Promise<Product[]> {
  if (!isSanityConfigured) {
    return categorySlug ? mockProducts.filter((p) => p.categorySlug === categorySlug) : mockProducts;
  }
  const raw = await sanityFetch<RawProduct[]>({
    query: PRODUCTS_QUERY,
    params: { categorySlug: categorySlug ?? null },
    tags: ["product", "category"],
  });
  return raw.map(toProduct);
}

export async function getProducts(opts?: { categorySlug?: string; sort?: SortOption }): Promise<Product[]> {
  return sortProducts(await getAllProducts(opts?.categorySlug), opts?.sort);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.featured).slice(0, limit);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!isSanityConfigured) return mockProducts.find((p) => p.slug === slug);
  const raw = await sanityFetch<RawProduct | null>({ query: PRODUCT_QUERY, params: { slug }, tags: ["product", "category"] });
  return raw ? toProduct(raw) : undefined;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = (await getAllProducts()).filter((p) => p.id !== product.id);
  const same = all.filter((p) => p.categorySlug === product.categorySlug);
  const others = all.filter((p) => p.categorySlug !== product.categorySlug);
  return [...same, ...others].slice(0, limit);
}

/** Used to re-price orders on the server, so it always skips the cache. */
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!isSanityConfigured) return mockProducts.filter((p) => ids.includes(p.id));
  const raw = await sanityFetch<RawProduct[]>({ query: PRODUCTS_BY_IDS_QUERY, params: { ids }, tags: ["product"], fresh: true });
  return raw.map(toProduct);
}
