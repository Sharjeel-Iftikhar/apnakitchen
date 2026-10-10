"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
};

export function QuantitySelector({ value, onChange, min = 1, max = 20, size = "md" }: Props) {
  const h = size === "sm" ? "h-9" : "h-12";
  const w = size === "sm" ? "w-8" : "w-11";
  return (
    <div className={cn("inline-flex items-center border border-line bg-white", h)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn("flex h-full items-center justify-center text-ink transition-colors hover:bg-sand disabled:opacity-30", w)}
      >
        <Minus className="size-3.5" />
      </button>
      <span className={cn("min-w-8 text-center text-sm tabular-nums", size === "md" && "min-w-10")} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn("flex h-full items-center justify-center text-ink transition-colors hover:bg-sand disabled:opacity-30", w)}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
