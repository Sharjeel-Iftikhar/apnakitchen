import { Body, Column, Container, Head, Heading, Hr, Html, Preview, Row, Section, Text } from "@react-email/components";
import { formatPrice } from "@/lib/utils";
import type { EmailOrder } from "./types";

// Shared frame and order table for both emails. React Email escapes every
// value, so customer-entered text is safe to render.

export const colors = { ink: "#1f1b18", muted: "#7a716a", line: "#e7dfd3", cream: "#f7f3ec", terracotta: "#b5583a" };
const font = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

export function EmailFrame({ preview, title, children }: { preview: string; title: string; children: React.ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.cream, fontFamily: font, color: colors.ink, margin: 0, padding: "24px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", maxWidth: 560, padding: "32px 28px" }}>
          <Heading as="h1" style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: 26, margin: "0 0 20px" }}>
            {title}
          </Heading>
          {children}
        </Container>
      </Body>
    </Html>
  );
}

export function OrderItemsTable({ order }: { order: EmailOrder }) {
  const cell = { fontSize: 14, margin: 0, padding: "6px 0" };
  return (
    <Section>
      {order.items.map((item, i) => (
        <Row key={i}>
          <Column>
            <Text style={cell}>
              {item.quantity} × {item.name}
              <br />
              <span style={{ color: colors.muted, fontSize: 12 }}>{formatPrice(item.price)} each</span>
            </Text>
          </Column>
          <Column align="right" style={{ verticalAlign: "top" }}>
            <Text style={cell}>{formatPrice(item.lineTotal)}</Text>
          </Column>
        </Row>
      ))}
      <Hr style={{ borderColor: colors.line, margin: "12px 0" }} />
      <TotalRow label="Subtotal" value={formatPrice(order.subtotal)} />
      <TotalRow label="Delivery" value={order.shipping === 0 ? "Free" : formatPrice(order.shipping)} />
      <TotalRow label="Total (cash on delivery)" value={formatPrice(order.total)} strong />
    </Section>
  );
}

function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  const style = { fontSize: strong ? 16 : 14, fontWeight: strong ? 700 : 400, margin: 0, padding: "3px 0" };
  return (
    <Row>
      <Column><Text style={{ ...style, color: strong ? colors.ink : colors.muted }}>{label}</Text></Column>
      <Column align="right"><Text style={style}>{value}</Text></Column>
    </Row>
  );
}

export function DetailLine({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 14, margin: "0 0 8px", lineHeight: 1.5 }}>
      <span style={{ color: colors.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      <br />
      {children}
    </Text>
  );
}
