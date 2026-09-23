export { PANEL_CARD } from "./PanelHeading";

export const TIME =
  "min-h-9.5 w-20 rounded-[10px] border border-line-strong bg-surface px-2.5 text-center font-mono text-sm outline-none";

export const MONEY =
  "min-h-9.5 w-24 rounded-[10px] border border-line-strong bg-surface px-2.5 text-right font-mono text-sm outline-none";

export const ICON_BUTTON =
  "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-faint hover:border-urgent/50 hover:text-urgent";

export const toTetri = (gel: string) =>
  Math.round(Number(gel.replace(",", ".")) * 100) || 0;

export const toGel = (tetri: number) =>
  (tetri / 100).toFixed(tetri % 100 === 0 ? 0 : 2);
