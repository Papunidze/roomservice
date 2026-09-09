"use client";

import { useEffect, useRef } from "react";

const FLASH_MS = 900;
const GIVE_UP_MS = 2 * 60 * 1000;

export function useTitleAlert(unanswered: number) {
  const previous = useRef(unanswered);

  useEffect(() => {
    const hasNew = unanswered > previous.current;
    previous.current = unanswered;
    if (!hasNew) return;

    const original = document.title;
    let isOn = false;
    const flash = setInterval(() => {
      isOn = !isOn;
      document.title = isOn
        ? `\u{1F534} ${unanswered} unanswered · RoomCall`
        : original;
    }, FLASH_MS);

    const stop = () => {
      clearInterval(flash);
      clearTimeout(giveUp);
      document.title = original;
      for (const [target, event] of listeners)
        target.removeEventListener(event, stop);
    };
    const giveUp = setTimeout(stop, GIVE_UP_MS);
    const listeners: [EventTarget, string][] = [
      [window, "focus"],
      [window, "click"],
      [window, "keydown"],
      [document, "visibilitychange"],
    ];
    for (const [target, event] of listeners)
      target.addEventListener(event, stop);

    return stop;
  }, [unanswered]);
}
