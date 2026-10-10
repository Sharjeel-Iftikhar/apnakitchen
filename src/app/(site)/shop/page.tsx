import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/api";
import type { SortOption } from "@/types";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductToolbar } from "@/components/product/ProductToolbar";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Browse our full collection of dinner sets, plates, bowls, mugs and serveware.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ sort?: SortOption }> }) {
  const { sort } = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts({ sort })]);

  return (
    <>
      <PageHeader
        title="Shop all"
        description="Our full collection — everyday pieces and special-occasion sets, all with cash on delivery."
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
      <Container className="py-10 md:py-14">
        <Suspense>
          <ProductToolbar categories={categories} count={products.length} />
        </Suspense>
        <ProductGrid products={products} />
      </Container>
    </>
  );
}
