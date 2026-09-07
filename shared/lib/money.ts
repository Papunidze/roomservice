const whole = new Intl.NumberFormat("ka-GE", {
  maximumFractionDigits: 0,
  useGrouping: "always",
});

const withTetri = new Intl.NumberFormat("ka-GE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: "always",
});

export function formatGel(tetri: number) {
  const formatter = tetri % 100 === 0 ? whole : withTetri;
  return `${formatter.format(tetri / 100)} ₾`;
}
