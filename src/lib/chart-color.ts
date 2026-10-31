const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
] as const;

/** The same label keeps the same palette color in every chart. */
export function seriesColor(label: string) {
  let hash = 0;
  for (let index = 0; index < label.length; index += 1) {
    hash = (Math.imul(hash, 31) + label.charCodeAt(index)) >>> 0;
  }
  return CHART_COLORS[hash % CHART_COLORS.length] ?? CHART_COLORS[0];
}
