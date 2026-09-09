const DAY_MS = 24 * 60 * 60 * 1000;

const time = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});
const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
const date = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  day: "numeric",
});

export function formatWhen(iso: string | null, now = new Date()) {
  if (!iso) return "never";
  const at = new Date(iso);
  const age = now.getTime() - at.getTime();

  if (at.toDateString() === now.toDateString()) return time.format(at);
  if (age < 6 * DAY_MS) return `${weekday.format(at)} ${time.format(at)}`;
  return date.format(at);
}

export function formatAgo(minutes: number) {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 24 * 60) return `${Math.round(minutes / 60)} h ago`;
  return `${Math.round(minutes / (24 * 60))} d ago`;
}
