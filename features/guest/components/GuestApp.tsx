"use client";

import { useCallback, useState } from "react";

import {
  guestLanguage,
  type CheckoutOption,
  type Dish,
  type GuestLanguage,
  type ProblemKey,
  type Request,
} from "@/features/requests";
import { DICTIONARY, scriptFont, type LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";
import { showToast } from "@/shared/ui";

import {
  createGuestRequest,
  openGuestSession,
  plateSettings,
  sendGuestMessage,
  type Plate,
} from "../api";
import {
  checkoutRequest,
  itemsRequest,
  problemRequest,
  serviceRequest,
  type ItemPick,
} from "../build-request";
import type { GuestScreen } from "../screens";
import { usePlate, useRoomRequests } from "../use-plate";
import { HomeScreen } from "./HomeScreen";
import { HotelInfoScreen } from "./HotelInfoScreen";
import { ItemsScreen } from "./ItemsScreen";
import { LanguageScreen } from "./LanguageScreen";
import { LanguageSheet } from "./LanguageSheet";
import { LateCheckoutScreen } from "./LateCheckoutScreen";
import { PlateMissing } from "./PlateMissing";
import { PrimaryAction } from "./PrimaryAction";
import { ProblemScreen } from "./ProblemScreen";
import { RoomServiceScreen } from "./RoomServiceScreen";
import { SuccessScreen } from "./SuccessScreen";
import { TrackScreen } from "./TrackScreen";

interface GuestAppProps {
  token: string;
  preview?: Plate;
}

let previewSeq = 0;

export function GuestApp({ token, preview }: GuestAppProps) {
  const isPreview = preview !== undefined;
  const plateState = usePlate(token, preview);
  const { requests, setRequests } = useRoomRequests(
    token,
    plateState.status === "ready",
    isPreview,
  );
  const [language, setLanguage] = useState<GuestLanguage | null>(null);
  const [screen, setScreen] = useState<GuestScreen>("language");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  const active = requests.find((request) => request.id === activeId);
  const showTracking = useCallback(() => setScreen("track"), []);

  if (plateState.status === "loading")
    return <GuestFrame language={null} isEmbedded={isPreview} />;
  if (plateState.status === "invalid") {
    return (
      <GuestFrame language={null} isEmbedded={isPreview}>
        <PlateMissing />
      </GuestFrame>
    );
  }

  const { plate } = plateState;
  const room = plate.room;
  const settings = plateSettings(plate);

  const pickLanguage = (next: GuestLanguage) => {
    setLanguage(next);
    setSheetOpen(false);
    if (screen === "language") setScreen("home");
    if (!isPreview && plate.session?.lang !== next.base)
      void openGuestSession(token, next.base);
  };

  if (!language) {
    return (
      <GuestFrame language={null} isEmbedded={isPreview}>
        <LanguageScreen
          room={room}
          settings={settings}
          onPick={(code) => pickLanguage(guestLanguage(code))}
        />
      </GuestFrame>
    );
  }

  const phrases = DICTIONARY[language.base];

  const upsert = (request: Request) =>
    setRequests((current) => [
      request,
      ...current.filter((item) => item.id !== request.id),
    ]);

  const submit = async (draft: Omit<Request, "id">) => {
    if (isPreview) {
      previewSeq += 1;
      upsert({ ...draft, id: previewSeq });
      setActiveId(previewSeq);
      setScreen("success");
      return;
    }
    const result = await createGuestRequest(token, draft);
    if (!result.ok) {
      showToast(result.message);
      return;
    }
    upsert(result.data.request);
    setActiveId(result.data.request.id);
    setScreen("success");
  };

  const reply = async (request: Request, text: string) => {
    if (isPreview) {
      upsert({
        ...request,
        thread: [
          ...request.thread,
          {
            from: "guest",
            lang: language.base,
            text,
            translations: {},
            minutesAgo: 0,
          },
        ],
      });
      return;
    }
    const result = await sendGuestMessage(token, request.id, {
      text,
      lang: language.base,
    });
    if (result.ok) upsert(result.data.request);
  };

  const base = { room, language };
  const goHome = () => setScreen("home");

  return (
    <GuestFrame language={language} isEmbedded={isPreview}>
      {screen === "home" ? (
        <HomeScreen
          room={room}
          phrases={phrases}
          languageLabel={language.native}
          active={active}
          onOpenLanguage={() => setSheetOpen(true)}
          onNavigate={setScreen}
        />
      ) : null}

      {screen === "problem" ? (
        <ProblemScreen
          phrases={phrases}
          settings={settings}
          onBack={goHome}
          onSubmit={(input: {
            keys: ProblemKey[];
            note: string;
            photo: boolean;
          }) => submit(problemRequest(base, input))}
        />
      ) : null}

      {screen === "items" ? (
        <ItemsScreen
          phrases={phrases}
          lang={language.base}
          settings={settings}
          onBack={goHome}
          onSubmit={(picks: ItemPick[]) => submit(itemsRequest(base, picks))}
        />
      ) : null}

      {screen === "service" ? (
        <RoomServiceScreen
          phrases={phrases}
          onBack={goHome}
          onSubmit={(dish: Dish) => submit(serviceRequest(base, dish))}
        />
      ) : null}

      {screen === "checkout" ? (
        <LateCheckoutScreen
          phrases={phrases}
          onBack={goHome}
          onSubmit={(option: CheckoutOption) =>
            submit(checkoutRequest(base, option))
          }
        />
      ) : null}

      {screen === "info" ? (
        <HotelInfoScreen
          phrases={phrases}
          settings={settings}
          onBack={goHome}
        />
      ) : null}

      {screen === "success" ? (
        <SuccessScreen phrases={phrases} onDone={showTracking} />
      ) : null}

      {screen === "track" ? (
        active ? (
          <TrackScreen
            phrases={phrases}
            lang={language.base}
            request={active}
            onBack={goHome}
            onReply={(text) => void reply(active, text)}
          />
        ) : (
          <div className="px-5.5 pt-20 text-center">
            <p className="text-[15px] text-muted">{phrases.waiting}</p>
            <PrimaryAction label={phrases.menuShort} enabled onClick={goHome} />
          </div>
        )
      ) : null}

      {sheetOpen ? (
        <LanguageSheet
          title={phrases.chooseLang}
          current={language.base}
          onPick={(code: LangCode) => pickLanguage(guestLanguage(code))}
          onClose={() => setSheetOpen(false)}
        />
      ) : null}
    </GuestFrame>
  );
}

function GuestFrame({
  language,
  isEmbedded,
  children,
}: {
  language: GuestLanguage | null;
  isEmbedded: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("bg-canvas", isEmbedded ? "min-h-full" : "min-h-dvh")}>
      <div
        dir={language?.dir ?? "ltr"}
        className={cn(
          "mx-auto max-w-[430px] bg-paper",
          isEmbedded ? "min-h-full" : "min-h-dvh",
          language ? scriptFont(language.base) : "font-sans",
        )}
      >
        {children}
      </div>
    </div>
  );
}
