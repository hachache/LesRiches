const frenchNumber = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

const unitNumber = new Intl.NumberFormat("fr-FR", {
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
  if (clean >= 1_000_000_000) {
    const billions = clean / 1_000_000_000;
    const unit = billions >= 2 ? "milliards" : "milliard";
    return `${normalizeSpaces(unitNumber.format(billions))} ${unit}`;
  }
  if (clean >= 1_000_000) {
    const millions = clean / 1_000_000;
    const unit = millions >= 2 ? "millions" : "million";
    return `${normalizeSpaces(unitNumber.format(millions))} ${unit}`;
  }
  return normalizeSpaces(frenchNumber.format(Math.round(clean)));
}

export function formatDecimal(value: number, maximumFractionDigits = 1): string {
  const clean = cleanNumber(value);
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits,
  }).format(clean).replace(/[\u00a0\u202f]/g, " ");
}

export function formatTinyPercentage(value: number): string {
  const clean = cleanNumber(value);
  if (clean === 0) return "0 %";
  const digits = clean < 0.0001 ? 8 : clean < 0.01 ? 6 : clean < 1 ? 4 : 2;

  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: Math.min(2, digits),
  })
    .format(clean)
    .replace(/[\u00a0\u202f]/g, " ")} %`;
}

export function formatRatio(value: number): string {
  const clean = cleanNumber(value);
  if (!clean) return "1 / impossible";
  return `1 / ${formatLargeNumber(clean)}`;
}

export function formatMultiplier(value: number): string {
  const clean = cleanNumber(value);
  if (!clean) return "0 fois";
  return `${formatLargeNumber(clean)} fois`;
}

export function formatDurationYears(value: number): string {
  const clean = cleanNumber(value);
  if (clean === 0) return "0 an";
  if (clean < 1) {
    return `${Math.max(1, Math.round(clean * 12))} mois`;
  }
  return `${formatDecimal(clean, clean >= 100 ? 0 : 1)} ans`;
}

export function formatPhysicalDistance(valueInMeters: number): string {
  const clean = cleanNumber(valueInMeters);
  if (!clean) return "0 m";
  if (clean >= 1_000_000_000) return `${formatDecimal(clean / 1_000_000_000, 1)} million${clean >= 2_000_000_000 ? "s" : ""} de km`;
  if (clean >= 1_000) return `${formatDecimal(clean / 1_000, clean >= 100_000 ? 0 : 1)} km`;
  if (clean >= 1) return `${formatDecimal(clean, clean >= 100 ? 0 : 1)} m`;
  return `${formatDecimal(clean * 100, 1)} cm`;
}

export function formatStartYear(year: number): string {
  if (!Number.isFinite(year)) return "date impossible à calculer";
  if (year <= 0) {
    return `environ ${normalizeSpaces(frenchNumber.format(Math.abs(Math.round(year))))} ans avant notre ère`;
  }
  return `vers ${Math.round(year)}`;
}
