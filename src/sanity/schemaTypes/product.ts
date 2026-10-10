import { defineArrayMember, defineField, defineType } from "sanity";
import { PackageIcon } from "@sanity/icons/Package";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "details", title: "Details" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "main",
      description: "Click “Generate”. This becomes the page address, e.g. /product/aria-dinner-set",
      options: { source: "name", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "main",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      group: "main",
      description: "Drag photos here. The first one is the main photo; drag to reorder. Click a photo → “Edit” to set the focus point.",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      options: { layout: "grid" },
      validation: (r) => r.required().min(1).error("Add at least one photo."),
    }),
    defineField({
      name: "price",
      title: "Price (Rs)",
      type: "number",
      group: "main",
      validation: (r) => r.required().integer().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Original price (Rs)",
      type: "number",
      group: "main",
      description: "Optional. Fill this in to show a sale: it appears crossed out next to the price.",
      validation: (r) =>
        r.integer().min(0).custom((value, ctx) => {
          const price = (ctx.document as { price?: number } | undefined)?.price;
          return value == null || price == null || value > price || "Must be higher than the price.";
        }),
    }),
    defineField({
      name: "inStock",
      title: "In stock",
      type: "boolean",
      group: "main",
      description: "Turn off to show “Sold out” and stop orders.",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Show on home page",
      type: "boolean",
      group: "main",
      initialValue: false,
    }),
    defineField({ name: "isNew", title: "Mark as new", type: "boolean", group: "main", initialValue: false }),
    defineField({
      name: "shortDescription",
      title: "One-line summary",
      type: "string",
      group: "main",
      description: "Shown under the name on product cards.",
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({ name: "material", title: "Material", type: "string", group: "details", validation: (r) => r.required() }),
    defineField({ name: "pieces", title: "Includes", type: "string", group: "details", description: "e.g. “Set of 4” or “32 pieces · serves 6”" }),
    defineField({ name: "dimensions", title: "Size", type: "string", group: "details", description: "e.g. “27 cm diameter”" }),
    defineField({
      name: "care",
      title: "Care instructions",
      type: "text",
      rows: 2,
      group: "details",
      initialValue: "Dishwasher and microwave safe. Avoid sudden temperature changes.",
    }),
  ],
  preview: {
    select: { title: "name", price: "price", inStock: "inStock", media: "images.0" },
    prepare: ({ title, price, inStock, media }) => ({
      title,
      subtitle: `Rs ${Number(price ?? 0).toLocaleString("en-PK")}${inStock === false ? " · Sold out" : ""}`,
      media,
    }),
  },
});
