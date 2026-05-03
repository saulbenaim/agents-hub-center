export function relativeTime(iso: string | null, now: Date = new Date()): string {
  if (!iso) return "never";
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  if (Number.isNaN(diffMs)) return "never";

  const sec = Math.round(diffMs / 1000);
  if (sec < 60) return sec <= 1 ? "just now" : `${sec} sec ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
  return then.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function isToday(iso: string, now: Date = new Date()): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
