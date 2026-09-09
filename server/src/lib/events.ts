import { EventEmitter } from "node:events";

import type { Response } from "express";

export type HotelEvent =
  | { type: "request"; id: number; room: string }
  | { type: "room"; no: string }
  | { type: "settings" }
  | { type: "team" };

const bus = new EventEmitter();
bus.setMaxListeners(0);

const channel = (hotelId: string) => `hotel:${hotelId}`;

export function publish(hotelId: string, event: HotelEvent) {
  bus.emit(channel(hotelId), event);
}

export function streamEvents(
  res: Response,
  hotelId: string,
  filter: (event: HotelEvent) => boolean = () => true,
) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("retry: 3000\n\n");

  const send = (event: HotelEvent) => {
    if (filter(event)) res.write(`data: ${JSON.stringify(event)}\n\n`);
  };
  const heartbeat = setInterval(() => res.write(": ping\n\n"), 25_000);

  bus.on(channel(hotelId), send);
  res.on("close", () => {
    clearInterval(heartbeat);
    bus.off(channel(hotelId), send);
  });
}
