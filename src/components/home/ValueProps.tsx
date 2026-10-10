import { Banknote, PackageCheck, PhoneCall, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";

const items = [
  { icon: Banknote, title: "Cash on delivery", text: "Pay when your order arrives." },
  { icon: Truck, title: "Nationwide delivery", text: "Delivered to your door across Pakistan." },
  { icon: PackageCheck, title: "Packed with care", text: "Every piece is wrapped to arrive safely." },
  { icon: PhoneCall, title: "Order confirmation call", text: "We call to confirm before dispatch." },
];

export function ValueProps() {
  return (
    <section className="border-y border-line bg-white">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4 lg:py-12">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <Icon className="size-6 shrink-0 text-terracotta" strokeWidth={1.4} />
            <div>
              <h3 className="font-sans text-sm font-semibold tracking-normal">{title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{text}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
