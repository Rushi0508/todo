"use client";

import type { DayGroup } from "@/lib/types";
import { formatDateHeading } from "@/lib/todo-helpers";
import { TodoLine } from "./todo-line";

interface DaySectionProps {
  group: DayGroup;
  onToggle: (id: string, completed: boolean) => void;
  onUpdateText: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onEnter: (afterId: string) => void;
  focusId: string | null;
}

export function DaySection({ group, onToggle, onUpdateText, onDelete, onEnter, focusId }: DaySectionProps) {
  return (
    <div className="mb-5">
      <div className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm pt-3 pb-1 mb-0.5">
        <h2 className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
          {formatDateHeading(group.date)}
        </h2>
        <div className="h-px bg-border mt-1" />
      </div>
      <div>
        {group.items.map((item) => (
          <TodoLine
            key={item.id}
            item={item}
            onToggle={onToggle}
            onUpdateText={onUpdateText}
            onDelete={onDelete}
            onEnter={onEnter}
            autoFocus={item.id === focusId}
          />
        ))}
      </div>
    </div>
  );
}
