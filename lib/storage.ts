import { Redis } from "@upstash/redis";
import type { TodoItem, TodoStore } from "./types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const STORE_KEY = "todo_store";

async function readStore(): Promise<TodoStore> {
  const data = await redis.get<TodoStore>(STORE_KEY);
  return data ?? { items: [] };
}

async function writeStore(store: TodoStore): Promise<void> {
  await redis.set(STORE_KEY, store);
}

export async function getAllTodos(): Promise<TodoItem[]> {
  const store = await readStore();
  return store.items;
}

export async function addTodo(item: TodoItem): Promise<TodoItem> {
  const store = await readStore();
  store.items.push(item);
  await writeStore(store);
  return item;
}

export async function updateTodo(
  id: string,
  updates: Partial<Pick<TodoItem, "text" | "completed" | "completedAt">>
): Promise<TodoItem | null> {
  const store = await readStore();
  const index = store.items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store.items[index] = { ...store.items[index], ...updates };
  await writeStore(store);
  return store.items[index];
}

export async function deleteTodo(id: string): Promise<boolean> {
  const store = await readStore();
  const initialLength = store.items.length;
  store.items = store.items.filter((item) => item.id !== id);
  if (store.items.length === initialLength) return false;
  await writeStore(store);
  return true;
}
