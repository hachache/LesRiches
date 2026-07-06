import { formatLargeNumber } from "@/lib/formatters/numbers";

type ComparisonCardProps = {
  title: string;
  value: number;
  unit: string;
  sentence: string;
  tone?: "accent" | "dark" | "plain";
};

export function ComparisonCard({ title, value, unit, sentence, tone = "plain" }: ComparisonCardProps) {
  const toneClass =
    tone === "accent"
      ? "bg-[var(--accent)] text-white border-[var(--accent-dark)]"
      : tone === "dark"
        ? "ink-panel"
        : "paper-panel text-[var(--foreground)]";

  return (
    <article className={`relative min-h-52 overflow-hidden rounded-none p-5 ${toneClass}`}>
      <span className="absolute right-0 top-0 h-1 w-16 bg-[var(--accent)] opacity-70" />
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-75">{title}</p>
      <div className="mt-5 flex items-end gap-2">
        <strong className="display-type text-5xl font-bold leading-[0.92] md:text-6xl">
          {formatLargeNumber(value)}
        </strong>
        <span className="pb-1 text-sm font-medium opacity-80">{unit}</span>
      </div>
      <p className="mt-5 max-w-[92%] text-sm leading-6 opacity-82">{sentence}</p>
    </article>
  );
}
