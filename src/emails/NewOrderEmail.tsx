import { Button, Hr, Link, Section, Text } from "@react-email/components";
import { formatPrice } from "@/lib/utils";
import { DetailLine, EmailFrame, OrderItemsTable, colors } from "./OrderEmailLayout";
import type { EmailOrder } from "./types";

/** Sent to the shop (ORDER_NOTIFY_EMAIL) for every order. */
export function NewOrderEmail({ order, studioUrl }: { order: EmailOrder; studioUrl?: string }) {
  const { customer } = order;
  const whatsapp = customer.phone.replace(/\D/g, ""); // phone is stored as +923XXXXXXXXX
  const placed = new Date(order.placedAt).toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" });

  return (
    <EmailFrame
      preview={`${customer.fullName} · ${customer.city} · ${formatPrice(order.total)}`}
      title={`New order ${order.orderNumber}`}
    >
      <Text style={{ fontSize: 14, color: colors.muted, margin: "0 0 20px" }}>
        Placed {placed}. Call the customer to confirm, then update the status in the Studio.
      </Text>

      <Section style={{ backgroundColor: colors.cream, padding: "16px 18px", marginBottom: 20 }}>
        <DetailLine label="Customer">{customer.fullName}</DetailLine>
        <DetailLine label="Phone">
          <Link href={`tel:${customer.phone}`} style={{ color: colors.terracotta }}>{customer.phone}</Link>
          {"  ·  "}
          <Link href={`https://wa.me/${whatsapp}`} style={{ color: colors.terracotta }}>WhatsApp</Link>
        </DetailLine>
        {customer.email && <DetailLine label="Email">{customer.email}</DetailLine>}
        <DetailLine label="Deliver to">
          {customer.address}
          <br />
          {customer.city}
        </DetailLine>
        {customer.notes && <DetailLine label="Customer notes">{customer.notes}</DetailLine>}
      </Section>

      <OrderItemsTable order={order} />

      {studioUrl && (
        <>
          <Hr style={{ borderColor: colors.line, margin: "24px 0" }} />
          <Button href={studioUrl} style={{ backgroundColor: colors.ink, color: colors.cream, fontSize: 14, padding: "12px 20px" }}>
            Open order in Studio
          </Button>
        </>
      )}
    </EmailFrame>
  );
}
