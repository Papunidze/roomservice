const percent = new Intl.NumberFormat("ka-GE", { maximumFractionDigits: 1 });

export function formatPercent(value: number) {
  return `${percent.format(value)}%`;
}

export function formatSignedPercent(value: number) {
  return `${value < 0 ? "↓" : "↑"} ${percent.format(Math.abs(value))}%`;
}
