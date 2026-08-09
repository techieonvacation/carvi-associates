const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const plain = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

export function currency(value: number) {
  if (!Number.isFinite(value)) return "—";
  return inr.format(Math.round(value));
}

export function currencyExact(value: number) {
  if (!Number.isFinite(value)) return "—";
  return inrPrecise.format(value);
}

export function number(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: digits }).format(value);
}

export function percent(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "—";
  return `${plain.format(Number(value.toFixed(digits)))}%`;
}

export function toNumber(value: string | number | undefined, fallback = 0) {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (!value) return fallback;
  const parsed = Number.parseFloat(String(value).replace(/[, ]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function lakhCrore(value: number) {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) return `${plain.format(value / 1_00_00_000)} Cr`;
  if (abs >= 1_00_000) return `${plain.format(value / 1_00_000)} L`;
  return plain.format(value);
}
