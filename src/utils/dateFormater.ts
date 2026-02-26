export function toDateInputValue(isoOrNull: string | null) {
  return String(isoOrNull).slice(0, 10);
}

export function fromDateInputValue(dateStr: string) {
  if (!dateStr) return null;
  return new Date(`${dateStr}T00:00:00.000Z`).toISOString();
}

export function formatPeriod(dateStartIso: string, dateEndIso: string | null): string {
  const start = dateStartIso
    ? new Date(dateStartIso).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
    })
    : "—";

  const end = dateEndIso
    ? new Date(dateEndIso).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
    })
    : "н.в.";

  return `${start} — ${end}`;
}