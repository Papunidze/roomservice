import { QrCode } from "lucide-react";

export function PlateMissing() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <QrCode strokeWidth={1.4} className="size-9 text-sage" />
      <h1 className="mt-5 text-[22px] leading-tight font-semibold tracking-[-0.03em]">
        Scan the plate in your room
      </h1>
      <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
        This link is missing its room code or the plate has been replaced. Point
        your camera at the QR plate again, or ask the front desk.
      </p>
    </div>
  );
}
