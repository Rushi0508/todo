"use client";

import { useState, useCallback, useRef, useEffect, type KeyboardEvent } from "react";
import {
  useTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "@/queries/todo-queries";
import { groupTodosByDate, filterTodos, searchTodos } from "@/lib/todo-helpers";
import type { TodoFilter } from "@/lib/types";
import { DaySection } from "./day-section";
import { TodoNavbar } from "./todo-navbar";

export function Notepad() {
  const { data: items = [], isLoading } = useTodosQuery();
  const createMutation = useCreateTodoMutation();
  const updateMutation = useUpdateTodoMutation();
  const deleteMutation = useDeleteTodoMutation();

  const [focusId, setFocusId] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [search, setSearch] = useState("");
  const bottomInputRef = useRef<HTMLTextAreaElement>(null);

  const searched = searchTodos(items, search);
  const filtered = filterTodos(searched, filter);
  const groups = groupTodosByDate(filtered);

  const todayKey = new Date().toLocaleDateString("en-CA");
  const hasToday = groups.some((g) => g.date === todayKey);

  const isFiltering = filter !== "all" || search.trim().length > 0;

  useEffect(() => {
    if (!isLoading && items.length === 0) {
      bottomInputRef.current?.focus();
    }
  }, [isLoading, items.length]);

  const handleToggle = useCallback(
    (id: string, completed: boolean) => {
      updateMutation.mutate({ id, completed });
    },
    [updateMutation],
  );

  const handleUpdateText = useCallback(
    (id: string, text: string) => {
      updateMutation.mutate({ id, text });
    },
    [updateMutation],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const handleEnter = useCallback(
    (_afterId: string) => {
      createMutation.mutate("", {
        onSuccess: (newItem) => setFocusId(newItem.id),
      });
    },
    [createMutation],
  );

  const handleBottomKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const input = e.currentTarget;
        const text = input.value;
        input.value = "";

        createMutation.mutate(text, {
          onSuccess: (newItem) => {
            if (text.trim()) {
              bottomInputRef.current?.focus();
            } else {
              setFocusId(newItem.id);
            }
          },
        });
      }
    },
    [createMutation],
  );

  const handleBottomBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      const text = e.currentTarget.value.trim();
      if (text) {
        e.currentTarget.value = "";
        createMutation.mutate(text);
      }
    },
    [createMutation],
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <TodoNavbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className="flex-1 flex flex-col w-full max-w-2xl mx-auto px-5 pt-6 pb-4 sm:px-8">
        <div className="flex-1">
          {!isFiltering && !hasToday && groups.length > 0 && (
            <div className="mb-5">
              <div className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm pt-3 pb-1 mb-0.5">
                <h2 className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">Today</h2>
                <div className="h-px bg-border mt-1" />
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {search.trim()
                ? "No todos match your search."
                : filter === "completed"
                  ? "No completed todos yet."
                  : filter === "pending"
                    ? "All caught up!"
                    : null}
            </div>
          )}

          {groups.map((group) => (
            <DaySection
              key={group.date}
              group={group}
              onToggle={handleToggle}
              onUpdateText={handleUpdateText}
              onDelete={handleDelete}
              onEnter={handleEnter}
              focusId={focusId}
            />
          ))}
        </div>

        {!isFiltering && (
          <div className="sticky bottom-0 bg-background pt-2 pb-4">
            <div className="flex items-start gap-2 p-4 border rounded-md">
              <div className="size-4 shrink-0 mt-[3px] rounded-[4px] border border-dashed border-muted-foreground" />
              <textarea
                ref={bottomInputRef}
                rows={1}
                placeholder={items.length === 0 ? "Start typing your first task..." : "Add a new task..."}
                onKeyDown={handleBottomKeyDown}
                onBlur={handleBottomBlur}
                className="flex-1 resize-none bg-transparent text-sm leading-snug outline-none text-foreground"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
