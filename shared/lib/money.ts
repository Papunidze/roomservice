const gelFormatter = new Intl.NumberFormat("ka-GE", {
  maximumFractionDigits: 0,
  useGrouping: "always",
});

export function formatGel(tetri: number) {
  return `${gelFormatter.format(Math.round(tetri / 100))} ₾`;
}
