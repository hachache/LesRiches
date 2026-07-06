export function AssumptionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/15 bg-white/55 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
      {children}
    </span>
  );
}
