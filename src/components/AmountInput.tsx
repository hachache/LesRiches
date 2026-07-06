"use client";

import { WarningCircle } from "@phosphor-icons/react";

type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  warning?: string;
};

export function AmountInput({ value, onChange, label = "Somme en euros", error, warning }: AmountInputProps) {
  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor="amount" className="font-mono text-xs font-bold uppercase tracking-[0.12em]">
        {label}
      </label>
      <div className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] border border-black/70 bg-white sm:grid-cols-[70px_minmax(0,1fr)]">
        <div className="flex items-center justify-center border-r border-black/30 text-3xl">€</div>
        <input
          id="amount"
          inputMode="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-16 min-w-0 w-full bg-white px-4 text-2xl tracking-[-0.03em] shadow-inner shadow-black/5 transition focus:border-[var(--accent)] sm:text-3xl"
          placeholder="1 milliard"
        />
      </div>
      {error ? (
        <p className="flex items-center gap-2 text-sm font-medium text-[var(--accent-dark)]">
          <WarningCircle size={18} weight="bold" />
          {error}
        </p>
      ) : warning ? (
        <p className="text-sm text-[var(--muted)]">{warning}</p>
      ) : (
        <p className="text-sm leading-6 text-[var(--muted)]">
          Formats : 1000000, 1m, 1 milliard.
        </p>
      )}
    </div>
  );
}
