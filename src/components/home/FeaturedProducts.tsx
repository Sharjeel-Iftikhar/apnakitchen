import type { Product } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Bestsellers"
          title="Loved at our tables"
          description="The pieces customers come back for — durable, beautiful and made for daily use."
          link={{ href: "/shop", label: "Shop all" }}
        />
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}
