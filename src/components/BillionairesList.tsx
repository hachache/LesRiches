"use client";

import { useMemo, useState } from "react";
import { Briefcase, MagnifyingGlass, PiggyBank, WarningCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { billionaires } from "@/data/billionaires";
import { BillionaireCard } from "@/components/BillionaireCard";
import { formatCurrencyEUR } from "@/lib/formatters/numbers";
import { parseAmountInput } from "@/lib/formatters/parseAmount";

type SortMode = "desc" | "asc" | "name";
type CompareMode = "salary" | "savings";

const modeOptions = [
  { value: "salary", label: "Salaire net", Icon: Briefcase },
  { value: "savings", label: "Épargne", Icon: PiggyBank },
] as const;

export function BillionairesList() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("desc");
  const [mode, setMode] = useState<CompareMode>("salary");
  const [amountInput, setAmountInput] = useState("2 000");
  const [selectedSlug, setSelectedSlug] = useState("elon-musk");
  const parsed = useMemo(() => parseAmountInput(amountInput), [amountInput]);
  const usableAmount = parsed.amount ?? 0;

  const filtered = useMemo(() => {
    return billionaires
      .filter((person) => person.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (sort === "asc") return a.netWorthEUR - b.netWorthEUR;
        if (sort === "name") return a.name.localeCompare(b.name);
        return b.netWorthEUR - a.netWorthEUR;
      });
  }, [query, sort]);

  return (
    <section className="grid gap-6">
      <div className="grid gap-6 rounded-2xl border border-black/10 bg-[var(--panel)]/90 p-5 shadow-[0_18px_70px_rgba(31,24,18,0.1)] sm:p-7">
        <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-end">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">Rechercher une fortune</span>
            <span className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={19} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full rounded-xl border border-black/20 bg-white pl-10 pr-3 font-semibold outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
                placeholder="Elon Musk, Bernard Arnault..."
              />
            </span>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold">Trier la liste</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              className="h-12 rounded-xl border border-black/20 bg-white px-3 font-semibold outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            >
              <option value="desc">Plus élevée d'abord</option>
              <option value="asc">Plus faible d'abord</option>
              <option value="name">Par nom</option>
            </select>
          </label>
        </div>

        <div className="grid gap-5 rounded-2xl border border-black/8 bg-white/48 p-4 lg:grid-cols-[280px_340px_1fr] lg:items-end lg:p-5">
          <div className="grid gap-2">
            <span className="text-sm font-semibold">Ce que tu compares</span>
            <div className="grid grid-cols-2 rounded-full border border-black/15 bg-white p-1">
              {modeOptions.map(({ value, label, Icon }) => {
                const active = mode === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setMode(value);
                      setAmountInput(value === "salary" ? "2 000" : "10 000");
                    }}
                    className="relative inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    aria-pressed={active}
                  >
                    {active ? (
                      <motion.span
                        layoutId="billionaires-mode"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-[var(--foreground)]"
                      />
                    ) : null}
                    <Icon size={17} weight="bold" className={`relative z-10 ${active ? "text-[var(--panel)]" : "text-[var(--foreground)]"}`} />
                    <span className={`relative z-10 ${active ? "text-[var(--panel)]" : "text-[var(--foreground)]"}`}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">{mode === "salary" ? "Salaire net mensuel" : "Épargne totale"}</span>
            <span className="grid grid-cols-[48px_1fr] overflow-hidden rounded-xl border border-black/20 bg-white">
              <span className="flex items-center justify-center border-r border-black/15 text-xl">€</span>
              <input
                inputMode="decimal"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
                className="h-12 min-w-0 bg-white px-3 text-xl font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </span>
          </label>

          <div className="grid gap-1 text-sm leading-6 text-[var(--muted)]">
            <p>
              {mode === "salary"
                ? `${formatCurrencyEUR(usableAmount)} nets par mois, en supposant que chaque euro est conservé.`
                : `${formatCurrencyEUR(usableAmount)} déjà disponibles, comparés à chaque fortune.`}
            </p>
            {parsed.error ? (
              <p className="flex items-center gap-2 font-medium text-[var(--accent-dark)]">
                <WarningCircle size={16} weight="bold" />
                {parsed.error}
              </p>
            ) : parsed.warning ? <p>{parsed.warning}</p> : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-1">
        <p className="text-sm font-semibold">{filtered.length} fortune{filtered.length > 1 ? "s" : ""}</p>
        <p className="text-xs text-[var(--muted)]">Estimations indicatives à actualiser</p>
      </div>

      <motion.div layout className="grid gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((person) => (
            <BillionaireCard
              key={person.slug}
              billionaire={person}
              amountToCompare={usableAmount}
              compareMode={mode}
              selected={selectedSlug === person.slug}
              onSelect={() => setSelectedSlug(selectedSlug === person.slug ? "" : person.slug)}
            />
          ))}
        </AnimatePresence>
        {!filtered.length ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-black/20 bg-white/48 p-10 text-center">
            <p className="text-lg font-semibold">Aucune fortune ne correspond à cette recherche.</p>
            <button type="button" onClick={() => setQuery("")} className="mt-4 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--panel)]">
              Réinitialiser
            </button>
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}
