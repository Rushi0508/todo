import type { TodoItem, DayGroup } from "./types";

export function groupTodosByDate(items: TodoItem[]): DayGroup[] {
  const groups = new Map<string, TodoItem[]>();

  for (const item of items) {
    const date = new Date(item.createdAt).toLocaleDateString("en-CA");
    const existing = groups.get(date);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(date, [item]);
    }
  }

  return Array.from(groups.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, items]) => ({ date, items }));
}

export function formatDateHeading(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const target = new Date(dateStr + "T00:00:00");

  if (target.getTime() === today.getTime()) return "Today";
  if (target.getTime() === yesterday.getTime()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimestamp(isoString: string): string {
  const d = new Date(isoString);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${time}`;
}
