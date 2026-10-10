import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";
import { writeClient } from "@/sanity/write-client";
import { NewOrderEmail } from "@/emails/NewOrderEmail";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmationEmail";
import type { EmailOrder } from "@/emails/types";

type OrderRecord = Omit<EmailOrder, "items"> & { items: (EmailOrder["items"][number] & { productId: string })[] };

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const notifyTo = process.env.ORDER_NOTIFY_EMAIL;
// Until the domain is verified in Resend, use "onboarding@resend.dev" — it can
// only email the Resend account owner, so customer emails stay off then.
const from = process.env.ORDER_FROM_EMAIL || `${siteConfig.name} <onboarding@resend.dev>`;
const canEmailCustomers = !!process.env.ORDER_FROM_EMAIL && !from.includes("resend.dev");

/** True once orders have somewhere to go (Sanity write token and/or Resend). */
export const hasOrderDestination = !!writeClient || (!!resend && !!notifyTo);

// The dot puts orders on a Sanity "path": such documents are readable only with
// a login or token, even in a public dataset (the Free plan can't make datasets
// private). This keeps customers' names, phones and addresses out of public reach.
export const orderDocId = (orderNumber: string) => `orders.${orderNumber}`;

/** Saves the order to Sanity. Returns false (and logs) on failure or when not configured. */
export async function saveOrder(order: OrderRecord): Promise<boolean> {
  if (!writeClient) return false;
  try {
    await writeClient.create({
      _id: orderDocId(order.orderNumber),
      _type: "order",
      status: "new",
      orderNumber: order.orderNumber,
      placedAt: order.placedAt,
      customer: order.customer,
      items: order.items.map(({ productId, ...item }, i) => ({
        _key: `item${i}`,
        _type: "orderItem",
        ...item,
        product: { _type: "reference", _ref: productId, _weak: true },
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
    });
    return true;
  } catch (err) {
    console.error("[order] Sanity save failed", order.orderNumber, err);
    return false;
  }
}

/** Emails the shop (and the customer, when possible). Returns false if the shop email didn't go out. */
export async function sendOrderEmails(order: EmailOrder, savedToSanity: boolean): Promise<boolean> {
  if (!resend || !notifyTo) return false;

  const studioUrl = savedToSanity
    ? `${siteConfig.url}/studio/intent/edit/id=${orderDocId(order.orderNumber)};type=order/`
    : undefined;

  const shop = await resend.emails.send({
    from,
    to: notifyTo.split(",").map((s) => s.trim()),
    replyTo: order.customer.email || undefined,
    subject: `New order ${order.orderNumber} · ${order.customer.fullName} (${order.customer.city})`,
    react: NewOrderEmail({ order, studioUrl }),
  });
  if (shop.error) console.error("[order] shop email failed", order.orderNumber, shop.error);

  if (canEmailCustomers && order.customer.email) {
    const customer = await resend.emails.send({
      from,
      to: order.customer.email,
      subject: `Your order ${order.orderNumber} is received`,
      react: OrderConfirmationEmail({ order }),
    });
    if (customer.error) console.error("[order] customer email failed", order.orderNumber, customer.error);
  }

  return !shop.error;
}
