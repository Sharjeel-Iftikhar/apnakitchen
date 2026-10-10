import { defineQuery } from "next-sanity";

// Projections output exactly the shapes in src/types, so components don't
// know whether data came from Sanity or mock files. Image fields stay raw
// here and become URLs in src/lib/api.ts.

const categoryFields = /* groq */ `
  "slug": slug.current,
  name,
  description,
  image
`;

const productFields = /* groq */ `
  "id": _id,
  "slug": slug.current,
  name,
  "categorySlug": category->slug.current,
  price,
  compareAtPrice,
  "images": images[defined(asset)],
  shortDescription,
  description,
  material,
  pieces,
  dimensions,
  "care": coalesce(care, ""),
  "inStock": coalesce(inStock, true),
  "featured": coalesce(featured, false),
  "isNew": coalesce(isNew, false),
  _createdAt
`;

// Only list products that are complete enough to render.
const productFilter = /* groq */ `_type == "product" && defined(slug.current) && defined(category->slug.current) && defined(price) && count(images[defined(asset)]) > 0`;

const imageWithHotspot = /* groq */ `{ asset, hotspot, crop, alt }`;

export const HOMEPAGE_QUERY = defineQuery(`*[_id == "homepage"][0] {
  "heroImage": select(defined(heroImage.asset) => heroImage ${imageWithHotspot}),
  heroEyebrow,
  heroHeading,
  heroHighlight,
  heroText,
  "heroCategory": heroCategory->{ name, "slug": slug.current },
  "storyImage": select(defined(storyImage.asset) => storyImage ${imageWithHotspot})
}`);

export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category" && defined(slug.current)] | order(coalesce(sortOrder, 999) asc, name asc) { ${categoryFields} }`,
);

export const CATEGORY_QUERY = defineQuery(
  `*[_type == "category" && slug.current == $slug][0] { ${categoryFields} }`,
);

export const PRODUCTS_QUERY = defineQuery(
  `*[${productFilter} && ($categorySlug == null || category->slug.current == $categorySlug)] | order(_createdAt desc) { ${productFields} }`,
);

export const PRODUCT_QUERY = defineQuery(`*[${productFilter} && slug.current == $slug][0] { ${productFields} }`);

export const PRODUCTS_BY_IDS_QUERY = defineQuery(`*[${productFilter} && _id in $ids] { ${productFields} }`);
