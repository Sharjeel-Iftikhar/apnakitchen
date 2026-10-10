import { getCategories, getFeaturedProducts, getHomepage } from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { ValueProps } from "@/components/home/ValueProps";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { StorySection } from "@/components/home/StorySection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ContactBanner } from "@/components/home/ContactBanner";

export default async function HomePage() {
  const [categories, featured, home] = await Promise.all([getCategories(), getFeaturedProducts(8), getHomepage()]);

  return (
    <>
      <Hero hero={home.hero} />
      <ValueProps />
      <CategoryGrid categories={categories} />
      <StorySection image={home.storyImage} />
      <FeaturedProducts products={featured} />
      <HowItWorks />
      <ContactBanner />
    </>
  );
}
