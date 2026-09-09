import type { Request } from "@/features/requests";

const HEADER = [
  "id",
  "room",
  "category",
  "urgency",
  "status",
  "assignee",
  "language",
  "created",
  "first message",
];

const cell = (value: string | number) =>
  `"${String(value).replace(/"/g, '""')}"`;

export function requestsToCsv(requests: Request[]) {
  const rows = requests.map((request) => [
    request.id,
    request.room,
    request.category,
    request.urgency,
    request.status,
    request.assignee,
    request.language.name,
    request.createdAt ?? "",
    request.thread[0]?.translations.en ?? request.thread[0]?.text ?? "",
  ]);
  return [HEADER, ...rows].map((row) => row.map(cell).join(",")).join("\n");
}

export function downloadRequestsCsv(requests: Request[]) {
  const blob = new Blob([requestsToCsv(requests)], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `roomcall-requests-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
