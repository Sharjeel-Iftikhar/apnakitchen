import { defineArrayMember, defineField, defineType } from "sanity";
import { BasketIcon } from "@sanity/icons/Basket";

export const ORDER_STATUSES = [
  { title: "🆕 New", value: "new" },
  { title: "📞 Confirmed", value: "confirmed" },
  { title: "🚚 Dispatched", value: "dispatched" },
  { title: "✅ Delivered", value: "delivered" },
  { title: "✖️ Cancelled", value: "cancelled" },
] as const;

// Orders are created by the website checkout. Everything the customer sent is
// read-only; the client only changes the status and adds internal notes.
export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  // Status changes save instantly, no separate "Publish" click.
  liveEdit: true,
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: [...ORDER_STATUSES], layout: "radio", direction: "horizontal" },
      initialValue: "new",
    }),
    defineField({
      name: "internalNote",
      title: "Internal note",
      type: "text",
      rows: 3,
      description: "Only visible here, e.g. “Called 3pm, confirmed. Deliver after 5pm.”",
    }),
    defineField({ name: "orderNumber", title: "Order number", type: "string", readOnly: true }),
    defineField({ name: "placedAt", title: "Placed at", type: "datetime", readOnly: true }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "object",
      readOnly: true,
      fields: [
        defineField({ name: "fullName", title: "Name", type: "string" }),
        defineField({ name: "phone", title: "Phone", type: "string" }),
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "address", title: "Address", type: "text", rows: 3 }),
        defineField({ name: "notes", title: "Customer notes", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      readOnly: true,
      // A snapshot: later price or name changes don't rewrite past orders.
      of: [
        defineArrayMember({
          type: "object",
          name: "orderItem",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "price", title: "Unit price", type: "number" }),
            defineField({ name: "quantity", type: "number" }),
            defineField({ name: "lineTotal", type: "number" }),
            defineField({ name: "product", type: "reference", to: [{ type: "product" }], weak: true }),
          ],
          preview: {
            select: { name: "name", quantity: "quantity", lineTotal: "lineTotal" },
            prepare: ({ name, quantity, lineTotal }) => ({
              title: `${quantity} × ${name}`,
              subtitle: `Rs ${Number(lineTotal ?? 0).toLocaleString("en-PK")}`,
            }),
          },
        }),
      ],
    }),
    defineField({ name: "subtotal", title: "Subtotal (Rs)", type: "number", readOnly: true }),
    defineField({ name: "shipping", title: "Delivery (Rs)", type: "number", readOnly: true }),
    defineField({ name: "total", title: "Total to collect (Rs)", type: "number", readOnly: true }),
  ],
  orderings: [{ title: "Newest first", name: "placedAtDesc", by: [{ field: "placedAt", direction: "desc" }] }],
  preview: {
    select: { orderNumber: "orderNumber", name: "customer.fullName", city: "customer.city", total: "total", status: "status" },
    prepare: ({ orderNumber, name, city, total, status }) => {
      const label = ORDER_STATUSES.find((s) => s.value === status)?.title ?? status;
      return {
        title: `${orderNumber} · ${name ?? ""}`,
        subtitle: `${label} · ${city ?? ""} · Rs ${Number(total ?? 0).toLocaleString("en-PK")}`,
      };
    },
  },
});
