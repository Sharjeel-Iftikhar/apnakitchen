// Shared domain types. These mirror the Sanity schemas we'll add in the CMS step,
// so swapping mock data for Sanity queries won't change any component.

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number; // PKR, whole rupees
  compareAtPrice?: number; // original price, shown struck-through when on sale
  images: string[];
  shortDescription: string;
  description: string;
  material: string;
  pieces?: string; // e.g. "24 pieces · serves 6"
  dimensions?: string;
  care: string;
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export type SiteImage = {
  src: string;
  alt: string;
  /** CSS object-position from the Studio hotspot, e.g. "40% 60%". */
  position?: string;
};

export type Homepage = {
  hero: {
    image: SiteImage;
    eyebrow?: string;
    heading: string;
    highlight?: string;
    text?: string;
    category?: { name: string; slug: string };
  };
  storyImage: SiteImage;
};
