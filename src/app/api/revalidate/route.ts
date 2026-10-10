import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import type { SanityTag } from "@/sanity/client";

// Sanity webhook → called whenever the client publishes, edits or deletes a
// product or category. Expires the cached data so the site updates in seconds.
// Setup: README → "Connect Sanity" → step 6.

const TAGS: SanityTag[] = ["product", "category", "homepage"];

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });

  try {
    // `true` waits until the change is queryable, so the refetch isn't stale.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) return NextResponse.json({ message: "Invalid signature" }, { status: 401 });

    const tag = body?._type as SanityTag | undefined;
    if (!tag || !TAGS.includes(tag)) {
      return NextResponse.json({ revalidated: false, message: `Ignored type: ${body?._type ?? "none"}` });
    }

    // Webhooks come from outside a Server Action, so expire immediately.
    revalidateTag(tag, { expire: 0 });
    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  } catch (err) {
    console.error("[revalidate]", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
