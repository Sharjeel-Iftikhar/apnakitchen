import { z } from "zod";

// Pakistani mobile numbers: 03XXXXXXXXX, +923XXXXXXXXX or 923XXXXXXXXX (spaces/dashes allowed)
const PK_MOBILE = /^(?:\+?92|0)3\d{9}$/;

export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Sialkot",
  "Gujranwala",
  "Other",
] as const;

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, "Please enter your full name"),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => PK_MOBILE.test(v), "Enter a valid mobile number, e.g. 0300 1234567"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]),
  city: z.string().min(1, "Please select your city"),
  address: z.string().trim().min(10, "Please enter your complete address"),
  notes: z.string().trim().max(500).optional(),
});

/** "0300-1234567" / "923001234567" / "+92 300 1234567" → "+923001234567" */
export function normalizePkMobile(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `+${digits.startsWith("0") ? `92${digits.slice(1)}` : digits}`;
}

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type CheckoutData = z.output<typeof checkoutSchema>;
