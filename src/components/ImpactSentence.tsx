import { formatCurrencyEUR, formatLargeNumber } from "@/lib/formatters/numbers";

type ImpactSentenceProps = {
  amount: number;
  smicYears: number;
  foodAidMeals: number;
  schoolsBuilt: number;
};

export function ImpactSentence({ amount, smicYears, foodAidMeals, schoolsBuilt }: ImpactSentenceProps) {
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
          À cette échelle, on ne lit plus un prix : on lit du temps de travail et des équivalents concrets.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="border-l-4 border-[var(--accent)] bg-white/70 p-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
            Revenu minimum
          </span>
          <strong className="display-type mt-2 block text-5xl font-bold leading-none text-[var(--accent)]">
            {formatLargeNumber(smicYears)}
          </strong>
          <p className="mt-1 text-sm text-[var(--muted)]">années de revenu</p>
        </div>
        <div className="border-l-4 border-black bg-white/70 p-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Repas</span>
          <strong className="display-type mt-2 block text-5xl font-bold leading-none">
            {formatLargeNumber(foodAidMeals)}
          </strong>
          <p className="mt-1 text-sm text-[var(--muted)]">repas solidaires théoriques</p>
        </div>
        <div className="border-l-4 border-black bg-white/70 p-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Écoles</span>
          <strong className="display-type mt-2 block text-5xl font-bold leading-none">
            {formatLargeNumber(schoolsBuilt)}
          </strong>
          <p className="mt-1 text-sm text-[var(--muted)]">constructions théoriques</p>
        </div>
      </div>
    </div>
  );
}
