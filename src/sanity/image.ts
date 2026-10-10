import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId: projectId || "not-configured", dataset });

/** Wide/banner images: resized only. The hotspot is applied with CSS object-position. */
export function bannerImageUrl(source: SanityImageSource, width = 2000) {
  return builder.image(source).width(width).auto("format").url();
}

/**
 * Crops to the site's 4:5 card ratio around the hotspot the client sets in the
 * Studio. next/image then resizes this per device.
 */
export function productImageUrl(source: SanityImageSource, width = 1200) {
  return builder.image(source).width(width).height(Math.round(width * 1.25)).fit("crop").auto("format").url();
}
