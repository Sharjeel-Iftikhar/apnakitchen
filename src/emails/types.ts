export type EmailOrder = {
  orderNumber: string;
  placedAt: string; // ISO
  customer: { fullName: string; phone: string; email: string; city: string; address: string; notes?: string };
  items: { name: string; price: number; quantity: number; lineTotal: number }[];
  subtotal: number;
  shipping: number;
  total: number;
};
