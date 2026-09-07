import { UNASSIGNED } from "@/features/requests";

export function initials(name: string) {
  if (name === UNASSIGNED) return "··";
  const parts = name.split(" ");
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}
