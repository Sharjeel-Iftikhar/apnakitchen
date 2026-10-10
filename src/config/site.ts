// Single place to change brand details. Later this can come from a
// "Site settings" document in Sanity so the client can edit it.

export const siteConfig = {
  name: "Apna Kitchen",
  tagline: "Tableware for everyday rituals",
  description:
    "Handpicked dinner sets, plates, bowls, mugs and serveware — delivered across Pakistan with cash on delivery.",
  url: "https://www.apnakitchen.pk",
  contact: {
    phone: "+92 324 7617290",
    whatsapp: "923247617290", // digits only, used in wa.me links
    email: "hello@apnakitchen.pk", // receives mail once Cloudflare Email Routing is on
    address: "Gujranwala, Pakistan",
    hours: "Sat – Thu, 10am – 8pm",
  },
  // TODO: replace with the real profile links when the pages are ready.
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
  shipping: {
    freeShippingThreshold: 10000,
    flatRate: 250,
    deliveryEstimate: "3–5 working days",
  },
  currency: "PKR",
} as const;

export type NavItem = { label: string; href: string };

// The shop navigation is built from the categories in Sanity (see SiteShell),
// so new or renamed categories appear automatically.
export const shopAllLink: NavItem = { label: "Shop all", href: "/shop" };

/** How many categories fit in the desktop header; the rest are in the menu/footer. */
export const HEADER_CATEGORY_LIMIT = 6;
