// Lets you run Sanity CLI commands from this folder, e.g.
//   npx sanity cors add https://www.yourdomain.com --credentials
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
