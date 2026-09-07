"use client";

import { useCallback, useState } from "react";

import {
  appendMessage,
  createRequest,
  customGuestLanguage,
  guestLanguage,
  useRequests,
  type CheckoutOption,
  type Dish,
  type GuestLanguage,
  type ItemKey,
  type ProblemKey,
  type Request,
} from "@/features/requests";
import { DICTIONARY, scriptFont, type LangCode } from "@/shared/i18n";
import { cn } from "@/shared/lib/cn";

import {
  checkoutRequest,
  itemsRequest,
  problemRequest,
  serviceRequest,
} from "../build-request";
import type { GuestScreen } from "../screens";
import { HomeScreen } from "./HomeScreen";
import { HotelInfoScreen } from "./HotelInfoScreen";
import { ItemsScreen } from "./ItemsScreen";
import { LanguageScreen } from "./LanguageScreen";
import { LanguageSheet } from "./LanguageSheet";
import { LateCheckoutScreen } from "./LateCheckoutScreen";
import { PrimaryAction } from "./PrimaryAction";
import { ProblemScreen } from "./ProblemScreen";
import { RoomServiceScreen } from "./RoomServiceScreen";
import { SuccessScreen } from "./SuccessScreen";
import { TrackScreen } from "./TrackScreen";

export function GuestApp({ room }: { room: string }) {
  const requests = useRequests();
  const [language, setLanguage] = useState<GuestLanguage | null>(null);
  const [screen, setScreen] = useState<GuestScreen>("language");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  const active = requests.find((request) => request.id === activeId);
  const showTracking = useCallback(() => setScreen("track"), []);

  const pickLanguage = (next: GuestLanguage) => {
    setLanguage(next);
    setSheetOpen(false);
    if (screen === "language") setScreen("home");
  };

  if (!language) {
    return (
      <GuestFrame language={null}>
        <LanguageScreen
          room={room}
          onPick={(code) => pickLanguage(guestLanguage(code))}
          onPickCustom={(name) => pickLanguage(customGuestLanguage(name))}
        />
      </GuestFrame>
    );
  }

  const phrases = DICTIONARY[language.base];
  const submit = (draft: Omit<Request, "id">) => {
    setActiveId(createRequest(draft));
    setScreen("success");
  };

  const base = { room, language };
  const goHome = () => setScreen("home");

  return (
    <GuestFrame language={language}>
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
          onBack={goHome}
          onSubmit={(counts: Partial<Record<ItemKey, number>>) =>
            submit(itemsRequest(base, counts))
          }
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
        <HotelInfoScreen phrases={phrases} onBack={goHome} />
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
            onReply={(text) =>
              appendMessage(active.id, {
                from: "guest",
                lang: language.base,
                text,
                translations: {},
                minutesAgo: 0,
              })
            }
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
  children,
}: {
  language: GuestLanguage | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      <div
        dir={language?.dir ?? "ltr"}
        className={cn(
          "mx-auto min-h-dvh max-w-[430px] bg-paper",
          language ? scriptFont(language.base) : "font-sans",
        )}
      >
        {children}
      </div>
    </div>
  );
}
