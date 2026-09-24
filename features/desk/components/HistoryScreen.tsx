"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { useSession } from "@/features/auth";
import {
  CATEGORY_LABEL,
  fetchHistory,
  resolveText,
  useSettings,
  type Request,
} from "@/features/requests";
import { useRooms } from "@/features/rooms";
import { DICTIONARY, scriptFont } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { formatWhen } from "@/shared/lib/time";
import { Button } from "@/shared/ui";

import {
  addInternalNote,
  assignRequest,
  closeRoom,
  sendReply,
  setRequestStatus,
} from "../actions";
import { downloadRequestsCsv } from "../export-csv";
import { ConversationSheet } from "./ConversationSheet";
import { StatusPill } from "./StatusPill";

const GRID =
  "grid min-w-[760px] grid-cols-[70px_80px_1fr_130px_120px_130px] items-center gap-3";

export function HistoryScreen() {
  const settings = useSettings();
  const rooms = useRooms();
  const session = useSession();
  const readingLang = session?.lang ?? settings.staffLang;
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Request[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);
  const [selected, setSelected] = useState<Request | null>(null);
  const isLoading = loadedQuery !== query;

  useEffect(() => {
    let isCurrent = true;
    const timer = setTimeout(() => {
      void fetchHistory({ q: query }).then((result) => {
        if (!isCurrent) return;
        setLoadedQuery(query);
        if (!result.ok) return;
        setRows(result.data.requests);
        setHasMore(result.data.hasMore);
      });
    }, 250);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [query]);

  const loadMore = async () => {
    const last = rows.at(-1);
    if (!last?.createdAt) return;
    const result = await fetchHistory({ q: query, before: last.createdAt });
    if (!result.ok) return;
    setRows([...rows, ...result.data.requests]);
    setHasMore(result.data.hasMore);
  };

  const replace = (next: Request) => {
    setRows((current) =>
      current.map((row) => (row.id === next.id ? next : row)),
    );
    setSelected(next);
  };

  const selectedRoom = rooms.find((room) => room.no === selected?.room);

  return (
    <div className="scrollbar-slim px-4 pt-5 pb-8 md:min-h-0 md:flex-1 md:overflow-y-auto md:px-7 md:pt-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div>
          <div className="text-[22px] font-semibold tracking-[-0.03em]">
            History
          </div>
          <div className="mt-0.5 text-[12.5px] text-faint">
            Every ticket, including archived ones. Newest first.
          </div>
        </div>
        <span className="flex-1" />
        <label className="flex min-h-10 w-full items-center gap-2.5 rounded-full border border-line-strong bg-surface px-4 sm:w-72">
          <Search strokeWidth={1.6} className="size-3.5 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Room, member or words"
            aria-label="Search history"
            spellCheck={false}
            className="w-0 min-w-0 flex-1 bg-transparent text-[13px] outline-none"
          />
        </label>
        <Button
          variant="ghost"
          disabled={rows.length === 0}
          onClick={() => downloadRequestsCsv(rows)}
        >
          Export CSV
        </Button>
      </div>

      <div className="scrollbar-slim overflow-x-auto rounded-tile border border-line bg-surface">
        <div
          className={cn(
            GRID,
            "border-b border-line-soft px-5 py-3 font-mono text-[10px] tracking-[0.12em] text-ghost uppercase",
          )}
        >
          <span>#</span>
          <span>Room</span>
          <span>Request</span>
          <span>Status</span>
          <span>Assignee</span>
          <span>Opened</span>
        </div>
        {rows.map((request) => {
          const first = request.thread[0];
          const summary = first ? resolveText(first, readingLang) : null;
          return (
            <button
              key={request.id}
              type="button"
              onClick={() => setSelected(request)}
              className={cn(
                GRID,
                "min-h-14 w-full cursor-pointer border-b border-line-soft px-5 text-left last:border-b-0 hover:bg-paper/60",
              )}
            >
              <span className="font-mono text-xs text-faint">{request.id}</span>
              <span className="text-[15px] font-semibold tracking-[-0.02em]">
                {request.room}
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-[0.12em] text-ghost uppercase">
                  {CATEGORY_LABEL[request.category]}
                  {request.archived ? " · archived" : ""}
                </span>
                {summary ? (
                  <span
                    dir={DICTIONARY[summary.lang].dir}
                    className={cn(
                      "block truncate text-[13.5px]",
                      scriptFont(summary.lang),
                    )}
                  >
                    {summary.text}
                  </span>
                ) : null}
              </span>
              <StatusPill status={request.status} className="w-fit" />
              <span className="truncate text-[13px] text-muted">
                {request.assignee}
              </span>
              <span className="font-mono text-[11.5px] text-faint">
                {formatWhen(request.createdAt ?? null)}
              </span>
            </button>
          );
        })}
        {!isLoading && rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-[13px] text-faint">
            {query ? "Nothing matches." : "No tickets yet."}
          </p>
        ) : null}
      </div>

      {hasMore ? (
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" onClick={loadMore}>
            Load older tickets
          </Button>
        </div>
      ) : null}

      {selected ? (
        <ConversationSheet
          request={selected}
          session={selectedRoom?.session ?? null}
          guestUrl={selectedRoom?.url ?? null}
          openInRoom={0}
          staffLang={readingLang}
          onClose={() => setSelected(null)}
          onStatusChange={(status) =>
            setRequestStatus(selected, status, replace)
          }
          onAssign={(assignee) => assignRequest(selected, assignee, replace)}
          onSend={(message) => sendReply(selected, message, replace)}
          onAddNote={(text) => addInternalNote(selected, text, replace)}
          onCloseRoom={() => {
            void closeRoom(selected.room);
            setSelected(null);
          }}
        />
      ) : null}
    </div>
  );
}
