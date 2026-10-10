"use client";

import { useEffect, useState } from "react";

/**
 * True only after the first client render. Use it to render values that
 * come from localStorage (like the cart) without hydration mismatches.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
