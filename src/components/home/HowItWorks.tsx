import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  { title: "Add to cart", text: "Browse the collection and add the pieces you love." },
  { title: "Place your order", text: "Enter your name, phone number and delivery address. No account or card needed." },
  { title: "We call to confirm", text: "Our team calls you to confirm the items, delivery details and total." },
  { title: "Pay on delivery", text: "Your order is packed with care and you pay cash when it arrives." },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Simple ordering" title="How ordering works" align="center" />
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="relative border-t border-ink pt-6">
              <span className="font-serif text-5xl text-terracotta/80 italic">0{i + 1}</span>
              <h3 className="mt-4 text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
