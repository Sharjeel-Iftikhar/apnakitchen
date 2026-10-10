"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4">
      {/* Thumbnails */}
      <div className="flex gap-3 md:flex-col" role="tablist" aria-label="Product images">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show image ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-4/5 w-16 overflow-hidden bg-sand transition-opacity md:w-20",
              i === active ? "ring-1 ring-ink ring-offset-2 ring-offset-cream" : "opacity-60 hover:opacity-100",
            )}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative aspect-4/5 flex-1 overflow-hidden bg-sand">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === active ? name : ""}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn("object-cover transition-opacity duration-500", i === active ? "opacity-100" : "opacity-0")}
          />
        ))}
      </div>
    </div>
  );
}
