import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons/Tag";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      description: "Click “Generate”. This becomes the page address, e.g. /category/dinner-sets",
      options: { source: "name", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "image",
      title: "Cover image",
      type: "image",
      description: "Shown on the home page. Portrait photos (4:5) look best.",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Position",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 10,
    }),
  ],
  orderings: [{ title: "Position", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "description", media: "image" } },
});
