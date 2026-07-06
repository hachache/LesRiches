import { formatCurrencyEUR, formatLargeNumber } from "@/lib/formatters/numbers";

type ImpactSentenceProps = {
  amount: number;
  smicYears: number;
  workingLives: number;
  wealthMultiplier: number;
};

export function ImpactSentence({ amount, smicYears, workingLives, wealthMultiplier }: ImpactSentenceProps) {
  return (
    <div className="grid gap-6">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-dark)]">
          Résultat principal
        </p>
        <h2 className="display-type mt-3 text-5xl font-bold uppercase leading-[0.92] md:text-7xl">
          {formatCurrencyEUR(amount)}
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-[var(--muted)]">
          À cette échelle, on ne lit plus un prix : on lit du temps de travail, des carrières et du patrimoine.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="border-l-4 border-[var(--accent)] bg-white/70 p-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">SMIC net</span>
          <strong className="display-type mt-2 block text-5xl font-bold leading-none text-[var(--accent)]">
            {formatLargeNumber(smicYears)}
          </strong>
          <p className="mt-1 text-sm text-[var(--muted)]">années de revenu</p>
        </div>
        <div className="border-l-4 border-black bg-white/70 p-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Travail</span>
          <strong className="display-type mt-2 block text-5xl font-bold leading-none">
            {formatLargeNumber(workingLives)}
          </strong>
          <p className="mt-1 text-sm text-[var(--muted)]">carrières complètes moyennes</p>
        </div>
        <div className="border-l-4 border-black bg-white/70 p-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Patrimoine</span>
          <strong className="display-type mt-2 block text-5xl font-bold leading-none">
            {formatLargeNumber(wealthMultiplier)}
          </strong>
          <p className="mt-1 text-sm text-[var(--muted)]">patrimoines médians nets</p>
        </div>
      </div>
    </div>
  );
}
