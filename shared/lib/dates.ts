export const TBILISI = "Asia/Tbilisi";

const longDate = new Intl.DateTimeFormat("ka-GE", {
  timeZone: TBILISI,
  weekday: "long",
  day: "numeric",
  month: "long",
});

const time = new Intl.DateTimeFormat("ka-GE", {
  timeZone: TBILISI,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatLongDate(date: Date) {
  return longDate.format(date);
}

export function formatTime(date: Date) {
  return time.format(date);
}
