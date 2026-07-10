import Link from "next/link";
import { AssumptionBadge } from "@/components/AssumptionBadge";

export function MethodologyNotice() {
  return (
    <aside className="paper-panel rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        <AssumptionBadge>Données centralisées</AssumptionBadge>
        <AssumptionBadge>Scénarios explicites</AssumptionBadge>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        Les calculs montrent des ordres de grandeur. Les scénarios portent sur une variation annuelle estimée, jamais sur
        toute la fortune. Les références doivent être actualisées régulièrement.
      </p>
      <Link href="/methodologie" className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-dark)]">
        Comprendre les calculs
      </Link>
    </aside>
  );
}
