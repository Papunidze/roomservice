import { create } from "qrcode";

interface QrCodeProps {
  value: string;
  className?: string;
}

export function QrCode({ value, className }: QrCodeProps) {
  const { modules } = create(value, { errorCorrectionLevel: "M" });
  const size = modules.size;
  const cells: string[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (modules.get(row, col)) cells.push(`M${col} ${row}h1v1h-1z`);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={value}
      className={className}
    >
      <path d={cells.join("")} fill="currentColor" />
    </svg>
  );
}
