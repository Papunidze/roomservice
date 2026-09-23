"use client";

import { useEffect, useRef } from "react";

import type { NotificationSettings, Request } from "@/features/requests";

const FLASH_MS = 900;
const GIVE_UP_MS = 2 * 60 * 1000;

function chime() {
  const Context = window.AudioContext;
  if (!Context) return;
  const context = new Context();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.7);
  gain.connect(context.destination);
  for (const [frequency, at] of [
    [880, 0],
    [1174, 0.18],
  ] as const) {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start(context.currentTime + at);
    oscillator.stop(context.currentTime + 0.75);
  }
  setTimeout(() => void context.close(), 1000);
}

function notify(request: Request, onOpen: (id: number) => void) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted" || !document.hidden) return;
  const notification = new Notification(`Room ${request.room} · RoomCall`, {
    body: request.thread[0]?.translations.en ?? request.thread[0]?.text ?? "",
    tag: `request-${request.id}`,
  });
  notification.onclick = () => {
    window.focus();
    onOpen(request.id);
  };
}

function flashTitle(count: number) {
  const original = document.title;
  let isOn = false;
  const flash = setInterval(() => {
    isOn = !isOn;
    document.title = isOn
      ? `\u{1F534} ${count} unanswered · RoomCall`
      : original;
  }, FLASH_MS);
  const listeners: [EventTarget, string][] = [
    [window, "focus"],
    [window, "click"],
    [window, "keydown"],
    [document, "visibilitychange"],
  ];
  const stop = () => {
    clearInterval(flash);
    clearTimeout(giveUp);
    document.title = original;
    for (const [target, event] of listeners)
      target.removeEventListener(event, stop);
  };
  const giveUp = setTimeout(stop, GIVE_UP_MS);
  for (const [target, event] of listeners) target.addEventListener(event, stop);
  return stop;
}

export function useTicketAlerts(
  unanswered: Request[],
  settings: NotificationSettings,
  onOpen: (id: number) => void,
) {
  const seen = useRef<Set<number> | null>(null);
  const count = unanswered.length;

  useEffect(() => {
    if (seen.current === null) {
      seen.current = new Set(unanswered.map((request) => request.id));
      return;
    }
    const fresh = unanswered.filter(
      (request) => !seen.current?.has(request.id),
    );
    seen.current = new Set(unanswered.map((request) => request.id));
    if (fresh.length === 0) return;

    if (settings.sound) chime();
    for (const request of fresh) notify(request, onOpen);
    return flashTitle(count);
  }, [unanswered, count, settings.sound, onOpen]);

  useEffect(() => {
    if (!settings.sound || count === 0) return;
    const timer = setInterval(chime, settings.renotifyMinutes * 60_000);
    return () => clearInterval(timer);
  }, [count, settings.sound, settings.renotifyMinutes]);
}

export function requestNotificationPermission() {
  if (typeof Notification === "undefined") return Promise.resolve("denied");
  return Notification.requestPermission();
}
