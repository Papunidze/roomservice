import type { ObjectId } from "mongodb";

import { requests } from "../db.js";
import type { LangCode } from "../domain.js";
import { publish } from "../lib/events.js";
import { isTranslationEnabled, translate } from "../lib/translate.js";
import type { MessageDoc } from "./types.js";

interface Target {
  hotelId: ObjectId;
  seq: number;
  roomNo: string;
}

export function translateInBackground(
  target: Target,
  message: MessageDoc,
  into: LangCode[],
) {
  if (!isTranslationEnabled()) return;
  const missing = into.filter(
    (code) => code !== message.lang && !message.translations[code],
  );
  if (missing.length === 0) return;

  void translate(message.text, message.lang, missing)
    .then(async (translations) => {
      const $set = Object.fromEntries(
        Object.entries(translations).map(([code, text]) => [
          `thread.$.translations.${code}`,
          text,
        ]),
      );
      if (Object.keys($set).length === 0) return;

      await requests().updateOne(
        { hotelId: target.hotelId, seq: target.seq, "thread.id": message.id },
        { $set: { ...$set, updatedAt: new Date() } },
      );
      publish(target.hotelId.toHexString(), {
        type: "request",
        id: target.seq,
        room: target.roomNo,
      });
    })
    .catch((error: unknown) => console.error("[translate]", error));
}
