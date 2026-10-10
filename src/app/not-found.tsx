import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SiteShell } from "@/components/layout/SiteShell";

// Root-level 404 sits outside the (site) group, so it wraps itself in the shop chrome.

export default function NotFound() {
  return (
    <SiteShell>
    <Container className="flex flex-col items-center py-28 text-center md:py-36">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl md:text-6xl">This page has gone missing</h1>
      <p className="mt-4 max-w-md text-[15px] text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/shop" variant="outline">Shop all</ButtonLink>
      </div>
    </Container>
    </SiteShell>
  );
}
