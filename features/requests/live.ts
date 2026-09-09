"use client";

import { API_ORIGIN } from "@/shared/lib/api";

export type HotelEvent =
  | { type: "request"; id: number; room: string }
  | { type: "room"; no: string }
  | { type: "settings" }
  | { type: "team" };

type Listener = (event: HotelEvent) => void;

const listeners = new Set<Listener>();
let source: EventSource | null = null;

function open() {
  source = new EventSource(`${API_ORIGIN}/api/requests/events`, {
    withCredentials: true,
  });
  source.onmessage = (message: MessageEvent<string>) => {
    const event = JSON.parse(message.data) as HotelEvent;
    for (const listener of listeners) listener(event);
  };
}

export function watchHotel(type: HotelEvent["type"], refresh: () => void) {
  const listener: Listener = (event) => {
    if (event.type === type) refresh();
  };
  listeners.add(listener);
  if (!source) open();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      source?.close();
      source = null;
    }
  };
}
