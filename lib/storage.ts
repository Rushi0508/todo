import fs from "fs";
import path from "path";
import type { TodoItem, TodoStore } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "todos.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): TodoStore {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return { items: [] };
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as TodoStore;
}

function writeStore(store: TodoStore): void {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export function getAllTodos(): TodoItem[] {
  return readStore().items;
}

export function addTodo(item: TodoItem): TodoItem {
  const store = readStore();
  store.items.push(item);
  writeStore(store);
  return item;
}

export function updateTodo(
  id: string,
  updates: Partial<Pick<TodoItem, "text" | "completed" | "completedAt">>
): TodoItem | null {
  const store = readStore();
  const index = store.items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store.items[index] = { ...store.items[index], ...updates };
  writeStore(store);
  return store.items[index];
}

export function deleteTodo(id: string): boolean {
  const store = readStore();
  const initialLength = store.items.length;
  store.items = store.items.filter((item) => item.id !== id);
  if (store.items.length === initialLength) return false;
  writeStore(store);
  return true;
}
