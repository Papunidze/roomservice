export function openPlatePrint(numbers: string[]) {
  const query = numbers.length > 0 ? `?rooms=${numbers.join(",")}` : "";
  window.open(`/plates${query}`, "_blank", "noopener");
}
