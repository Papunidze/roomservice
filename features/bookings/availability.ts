export interface TimeRange {
  start: Date;
  end: Date;
}

export interface SlotQuery {
  window: TimeRange;
  durationMinutes: number;
  stepMinutes: number;
  busy: TimeRange[];
}

const MINUTE_MS = 60_000;

export function overlaps(a: TimeRange, b: TimeRange): boolean {
  return a.start < b.end && b.start < a.end;
}

export function generateSlots(query: SlotQuery): TimeRange[] {
  const { window, durationMinutes, stepMinutes, busy } = query;
  const durationMs = durationMinutes * MINUTE_MS;
  const stepMs = stepMinutes * MINUTE_MS;
  const lastStart = window.end.getTime() - durationMs;
  const slots: TimeRange[] = [];

  for (let t = window.start.getTime(); t <= lastStart; t += stepMs) {
    const slot = { start: new Date(t), end: new Date(t + durationMs) };
    if (!busy.some((taken) => overlaps(slot, taken))) {
      slots.push(slot);
    }
  }

  return slots;
}
