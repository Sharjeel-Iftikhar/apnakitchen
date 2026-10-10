import { clsx, type ClassValue } from "clsx";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const formatter = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

/** 24500 -> "Rs 24,500" */
export function formatPrice(amount: number) {
  return `Rs ${formatter.format(amount)}`;
}

export function getShippingCost(subtotal: number) {
  const { freeShippingThreshold, flatRate } = siteConfig.shipping;
  return subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : flatRate;
}
