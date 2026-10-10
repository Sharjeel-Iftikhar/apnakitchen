import "server-only";

/**
 * Verifies a Cloudflare Turnstile token. Spam protection is off (always passes)
 * until TURNSTILE_SECRET_KEY is set.
 */
export async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch (err) {
    console.error("[turnstile] verification request failed", err);
    return false;
  }
}
