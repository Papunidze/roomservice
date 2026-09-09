"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  CATEGORY_ICON,
  CATEGORY_LABEL,
  resolveText,
  useRequests,
  useSettings,
} from "@/features/requests";
import { DICTIONARY, scriptFont } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { formatAgo } from "@/shared/lib/time";

export function NotificationsMenu() {
  const requests = useRequests();
  const settings = useSettings();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const unanswered = requests.filter(
    (request) => !request.archived && request.status === "new",
  );

  const open = (id: number) => {
    setIsOpen(false);
    router.push(`/desk?open=${id}`);
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`${unanswered.length} unanswered requests`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative grid size-9.5 cursor-pointer place-items-center rounded-full border border-line-strong",
          isOpen ? "bg-paper text-ink" : "text-ink",
        )}
      >
        <Bell strokeWidth={1.5} className="size-[15px]" />
        {unanswered.length > 0 ? (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-urgent px-1 text-[11px] font-bold text-paper">
            {unanswered.length}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="animate-rise absolute top-12 right-0 z-50 w-95 rounded-tile border border-line-strong bg-surface p-2">
            <div className="flex items-center justify-between px-3 pt-2 pb-2.5">
              <span className="text-sm font-semibold">Unanswered</span>
              <span className="text-[12px] text-faint">
                {unanswered.length === 0
                  ? "all caught up"
                  : `${unanswered.length} waiting`}
              </span>
            </div>

            {unanswered.length === 0 ? (
              <p className="px-3 pb-3 text-[13px] text-faint">
                Every request has a reply. New ones appear here.
              </p>
            ) : (
              <div className="scrollbar-slim max-h-105 overflow-y-auto">
                {unanswered.map((request) => {
                  const Icon = CATEGORY_ICON[request.category];
                  const first = request.thread[0];
                  const summary = first
                    ? resolveText(first, settings.staffLang)
                    : null;
                  return (
                    <button
                      key={request.id}
                      type="button"
                      onClick={() => open(request.id)}
                      className="flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-paper"
                    >
                      <span className="mt-0.5 size-2 shrink-0 rounded-full bg-urgent" />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-[13px]">
                          <span className="font-semibold">
                            Room {request.room}
                          </span>
                          <Icon
                            strokeWidth={1.6}
                            className="size-3.5 text-sage"
                          />
                          <span className="text-muted">
                            {CATEGORY_LABEL[request.category]}
                          </span>
                          <span className="ml-auto shrink-0 text-[11.5px] text-faint">
                            {formatAgo(request.minutesAgo)}
                          </span>
                        </span>
                        {summary ? (
                          <span
                            dir={DICTIONARY[summary.lang].dir}
                            className={cn(
                              "mt-0.5 line-clamp-1 text-[12.5px] text-soft",
                              scriptFont(summary.lang),
                            )}
                          >
                            {summary.text}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
