"use client";

import { useCallback, useEffect, useState } from "react";

import type { Request } from "@/features/requests";

import { fetchPlate, fetchRoomRequests, watchRoom, type Plate } from "./api";

type PlateState =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "ready"; plate: Plate };

export function usePlate(token: string, preview?: Plate) {
  const [state, setState] = useState<PlateState>(() => {
    if (preview) return { status: "ready", plate: preview };
    return token ? { status: "loading" } : { status: "invalid" };
  });

  useEffect(() => {
    if (!token || preview) return;
    let isCurrent = true;
    void fetchPlate(token).then((result) => {
      if (!isCurrent) return;
      setState(
        result.ok
          ? { status: "ready", plate: result.data }
          : { status: "invalid" },
      );
    });
    return () => {
      isCurrent = false;
    };
  }, [token, preview]);

  return state;
}

export function useRoomRequests(
  token: string,
  isReady: boolean,
  isPreview: boolean,
) {
  const [requests, setRequests] = useState<Request[]>([]);

  const reload = useCallback(() => {
    void fetchRoomRequests(token).then((result) => {
      if (result.ok) setRequests(result.data.requests);
    });
  }, [token]);

  useEffect(() => {
    if (!isReady || isPreview) return;
    reload();
    return watchRoom(token, reload);
  }, [token, isReady, isPreview, reload]);

  return { requests, setRequests };
}
