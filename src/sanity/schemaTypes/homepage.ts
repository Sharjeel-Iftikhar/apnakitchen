import { defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

// Singleton (one document, ID "homepage"): the editable parts of the home page.
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Top banner", default: true },
    { name: "story", title: "Our story" },
  ],
  fields: [
    defineField({
      name: "heroImage",
      title: "Banner photo",
      type: "image",
      group: "hero",
      description: "Large photo at the top of the home page. Use a wide, high-quality photo (at least 2000 px wide). Click “Edit” to set the focus point so it stays in view on phones.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Describe the photo",
          type: "string",
          description: "For Google and screen readers, e.g. “Gold-rim dinner set on a dining table”.",
        }),
      ],
    }),
    defineField({
      name: "heroEyebrow",
      title: "Small line above the headline",
      type: "string",
      group: "hero",
      initialValue: "New season · Autumn collection",
      validation: (r) => r.max(50),
    }),
    defineField({
      name: "heroHeading",
      title: "Headline",
      type: "string",
      group: "hero",
      initialValue: "Tableware for everyday rituals",
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: "heroHighlight",
      title: "Word to highlight",
      type: "string",
      group: "hero",
      description: "Optional. A word from the headline shown in italic accent colour, e.g. “everyday”.",
      validation: (r) =>
        r.custom((word, ctx) => {
          const heading = (ctx.document as { heroHeading?: string } | undefined)?.heroHeading ?? "";
          return !word || heading.includes(word) || "This word must appear in the headline exactly as typed.";
        }),
    }),
    defineField({
      name: "heroText",
      title: "Text under the headline",
      type: "text",
      rows: 3,
      group: "hero",
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "heroCategory",
      title: "Second button category",
      type: "reference",
      group: "hero",
      to: [{ type: "category" }],
      description: "Optional. Shows a second button next to “Shop the collection” linking to this category.",
    }),
    defineField({
      name: "storyImage",
      title: "“Our story” photo",
      type: "image",
      group: "story",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Describe the photo", type: "string" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
