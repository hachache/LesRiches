import Link from "next/link";
import { AssumptionBadge } from "@/components/AssumptionBadge";

export function MethodologyNotice() {
  return (
    <aside className="paper-panel rounded-lg p-5">
      <div className="flex flex-wrap gap-2">
        <AssumptionBadge>Données centralisées</AssumptionBadge>
        <AssumptionBadge>Épargne théorique</AssumptionBadge>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
        Les calculs comparent des ordres de grandeur. Une épargne à 100 % est irréaliste, mais utile pour montrer
        le minimum théorique absolu. Les références économiques doivent être révisées régulièrement.
      </p>
      <Link href="/methodologie" className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-dark)]">
        Voir la méthodologie
      </Link>
    </aside>
  );
}
