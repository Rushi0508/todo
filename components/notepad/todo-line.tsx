"use client";

import { useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { TodoItem } from "@/lib/types";

interface TodoLineProps {
  item: TodoItem;
  onToggle: (id: string, completed: boolean) => void;
  onUpdateText: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onEnter: (afterId: string) => void;
  autoFocus?: boolean;
}

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = "0";
  el.style.height = `${el.scrollHeight}px`;
}

export function TodoLine({ item, onToggle, onUpdateText, onDelete, onEnter, autoFocus = false }: TodoLineProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (textareaRef.current) {
      autoResize(textareaRef.current);
    }
  }, []);

  const flushDebounce = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      flushDebounce();
      const val = textareaRef.current?.value ?? item.text;
      if (val.trim() || item.text.trim()) {
        onUpdateText(item.id, val);
      }
      onEnter(item.id);
      return;
    }

    if (e.key === "Backspace" && textareaRef.current?.value === "" && !item.text) {
      e.preventDefault();
      onDelete(item.id);
    }
  };

  const handleInput = () => {
    if (textareaRef.current) autoResize(textareaRef.current);
  };

  const handleChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdateText(item.id, value);
    }, 500);
  };

  return (
    <div className={`flex items-start gap-2 py-[3px] px-1 rounded-sm transition-colors`}>
      <Checkbox
        checked={item.completed}
        onCheckedChange={(checked) => onToggle(item.id, checked === true)}
        className="mt-[3px] shrink-0"
      />
      <textarea
        ref={textareaRef}
        rows={1}
        defaultValue={item.text}
        onChange={(e) => handleChange(e.target.value)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Type something..."
        className={`flex-1 resize-none bg-transparent text-sm leading-snug outline-none placeholder:text-muted-foreground/40 ${
          item.completed ? "line-through" : "text-foreground"
        }`}
      />
    </div>
  );
}
