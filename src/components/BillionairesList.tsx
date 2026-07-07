"use client";

import { useMemo, useState } from "react";
import { Briefcase, MagnifyingGlass, PiggyBank, WarningCircle } from "@phosphor-icons/react";
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
    <section className="grid gap-5">
      <div className="paper-panel grid gap-5 rounded-none border-black/30 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative">
            <span className="sr-only">Rechercher</span>
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 w-full rounded-none border border-black/25 bg-white pl-10 pr-3 font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="Rechercher un nom"
            />
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className="h-12 rounded-none border border-black/25 bg-white px-3 font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="desc">Fortune décroissante</option>
            <option value="asc">Fortune croissante</option>
            <option value="name">Nom</option>
          </select>
        </div>
        <div className="grid gap-4 border-t border-black/10 pt-4 lg:grid-cols-[300px_360px_1fr] lg:items-end">
          <div className="grid gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em]">Mode de comparaison</span>
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
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-bold transition ${
                      active ? "bg-[var(--ink)] text-white" : "text-[var(--ink)] hover:bg-black/5"
                    }`}
                    aria-pressed={active}
                  >
                    <Icon size={17} weight="bold" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="grid gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em]">
              {mode === "salary" ? "Salaire net mensuel" : "Épargne à comparer"}
            </span>
            <div className="grid grid-cols-[48px_1fr] border border-black/25 bg-white">
              <span className="flex items-center justify-center border-r border-black/15 text-xl">€</span>
              <input
                inputMode="decimal"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
                className="h-12 bg-white px-3 text-xl font-semibold outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
          </label>
          <div className="grid gap-1 text-sm leading-6 text-[var(--muted)]">
            <p>
              {mode === "salary"
                ? `Les cartes indiquent le temps théorique nécessaire avec ${formatCurrencyEUR(usableAmount)} nets par mois, sans dépense.`
                : `Les cartes comparent chaque fortune à ${formatCurrencyEUR(usableAmount)} d'épargne.`}{" "}
              C'est un repère d'échelle, pas un jugement politique.
            </p>
            {parsed.error ? (
              <p className="flex items-center gap-2 font-medium text-[var(--accent-dark)]">
                <WarningCircle size={16} weight="bold" />
                {parsed.error}
              </p>
            ) : parsed.warning ? (
              <p>{parsed.warning}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        {filtered.map((person) => (
          <BillionaireCard
            key={person.name}
            billionaire={person}
            amountToCompare={usableAmount}
            compareMode={mode}
            selected={selectedSlug === person.slug}
            onSelect={() => setSelectedSlug(selectedSlug === person.slug ? "" : person.slug)}
          />
        ))}
      </div>
    </section>
  );
}
