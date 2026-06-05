export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatDate(
  value?: string | null,
  options?: Intl.DateTimeFormatOptions
) {
  if (!value) return "TBD";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(date);
}

export function formatRelativeDate(value?: string | null) {
  if (!value) return "No deadline";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = date.getTime() - Date.now();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (Math.abs(diffHours) < 24) {
    if (diffHours >= 0) return `${diffHours || 0}h left`;
    return `${Math.abs(diffHours)}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays >= 0) return `${diffDays}d left`;
  return `${Math.abs(diffDays)}d ago`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function prettifyLabel(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getHostnameFromUrl(value?: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}
