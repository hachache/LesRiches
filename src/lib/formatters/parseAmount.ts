export type ParsedAmount = {
  amount: number | null;
  normalized: string;
  error?: string;
  warning?: string;
};

const multipliers: Array<[RegExp, number, string?]> = [
  [/(?:\d\s*)k\b|\bmille\b/i, 1_000],
  [/(?:\d\s*)m\b|\b(million|millions)\b/i, 1_000_000],
  [/(?:\d\s*)md\b|\b(milliard|milliards)\b/i, 1_000_000_000],
  [/\b(billion|billions)\b/i, 1_000_000_000, "En anglais, billion signifie milliard en francais."],
  [/\b(bn)\b/i, 1_000_000_000, "Notation anglaise interpretee comme milliard."],
];

function normalizeRawNumber(input: string): number {
  const trimmed = input.trim().toLowerCase().replace(/[€\u00a0]/g, " ");
  const numericPart = trimmed.match(/-?\d[\d\s.,_]*/)?.[0] ?? "";
  if (!numericPart) return Number.NaN;

  const compact = numericPart.replace(/[\s_]/g, "");
  const hasComma = compact.includes(",");
  const hasDot = compact.includes(".");

  if (hasComma && hasDot) {
    const decimalSeparator = compact.lastIndexOf(",") > compact.lastIndexOf(".") ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    return Number(compact.replaceAll(thousandsSeparator, "").replace(decimalSeparator, "."));
  }

  if (hasComma) {
    const parts = compact.split(",");
    if (parts.length === 2 && parts[1].length !== 3) {
      return Number(parts[0] + "." + parts[1]);
    }
    return Number(compact.replaceAll(",", ""));
  }

  if (hasDot) {
    const parts = compact.split(".");
    if (parts.length === 2 && parts[1].length !== 3) {
      return Number(parts[0] + "." + parts[1]);
    }
    return Number(compact.replaceAll(".", ""));
  }

  return Number(compact);
}

export function parseAmountInput(input: string): ParsedAmount {
  const normalized = input.trim();
  if (!normalized) {
    return { amount: null, normalized, error: "Entrez une somme positive." };
  }

  const match = multipliers.find(([regex]) => regex.test(normalized));
  const multiplier = match?.[1] ?? 1;
  const value = normalizeRawNumber(normalized);
  const amount = value * multiplier;

  if (!Number.isFinite(amount) || amount <= 0) {
    return { amount: null, normalized, error: "Montant invalide. Exemple : 1 milliard ou 1000000." };
  }

  return {
    amount,
    normalized,
    warning: match?.[2],
  };
}
