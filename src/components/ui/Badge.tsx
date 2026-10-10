import { cn } from "@/lib/utils";

type Tone = "default" | "sale" | "muted";

const tones: Record<Tone, string> = {
  default: "bg-cream text-ink",
  sale: "bg-terracotta text-cream",
  muted: "bg-ink/80 text-cream",
};

export function Badge({ children, tone = "default", className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-(--tracking-label)", tones[tone], className)}>
      {children}
    </span>
  );
}
