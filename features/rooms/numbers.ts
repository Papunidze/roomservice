import type { Room } from "./types";

export function nextRoomNumbers(from: number, to: number, existing: Room[]) {
  const taken = new Set(existing.map((room) => room.no));
  const added: string[] = [];
  for (let number = from; number <= to; number += 1) {
    const no = String(number);
    if (!taken.has(no)) added.push(no);
  }
  return added;
}
