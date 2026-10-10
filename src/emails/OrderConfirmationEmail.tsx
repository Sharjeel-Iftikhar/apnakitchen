import { Hr, Text } from "@react-email/components";
import { siteConfig } from "@/config/site";
import { DetailLine, EmailFrame, OrderItemsTable, colors } from "./OrderEmailLayout";
import type { EmailOrder } from "./types";

/** Sent to the customer, only when they gave an email and a verified sender is configured. */
export function OrderConfirmationEmail({ order }: { order: EmailOrder }) {
  return (
    <EmailFrame preview={`We've received your order ${order.orderNumber}`} title="Thank you for your order">
      <Text style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 20px" }}>
        Hi {order.customer.fullName.split(" ")[0]}, we&apos;ve received your order <strong>{order.orderNumber}</strong>.
        Our team will call you on {order.customer.phone} shortly to confirm it before dispatch. You&apos;ll pay in cash
        when it arrives, usually within {siteConfig.shipping.deliveryEstimate}.
      </Text>

      <OrderItemsTable order={order} />

      <Hr style={{ borderColor: colors.line, margin: "24px 0" }} />
      <DetailLine label="Delivering to">
        {order.customer.address}, {order.customer.city}
      </DetailLine>
      <Text style={{ fontSize: 13, color: colors.muted, marginTop: 20 }}>
        Questions? Call or WhatsApp us on {siteConfig.contact.phone}. — {siteConfig.name}
      </Text>
    </EmailFrame>
  );
}
