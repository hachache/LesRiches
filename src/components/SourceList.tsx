import type { EconomicReference } from "@/types/economics";

export function SourceList({ sources }: { sources: EconomicReference[] }) {
  return (
    <div className="paper-panel divide-y divide-black/10 overflow-hidden rounded-lg">
      {sources.map((source) => (
        <div key={source.label} className="grid gap-2 p-4 md:grid-cols-[1fr_1.4fr_auto] md:items-start">
          <strong className="text-sm">{source.label}</strong>
          <p className="text-sm leading-6 text-[var(--muted)]">
            {source.sourceUrl ? (
              <a className="underline decoration-black/20 underline-offset-4" href={source.sourceUrl}>
                {source.source}
              </a>
            ) : (
              source.source
            )}
            {source.note ? <span className="block text-xs">{source.note}</span> : null}
          </p>
          <span className="font-mono text-xs text-[var(--muted)]">{source.lastUpdated}</span>
        </div>
      ))}
    </div>
  );
}
