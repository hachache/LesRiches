const frenchNumber = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

const compactNumber = new Intl.NumberFormat("fr-FR", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

function normalizeSpaces(value: string): string {
  return value.replace(/[\u00a0\u202f]/g, " ");
}

export function cleanNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

export function formatCurrencyEUR(value: number): string {
  const clean = cleanNumber(value);
  return `${normalizeSpaces(frenchNumber.format(Math.round(clean)))} €`;
}

export function formatLargeNumber(value: number): string {
  const clean = cleanNumber(value);
  if (clean >= 1_000_000) {
    return normalizeSpaces(compactNumber.format(clean));
  }
  return normalizeSpaces(frenchNumber.format(Math.round(clean)));
}

export function formatDecimal(value: number, maximumFractionDigits = 1): string {
  const clean = cleanNumber(value);
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits,
  }).format(clean).replace(/[\u00a0\u202f]/g, " ");
}

export function formatDurationYears(value: number): string {
  const clean = cleanNumber(value);
  if (clean === 0) return "0 an";
  if (clean < 1) {
    return `${Math.max(1, Math.round(clean * 12))} mois`;
  }
  return `${formatDecimal(clean, clean >= 100 ? 0 : 1)} ans`;
}

export function formatStartYear(year: number): string {
  if (!Number.isFinite(year)) return "date impossible a calculer";
  if (year <= 0) {
    return `environ ${normalizeSpaces(frenchNumber.format(Math.abs(Math.round(year))))} ans avant notre ère`;
  }
  return `vers ${Math.round(year)}`;
}
