"use client";

// Sanity Studio config, served by the Next.js app at /studio.
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { SINGLETON_TYPES, schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "default",
  title: "Maison Crockery",
  basePath: "/studio",
  projectId: projectId || "not-configured",
  dataset,
  schema: {
    types: schemaTypes,
    // Orders come from the website only and the homepage is a single document,
    // so neither appears in the "Create" menu.
    templates: (templates) => templates.filter((t) => t.schemaType !== "order" && !SINGLETON_TYPES.has(t.schemaType)),
  },
  document: {
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== "order" && !SINGLETON_TYPES.has(item.templateId)),
    // Orders can be edited (status, notes) and deleted, but not duplicated.
    actions: (prev, { schemaType }) => {
      if (schemaType === "order") return prev.filter((a) => a.action !== "duplicate");
      // The homepage can be edited and published, never deleted or duplicated.
      if (SINGLETON_TYPES.has(schemaType)) return prev.filter((a) => a.action !== "delete" && a.action !== "duplicate" && a.action !== "unpublish");
      return prev;
    },
  },
  plugins: [
    structureTool({ structure }),
    // GROQ query playground for the developer (read-only).
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
