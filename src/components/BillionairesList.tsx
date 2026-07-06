"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { economicReferences } from "@/data/economicReferences";
import { billionaires } from "@/data/billionaires";
import { BillionaireCard } from "@/components/BillionaireCard";
import { formatCurrencyEUR } from "@/lib/formatters/numbers";

type SortMode = "desc" | "asc" | "name";

export function BillionairesList() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("desc");
  const [monthlySalary, setMonthlySalary] = useState(String(economicReferences.classicNetMonthlyIncome.value));
  const [savingsTotal, setSavingsTotal] = useState("10000");
  const parsedSalary = Number(monthlySalary.replace(/\s/g, "").replace(",", "."));
  const parsedSavings = Number(savingsTotal.replace(/\s/g, "").replace(",", "."));
  const usableSalary = Number.isFinite(parsedSalary) && parsedSalary > 0 ? parsedSalary : economicReferences.classicNetMonthlyIncome.value;
  const usableSavings = Number.isFinite(parsedSavings) && parsedSavings > 0 ? parsedSavings : 0;

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
      <div className="paper-panel grid gap-5 rounded-none border-black/40 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="relative">
          <span className="sr-only">Rechercher</span>
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={19} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-12 w-full rounded-none border border-black/25 bg-white pl-10 pr-3 font-semibold"
            placeholder="Rechercher un nom"
          />
        </label>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortMode)}
          className="h-12 rounded-none border border-black/25 bg-white px-3 font-semibold"
        >
          <option value="desc">Fortune décroissante</option>
          <option value="asc">Fortune croissante</option>
          <option value="name">Nom</option>
        </select>
        </div>
        <div className="grid gap-3 border-t border-black/10 pt-4 md:grid-cols-[240px_240px_1fr] md:items-end">
          <label className="grid gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em]">Ton salaire net mensuel</span>
            <div className="grid grid-cols-[48px_1fr] border border-black/25 bg-white">
              <span className="flex items-center justify-center border-r border-black/15 text-xl">€</span>
              <input
                inputMode="decimal"
                value={monthlySalary}
                onChange={(event) => setMonthlySalary(event.target.value)}
                className="h-12 bg-white px-3 text-xl font-bold"
              />
            </div>
          </label>
          <label className="grid gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.12em]">Ton épargne totale</span>
            <div className="grid grid-cols-[48px_1fr] border border-black/25 bg-white">
              <span className="flex items-center justify-center border-r border-black/15 text-xl">€</span>
              <input
                inputMode="decimal"
                value={savingsTotal}
                onChange={(event) => setSavingsTotal(event.target.value)}
                className="h-12 bg-white px-3 text-xl font-bold"
              />
            </div>
          </label>
          <p className="text-sm leading-6 text-[var(--muted)]">
            Les cartes comparent chaque fortune à {formatCurrencyEUR(usableSalary)} net par mois et à{" "}
            {formatCurrencyEUR(usableSavings)} d'épargne. C'est un repère d'échelle, pas un jugement politique.
          </p>
        </div>
      </div>
      <div className="grid gap-4">
        {filtered.map((person) => (
          <BillionaireCard
            key={person.name}
            billionaire={person}
            monthlySalary={usableSalary}
            savingsTotal={usableSavings}
          />
        ))}
      </div>
    </section>
  );
}
