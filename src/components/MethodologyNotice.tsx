import Link from "next/link";
import { AssumptionBadge } from "@/components/AssumptionBadge";

export function MethodologyNotice() {
  return (
    <aside className="paper-panel rounded-lg p-5">
      <div className="flex flex-wrap gap-2">
        <AssumptionBadge>Données centralisées</AssumptionBadge>
        <AssumptionBadge>Taxes simulées</AssumptionBadge>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        Les calculs comparent des ordres de grandeur. Les scénarios affichés portent sur une variation annuelle estimée
        de fortune, pas sur toute la fortune accumulée. Les références doivent être révisées régulièrement.
      </p>
      <Link href="/methodologie" className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-dark)]">
        Voir la méthodologie
      </Link>
    </aside>
  );
}
